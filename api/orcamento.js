/**
 * POST /api/orcamento
 *
 * Recebe o formulário de orçamento e envia o e-mail para a equipa comercial,
 * sem passar pelo programa de e-mail do visitante.
 *
 * O envio é feito pelo Resend (https://resend.com). Enquanto a chave não estiver
 * definida, a função responde 503 e o site volta sozinho ao comportamento
 * anterior (abre o programa de e-mail do visitante) — nenhum pedido se perde.
 *
 * Variáveis de ambiente (Vercel → Settings → Environment Variables):
 *   RESEND_API_KEY   obrigatória
 *   ORCAMENTO_TO     opcional — destino. Predefinido: comercial@solutionmetal.com
 *   ORCAMENTO_FROM   opcional — remetente verificado no Resend. TEM de ser do
 *                    domínio verificado (solutionmetalgroup.com, o domínio
 *                    oficial do site) — o e-mail da empresa está noutro domínio.
 *                    Predefinido: SMG site <formulario@solutionmetalgroup.com>
 *   RESEND_BASE      opcional — só para testes locais (aponta para um stub).
 *
 * Limites dos anexos (iguais aos do site, em assets/site.js):
 *   3 ficheiros · 3 MB por ficheiro · 3 MB no conjunto.
 * A Vercel só aceita ~4,5 MB no corpo do pedido e o Base64 acrescenta ~33%, por
 * isso o limite de ficheiros é de 3 MB: assim 3 MB de ficheiros cabem no corpo
 * com folga e a função consegue responder com uma mensagem clara, em vez de
 * deixar a plataforma cortar o pedido antes de o podermos explicar.
 */

const DESTINO = process.env.ORCAMENTO_TO || "comercial@solutionmetal.com";
const REMETENTE =
  process.env.ORCAMENTO_FROM || "SMG site <formulario@solutionmetalgroup.com>";
const LIMITE_CORPO = 4.2 * 1024 * 1024;

/* limites dos anexos — iguais aos do site (assets/site.js) */
const ANEXO_MAX = 3;
const ANEXO_BYTES = 3 * 1024 * 1024;
const ANEXO_TOTAL = 3 * 1024 * 1024;

/* diagnóstico: aparece em Vercel → Deployments → Functions (Runtime Logs).
   Serve para confirmar que as variáveis de ambiente foram aplicadas. */
console.log(`[orcamento] destino: ${DESTINO} | remetente: ${REMETENTE}`);

/* ordem e legenda dos campos no e-mail */
const CAMPOS = [
  ["empresa", "Empresa"],
  ["projeto", "Nome e referência do projeto"],
  ["local", "Local da obra"],
  ["pais", "País"],
  ["profissionais", "Número de profissionais"],
  ["inicio", "Data prevista de início"],
  ["duracao", "Duração prevista"],
  ["turnos", "Turnos"],
  ["descricao", "Descrição e dimensão do trabalho"],
  ["alojamento", "Alojamento necessário"],
  ["logistica", "Apoio logístico"],
  ["pessoa", "Pessoa de contacto"],
  ["cargo", "Cargo"],
  ["email", "E-mail"],
  ["telefone", "Telefone / WhatsApp"],
  ["outro_servico", "Outros serviços (especificado)"],
];

function escapar(valor) {
  return String(valor).replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );
}

function texto(valor) {
  return String(valor == null ? "" : valor).trim();
}

const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ---------------- anexos ----------------
   Formatos aceites, tipo MIME que enviamos ao Resend e a assinatura (magic
   bytes) que confirma que o ficheiro é mesmo daquele formato. O tipo e a
   extensão declarados pelo browser não servem como prova. */
