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
 */

const DESTINO = process.env.ORCAMENTO_TO || "comercial@solutionmetal.com";
const REMETENTE =
  process.env.ORCAMENTO_FROM || "SMG site <formulario@solutionmetalgroup.com>";
const LIMITE_CORPO = 256 * 1024;

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
    res.status(400).json({ error: "invalid_body" });
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
    res.status(400).json({ error: "campos_em_falta" });
    return;
  }

  const servicos = Array.isArray(dados.servico)
    ? dados.servico.map(texto).filter(Boolean)
    : [];
  const ficheiros = Array.isArray(dados.ficheiros)
    ? dados.ficheiros.map(texto).filter(Boolean)
    : [];

  const linhas = CAMPOS.map(([chave, rotulo]) => [
    rotulo,
    texto(dados[chave]),
  ]).filter(([, valor]) => valor);
  if (servicos.length)
    linhas.splice(5, 0, ["Serviços pretendidos", servicos.join(", ")]);
  if (ficheiros.length)
    linhas.push(["Ficheiros referidos pelo cliente", ficheiros.join(", ")]);

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
    ? `<img src="${escapar(LOGO)}" alt="Solution Metal Group" width="180" style="display:block;width:180px;max-width:180px;height:auto;margin:0 auto;border:0;outline:none;text-decoration:none">`
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
