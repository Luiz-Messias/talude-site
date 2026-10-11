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
 *   ORCAMENTO_FROM   opcional — remetente verificado no Resend.
 *                    Predefinido: SMG site <formulario@solutionmetal.com>
 *   RESEND_BASE      opcional — só para testes locais (aponta para um stub).
 */

const DESTINO = process.env.ORCAMENTO_TO || "comercial@solutionmetal.com";
const REMETENTE =
  process.env.ORCAMENTO_FROM || "SMG site <formulario@solutionmetal.com>";
const LIMITE_CORPO = 256 * 1024;

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

  const linhas = CAMPOS.map(([chave, rotulo]) => [rotulo, texto(dados[chave])]).filter(
    ([, valor]) => valor,
  );
  if (servicos.length) linhas.splice(5, 0, ["Serviços pretendidos", servicos.join(", ")]);
  if (ficheiros.length)
    linhas.push(["Ficheiros referidos pelo cliente", ficheiros.join(", ")]);

  const assunto = texto(`Pedido de proposta — ${empresa}`)
    .replace(/[\r\n]+/g, " ")
    .slice(0, 180);

  const corpoTexto = [
    ...linhas.map(([rotulo, valor]) => `${rotulo}: ${valor}`),
    "",
    `Recebido em ${new Date().toISOString()}`,
  ].join("\n");

  const corpoHtml = `<!doctype html><html lang="pt"><body style="margin:0;background:#f4f1ee;font-family:Arial,Helvetica,sans-serif;color:#1f1c19">
<div style="max-width:640px;margin:0 auto;padding:24px">
  <h1 style="margin:0 0 4px;font-size:20px">Pedido de proposta</h1>
  <p style="margin:0 0 20px;color:#6b625a;font-size:13px">Enviado pelo formulário do site</p>
  <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden">
    ${linhas
      .map(
        ([rotulo, valor]) =>
          `<tr><th style="text-align:left;vertical-align:top;padding:10px 14px;width:210px;border-bottom:1px solid #ece7e2;font-size:13px;color:#6b625a;font-weight:600">${escapar(
            rotulo,
          )}</th><td style="padding:10px 14px;border-bottom:1px solid #ece7e2;font-size:14px">${escapar(
            valor,
          ).replace(/\n/g, "<br>")}</td></tr>`,
      )
      .join("")}
  </table>
  <p style="margin:18px 0 0;color:#6b625a;font-size:12px">Recebido em ${new Date().toISOString()}</p>
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
    res.status(502).json({ error: "send_failed" });
    return;
  }

  if (!resposta.ok) {
    res.status(502).json({ error: "send_failed" });
    return;
  }

  res.status(200).json({ ok: true });
};