const ANEXO_LIVRES = ["", "application/octet-stream", "binary/octet-stream"];
const ASSINATURA_ZIP = [
  [0x50, 0x4b, 0x03, 0x04],
  [0x50, 0x4b, 0x05, 0x06],
  [0x50, 0x4b, 0x07, 0x08],
];
const ANEXO_TIPOS = {
  pdf: {
    aceites: ["application/pdf"],
    envio: "application/pdf",
    assinaturas: [[0x25, 0x50, 0x44, 0x46]],
  },
  jpg: {
    aceites: ["image/jpeg"],
    envio: "image/jpeg",
    assinaturas: [[0xff, 0xd8, 0xff]],
  },
  jpeg: {
    aceites: ["image/jpeg"],
    envio: "image/jpeg",
    assinaturas: [[0xff, 0xd8, 0xff]],
  },
  png: {
    aceites: ["image/png"],
    envio: "image/png",
    assinaturas: [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  },
  zip: {
    aceites: [
      "application/zip",
      "application/x-zip-compressed",
      "multipart/x-zip",
      "application/x-compressed",
    ],
    envio: "application/zip",
    assinaturas: ASSINATURA_ZIP,
  },
  docx: {
    aceites: [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/zip",
    ],
    envio:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    assinaturas: ASSINATURA_ZIP,
  },
  xlsx: {
    aceites: [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/zip",
    ],
    envio: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    assinaturas: ASSINATURA_ZIP,
  },
  dwg: {
    aceites: [
      "image/vnd.dwg",
      "image/x-dwg",
      "application/acad",
      "application/x-acad",
      "application/dwg",
    ],
    envio: "image/vnd.dwg",
    /* ficheiros DWG começam por "AC10" */
    assinaturas: [[0x41, 0x43, 0x31, 0x30]],
  },
};

const MENSAGENS = {
  invalid_body: "Não foi possível ler os dados enviados.",
  campos_em_falta: "Preencha a empresa e o e-mail.",
  anexos_invalidos: "Os anexos enviados não são válidos.",
  anexo_quantidade: "Pode anexar no máximo 3 ficheiros.",
  anexo_muito_grande: "Cada ficheiro pode ter no máximo 3 MB.",
  anexo_total: "O conjunto de anexos pode ter no máximo 3 MB.",
  anexo_formato:
    "Formato de ficheiro não aceite. Use PDF, DWG, ZIP, DOCX, XLSX, JPG ou PNG.",
  anexo_invalido: "Um dos ficheiros está corrompido ou ilegível.",
  corpo_demasiado_grande:
    "O pedido é demasiado grande. Reduza o tamanho dos ficheiros e tente novamente.",
};

/* erro com uma mensagem que o site consegue mostrar directamente */
function recusar(res, http, error) {
  res.status(http).json({ error, mensagem: MENSAGENS[error] || "" });
}

function extensaoDe(nome) {
  const m = /\.([A-Za-z0-9]+)$/.exec(nome);
  return m ? m[1].toLowerCase() : "";
}

/* tira caminhos, caracteres de controlo e nomes com ar de ataque */
function nomeSeguro(valor) {
  const bruto = texto(valor).replace(/\\/g, "/");
  const base = bruto.slice(bruto.lastIndexOf("/") + 1);
  const limpo = base
    .replace(/[\u0000-\u001f\u007f<>:"|?*]/g, "")
    .replace(/^\.+/, "")
    .trim();
  if (!limpo || limpo.length > 120) return "";
  return limpo;
}

const BASE64_OK = /^[A-Za-z0-9+/]+={0,2}$/;

/* devolve o número de bytes, ou -1 se o Base64 estiver malformado */
function bytesDeBase64(valor) {
  if (!BASE64_OK.test(valor) || valor.length % 4 !== 0) return -1;
  const recheio = (valor.match(/=+$/) || [""])[0].length;
  return (valor.length / 4) * 3 - recheio;
}

function assinaturaOk(chave, cabeca) {
  const regra = ANEXO_TIPOS[chave];
  if (!regra) return false;
  return regra.assinaturas.some((assinatura) =>
    assinatura.every((byte, i) => cabeca[i] === byte),
  );
}

/* valida tudo do lado do servidor; o browser não é fronteira de segurança */
function validarAnexos(lista) {
  if (lista == null) return { anexos: [], total: 0 };
  if (!Array.isArray(lista)) return { erro: "anexos_invalidos" };
  if (lista.length > ANEXO_MAX) return { erro: "anexo_quantidade" };
  const saida = [];
  let total = 0;
  for (const item of lista) {
    if (!item || typeof item !== "object") return { erro: "anexos_invalidos" };
    const nome = nomeSeguro(item.nome);
    if (!nome) return { erro: "anexos_invalidos" };
    const chave = extensaoDe(nome);
    const regra = ANEXO_TIPOS[chave];
    if (!regra) return { erro: "anexo_formato" };
    const tipo = texto(item.tipo).toLowerCase();
    if (tipo && !ANEXO_LIVRES.includes(tipo) && !regra.aceites.includes(tipo)) {
      return { erro: "anexo_formato" };
    }
    const conteudo = texto(item.conteudo).replace(/[\r\n]/g, "");
    const bytes = bytesDeBase64(conteudo);
    if (bytes <= 0) return { erro: "anexo_invalido" };
    if (bytes > ANEXO_BYTES) return { erro: "anexo_muito_grande" };
    total += bytes;
    if (total > ANEXO_TOTAL) return { erro: "anexo_total" };
    const cabeca = Buffer.from(conteudo.slice(0, 24), "base64");
    if (!assinaturaOk(chave, cabeca)) return { erro: "anexo_formato" };
    saida.push({
      filename: nome,
      content: conteudo,
      content_type: regra.envio,
    });
  }
  return { anexos: saida, total };
}

async function lerCorpo(req) {
  if (req.body && typeof req.body === "object") return req.body;
  const partes = [];
  let total = 0;
  for await (const pedaco of req) {
    total += pedaco.length;
    if (total > LIMITE_CORPO) throw new Error("corpo demasiado grande");
    partes.push(pedaco);
  }
  return JSON.parse(Buffer.concat(partes).toString("utf8"));
}

function dataLegivel(data) {
  try {
    return `${data.toLocaleString("pt-PT", {
      timeZone: "Europe/Lisbon",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })} (Lisboa)`;
  } catch (e) {
    return data.toISOString();
  }
}

/* O logo entra no e-mail como imagem normal da mensagem (por link), não como
   anexo: o cliente de e-mail mostra-o no cabeçalho e não o apresenta como
   ficheiro. Quando o site passar a responder no domínio próprio, basta definir
   ORCAMENTO_SITE (ou ORCAMENTO_LOGO) nas variáveis de ambiente da Vercel. */
const URL_SITE = (
  process.env.ORCAMENTO_SITE || "https://talude-bay.vercel.app"
).replace(/\/+$/, "");

const LOGO = (() => {
  const escolhido =
    process.env.ORCAMENTO_LOGO || `${URL_SITE}/assets/img/logo-email.png`;
  if (/^https?:\/\/[^\s"']+$/i.test(escolhido.trim())) return escolhido.trim();
  console.error(
    `[orcamento] URL do logo inválido (${escolhido}) — o e-mail segue sem imagem`,
  );
  return "";
})();

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  /* sem chave configurada: o site assume o envio pelo programa de e-mail */
  if (!process.env.RESEND_API_KEY) {
    res.status(503).json({ error: "not_configured" });
    return;
  }

  let dados;
  try {
    dados = await lerCorpo(req);
  } catch (e) {
    if (e && e.message === "corpo demasiado grande") {
      recusar(res, 413, "corpo_demasiado_grande");
      return;
    }
    recusar(res, 400, "invalid_body");
    return;
  }

  /* armadilha anti-spam: finge sucesso e não envia nada */
  if (texto(dados.website)) {
    res.status(200).json({ ok: true });
    return;
  }

  const empresa = texto(dados.empresa);
  const email = texto(dados.email);
  if (!empresa || !email) {
    recusar(res, 400, "campos_em_falta");
    return;
  }

  const validado = validarAnexos(dados.anexos);
  if (validado.erro) {
    console.log(`[orcamento] anexos recusados: ${validado.erro}`);
    const pesado =
      validado.erro === "anexo_muito_grande" || validado.erro === "anexo_total";
    recusar(res, pesado ? 413 : 400, validado.erro);
    return;
  }
  const anexos = validado.anexos;
  if (anexos.length) {
    console.log(
      `[orcamento] anexos: ${anexos.length} (${Math.round(validado.total / 1024)} KB)`,
    );
  }

  const servicos = Array.isArray(dados.servico)
    ? dados.servico.map(texto).filter(Boolean)
    : [];
  /* quando o cliente escolhe vários serviços, envia a quantidade de cada um */
  const servicosDetalhados = texto(dados.servicos_com_quantidade);
  const ficheiros = Array.isArray(dados.ficheiros)
    ? dados.ficheiros.map(texto).filter(Boolean)
    : [];

  const linhas = CAMPOS.map(([chave, rotulo]) => [
    rotulo,
    texto(dados[chave]),
  ]).filter(([, valor]) => valor);
  if (servicos.length)
    linhas.splice(5, 0, [
      "Serviços pretendidos",
      servicosDetalhados || servicos.join(", "),
    ]);
  if (anexos.length) {
    linhas.push([
      "Anexos (seguem com este e-mail)",
      anexos.map((a) => a.filename).join(", "),
    ]);
  } else if (ficheiros.length) {
    /* site antigo: só vinham os nomes */
    linhas.push(["Ficheiros referidos pelo cliente", ficheiros.join(", ")]);
  }

  const assunto = texto(`Pedido de proposta — ${empresa}`)
    .replace(/[\r\n]+/g, " ")
    .slice(0, 180);

  const quando = dataLegivel(new Date());

  const corpoTexto = [
    "SOLUTION METAL GROUP",
    "Pedido de proposta — formulário do site",
    "",
    ...linhas.map(([rotulo, valor]) => `${rotulo}: ${valor}`),
    "",
    `Recebido em ${quando}`,
  ].join("\n");

  const cabecalhoLogo = LOGO
    ? `<img src="${escapar(LOGO)}" alt="Solution Metal Group" width="140" style="display:block;width:140px;max-width:140px;height:auto;margin:0 auto;border:0;outline:none;text-decoration:none">`
    : `<div style="font-size:20px;font-weight:bold;letter-spacing:0.06em;color:#282220">SOLUTION <span style="color:#a8602f">METAL</span> GROUP</div>`;

  const corpoHtml = `<!doctype html><html lang="pt"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pedido de proposta</title></head><body style="margin:0;padding:0;background:#f4f1ee;font-family:Arial,Helvetica,sans-serif;color:#282220">
<div style="max-width:640px;margin:0 auto;padding:24px 16px">
  <div style="background:#ffffff;border:1px solid #ece7e2;border-radius:10px;overflow:hidden">
    <div style="padding:26px 24px 20px;text-align:center">${cabecalhoLogo}</div>
    <div style="height:3px;background:#a8602f;font-size:0;line-height:0">&nbsp;</div>
    <div style="padding:22px 24px 0">
      <h1 style="margin:0 0 4px;font-size:19px;line-height:1.3;color:#282220">Pedido de proposta</h1>
      <p style="margin:0;font-size:13px;color:#6b625a">Enviado pelo formulário do site</p>
    </div>
    <table role="presentation" style="width:100%;border-collapse:collapse;margin-top:20px">
      ${linhas
        .map(
          ([rotulo, valor]) =>
            `<tr><th style="text-align:left;vertical-align:top;padding:10px 14px 10px 24px;width:210px;border-top:1px solid #ece7e2;font-size:13px;color:#6b625a;font-weight:600">${escapar(
              rotulo,
            )}</th><td style="padding:10px 24px 10px 14px;border-top:1px solid #ece7e2;font-size:14px;color:#282220">${escapar(
              valor,
            ).replace(/\n/g, "<br>")}</td></tr>`,
        )
        .join("")}
    </table>
    <div style="padding:18px 24px 22px">
      <p style="margin:0;font-size:12px;color:#6b625a">Recebido em ${quando}</p>
    </div>
  </div>
</div></body></html>`;

  const base = process.env.RESEND_BASE || "https://api.resend.com";

  let resposta;
  try {
    resposta = await fetch(`${base}/emails`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: REMETENTE,
        to: [DESTINO],
        subject: assunto,
        html: corpoHtml,
        text: corpoTexto,
        ...(EMAIL_OK.test(email) ? { reply_to: email } : {}),
        ...(anexos.length ? { attachments: anexos } : {}),
      }),
    });
  } catch (e) {
    console.error(
      "[orcamento] falha de rede ao contactar o Resend:",
      e && e.message,
    );
    res.status(502).json({ error: "send_failed" });
    return;
  }

  if (!resposta.ok) {
    let detalhe = "";
    try {
      detalhe = await resposta.text();
    } catch (e) {
      /* ignora */
    }
    console.error(
      `[orcamento] o Resend recusou o envio (HTTP ${resposta.status}): ${detalhe}`,
    );
    res.status(502).json({ error: "send_failed" });
    return;
  }

  let id = "";
  try {
    id = (await resposta.json()).id || "";
  } catch (e) {
    /* ignora */
  }
  console.log(`[orcamento] enviado para ${DESTINO} (id ${id})`);
  res.status(200).json({ ok: true });
};
