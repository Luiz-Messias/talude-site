/* ---------------- traduções (PT = HTML · EN / ES = interface) ---------------- */
const I18N = {
  en: {
    /* navegação */
    "nav.home": "Home",
    "nav.services": "Areas of activity",
    "nav.portfolio": "Portfolio",
    "nav.about": "About us",
    "nav.contact": "Contact",
    "nav.imig": "Immigration support",
    "nav.workUs": "Work with us",
    /* hero */
    "hero.origin": "Steel structures and civil construction",
    "hero.origin.b": "Portugal · Spain · France",
    "hero.h1a": "Complete solutions in metal",
    "hero.h1b": "and construction.",
    "hero.lede":
      "We design, fabricate and erect steel structures and deliver civil construction to European standards — one single point of contact, from estimate to handover.",
    "hero.cta1": "Request a quote",
    "hero.cta2": "Talk to us",
    /* áreas de atuação */
    "act.eyebrow": "Areas of activity",
    "act.h": "What we do",
    "act.t1": "Steel structures",
    "act.d1":
      "Industrial buildings, mezzanines, stairs and roof structures. Cutting, bending and welding in our own workshop.",
    "act.t2": "Metalwork",
    "act.d2": "Metalworking, fabrication and machining with in-house means.",
    "act.t3": "Civil construction",
    "act.d3":
      "New build, extension and refurbishment, from concrete to finishes.",
    "act.t4": "More areas",
    "act.d4": "Additional services to be confirmed with the company.",
    "act.cta": "See all areas",
    "act.h2": "Areas of activity",
    "act.lede":
      "Metalworking and civil construction carried out by our own team, in Portugal, Spain and France.",
    "comp.eyebrow": "Complementary services",
    "comp.h": "Other services",
    "comp.p": "Services kept in a secondary role — details to be confirmed.",
    "comp.c1": "HR management",
    "comp.c2": "Immigration support",
    "comp.c3": "Other services",
    "comp.c1d": "Details to be confirmed.",
    "comp.c2d": "Separate service, provided by a partner entity.",
    "comp.c3d": "Details to be confirmed.",
    /* portfólio */
    "pf.eyebrow": "Portfolio",
    "pf.h": "Work delivered",
    "pf.p":
      "A selection of real projects. Captions to be confirmed with the company.",
    "pf.cta": "See the full portfolio",
    "pf.video": "On site — video",
    "pf.caption": "Caption to be confirmed",
    /* sobre nós */
    "ab.eyebrow": "About us",
    "ab.h": "Who we are",
    "ab.lede": "A company focused on serving other companies.",
    "ab.p":
      "Institutional content to be confirmed — the company's portfolio text will be added here.",
    "ab.cta": "Get to know Solution Metal Group",
    "ab.story.h": "Our story",
    "ab.presence": "Where we work",
    "ab.presence.p": "Portugal · Spain · France",
    "team.eyebrow": "Team",
    "team.h": "Our team",
    "team.lede": "The four partners — names, roles and bios to be confirmed.",
    "team.m1n": "Partner 1",
    "team.m1r": "Role",
    "team.m1b": "Bio to be confirmed.",
    "team.m2n": "Partner 2",
    "team.m2r": "Role",
    "team.m2b": "Bio to be confirmed.",
    "team.m3n": "Partner 3",
    "team.m3r": "Role",
    "team.m3b": "Bio to be confirmed.",
    "team.m4n": "Partner 4",
    "team.m4r": "Role",
    "team.m4b": "Bio to be confirmed.",
    "cl.eyebrow": "Clients",
    "cl.h": "Companies we work with",
    "cl.p": "Client logos and references to be confirmed.",
    "cl.l1": "Client 01",
    "cl.l2": "Client 02",
    "cl.l3": "Client 03",
    "cl.l4": "Client 04",
    "cl.l5": "Client 05",
    "cl.l6": "Client 06",
    /* contato */
    "ct.eyebrow": "Contact",
    "ct.h": "Contact",
    "ct.lede": "Send us a message or talk directly on WhatsApp.",
    "ct.addr": "Address to be confirmed",
    "ct.hours": "Opening hours to be confirmed",
    "ct.note": "We reply to quote requests within 2 working days.",
    "cta.eyebrow": "Contact",
    "cta.h": "Talk to us about your project",
    "cta.p": "Quote within 2 working days. Choose your preferred channel.",
    "cta.wa": "WhatsApp",
    "cta.mail": "Send an e-mail",
    "cta.quote": "Request a quote",
    /* formulários */
    "form.eyebrow": "Form",
    "form.send": "Send message",
    "form.sendq": "Request a quote",
    "form.company": "Company",
    "form.person": "Contact person",
    "form.email": "E-mail",
    "form.phone": "Phone",
    "form.subject": "Subject",
    "form.message": "Message",
    "form.name": "Full name",
    "form.type": "Type of work",
    "form.o1": "Steel structure",
    "form.o2": "Metalwork",
    "form.o3": "Civil construction",
    "form.o4": "Maintenance",
    "form.place": "Site location",
    "form.start": "Expected start",
    "form.brief": "Description of the work",
    "form.files": "Project or specifications (PDF, DWG)",
    "tw.area": "Area of interest",
    "tw.a1": "Metalwork",
    "tw.a2": "Civil construction",
    "tw.a3": "Administrative / management",
    "tw.a4": "Other area",
    "tw.msg": "Tell us about your experience",
    "tw.send": "Send application",
    /* trabalhe conosco */
    "tw.eyebrow": "Work with us",
    "tw.h": "Work with us",
    "tw.lede":
      "Spontaneous application. Send your area of interest and we keep your contact on file.",
    /* assessoria de imigração */
    "imig.eyebrow": "Immigration support",
    "imig.h": "Immigration support",
    "imig.lede":
      "Complementary service, provided by a partner entity and separate from the core activity.",
    "imig.sep": "Separate service",
    "imig.sepd":
      "Immigration support is provided by SMG Vistos, an independent partner entity with its own management. It is not part of Solution Metal Group's core offer and is not the focus of this website.",
    "imig.tab": "Service table",
    "imig.todo": "To be completed before publishing",
    "imig.todod":
      "The values in this table are intentionally blank. Fill them with the real prices.",
    "imig.inc": "Included in the price",
    "imig.state": "State fees (not kept by us)",
    "imig.p1": "Case analysis and process plan",
    "imig.p1d":
      "One hour of conversation, list of what you have and what is missing.",
    "imig.p2": "Full visa application assembly",
    "imig.p2d":
      "Forms, certified translation, document check and consulate appointment.",
    "imig.p3": "Follow-up until the decision",
    "imig.p3d": "Liaison with the consulate and AIMA.",
    "imig.p4": "Family reunification",
    "imig.p4d": "Process to bring spouse and children after being settled.",
    "imig.s1": "Consular visa fee",
    "imig.s2": "AIMA fee on arrival",
    "imig.s3": "Apostille and certificates",
    "imig.warn": "What we never do",
    "imig.warnd":
      "We do not guarantee visa approval — nobody can. We do not charge a percentage of salary. We do not keep passports or original documents.",
    "imig.legal":
      "Cases requiring legal representation are handled by a registered lawyer.",
    "imig.back": "Back to the main website",
    /* rodapé */
    "ft.tag": "Steel structures and civil construction",
    "ft.sitemap": "Sitemap",
    "ft.legal": "Legal",
    "ft.privacy": "Privacy policy",
    "ft.book": "Complaints book",
    /* próximos passos */
    "next.label": "Next",
    "next.k1": "See the portfolio",
    "next.k4": "Request a quote",
    "next.k5": "About us",
    "next.k6": "Talk to us",
    "crumb.home": "Home",
    /* mensagens */
    "ok.form": "Message sent. We will reply shortly.",
    "ok.o": "Request sent. We reply within 2 working days.",
    "ok.tw":
      "Application received. We keep your contact for future opportunities.",
    err: "Please check the required fields.",
  },
  es: {
    /* navegación */
    "nav.home": "Inicio",
    "nav.services": "Áreas de actuación",
    "nav.portfolio": "Portafolio",
    "nav.about": "Nosotros",
    "nav.contact": "Contacto",
    "nav.imig": "Asesoría de inmigración",
    "nav.workUs": "Trabaja con nosotros",
    /* hero */
    "hero.origin": "Estructuras metálicas y construcción civil",
    "hero.origin.b": "Portugal · España · Francia",
    "hero.h1a": "Soluciones completas en metal",
    "hero.h1b": "y construcción.",
    "hero.lede":
      "Proyectamos, fabricamos y montamos estructuras metálicas y ejecutamos obra civil con estándar europeo — un único interlocutor, del presupuesto a la entrega.",
    "hero.cta1": "Pedir presupuesto",
    "hero.cta2": "Hable con nosotros",
    /* áreas de actuación */
    "act.eyebrow": "Áreas de actuación",
    "act.h": "Qué hacemos",
    "act.t1": "Estructuras metálicas",
    "act.d1":
      "Naves industriales, entreplantas, escaleras y cubiertas. Corte, plegado y soldadura en taller propio.",
    "act.t2": "Metalistería",
    "act.d2": "Metalurgia, fabricación y mecanizado con medios propios.",
    "act.t3": "Construcción civil",
    "act.d3":
      "Obra nueva, ampliación y rehabilitación, del hormigón a los acabados.",
    "act.t4": "Más áreas",
    "act.d4": "Servicios adicionales a confirmar con la empresa.",
    "act.cta": "Ver todas las áreas",
    "act.h2": "Áreas de actuación",
    "act.lede":
      "Metalistería y construcción civil ejecutadas por nuestro propio equipo en Portugal, España y Francia.",
    "comp.eyebrow": "Servicios complementarios",
    "comp.h": "Otros servicios",
    "comp.p":
      "Servicios mantenidos en un papel secundario — detalles a confirmar.",
    "comp.c1": "Gestión de RR. HH.",
    "comp.c2": "Asesoría de inmigración",
    "comp.c3": "Otros servicios",
    "comp.c1d": "Detalles a confirmar.",
    "comp.c2d": "Servicio separado, prestado por una entidad colaboradora.",
    "comp.c3d": "Detalles a confirmar.",
    /* portafolio */
    "pf.eyebrow": "Portafolio",
    "pf.h": "Obra entregada",
    "pf.p":
      "Una selección de proyectos reales. Textos a confirmar con la empresa.",
    "pf.cta": "Ver el portafolio completo",
    "pf.video": "En obra — vídeo",
    "pf.caption": "Texto a confirmar",
    /* nosotros */
    "ab.eyebrow": "Nosotros",
    "ab.h": "Quiénes somos",
    "ab.lede": "Una empresa enfocada en atender a otras empresas.",
    "ab.p":
      "Contenido institucional a confirmar — aquí se añadirá el texto del portafolio de la empresa.",
    "ab.cta": "Conozca Solution Metal Group",
    "ab.story.h": "Nuestra historia",
    "ab.presence": "Dónde trabajamos",
    "ab.presence.p": "Portugal · España · Francia",
    "team.eyebrow": "Equipo",
    "team.h": "Nuestro equipo",
    "team.lede":
      "Los cuatro socios — nombres, cargos y biografías a confirmar.",
    "team.m1n": "Socio 1",
    "team.m1r": "Cargo",
    "team.m1b": "Bio a confirmar.",
    "team.m2n": "Socio 2",
    "team.m2r": "Cargo",
    "team.m2b": "Bio a confirmar.",
    "team.m3n": "Socio 3",
    "team.m3r": "Cargo",
    "team.m3b": "Bio a confirmar.",
    "team.m4n": "Socio 4",
    "team.m4r": "Cargo",
    "team.m4b": "Bio a confirmar.",
    "cl.eyebrow": "Clientes",
    "cl.h": "Empresas con las que trabajamos",
    "cl.p": "Logotipos y referencias de clientes a confirmar.",
    "cl.l1": "Cliente 01",
    "cl.l2": "Cliente 02",
    "cl.l3": "Cliente 03",
    "cl.l4": "Cliente 04",
    "cl.l5": "Cliente 05",
    "cl.l6": "Cliente 06",
    /* contacto */
    "ct.eyebrow": "Contacto",
    "ct.h": "Contacto",
    "ct.lede": "Envíenos un mensaje o hable directamente por WhatsApp.",
    "ct.addr": "Dirección a confirmar",
    "ct.hours": "Horario a confirmar",
    "ct.note": "Respondemos solicitudes de presupuesto en 2 días laborables.",
    "cta.eyebrow": "Contacto",
    "cta.h": "Hable con nosotros sobre su proyecto",
    "cta.p": "Presupuesto en 2 días laborables. Elija su canal preferido.",
    "cta.wa": "WhatsApp",
    "cta.mail": "Enviar correo",
    "cta.quote": "Pedir presupuesto",
    /* formularios */
    "form.eyebrow": "Formulario",
    "form.send": "Enviar mensaje",
    "form.sendq": "Pedir presupuesto",
    "form.company": "Empresa",
    "form.person": "Persona de contacto",
    "form.email": "Correo",
    "form.phone": "Teléfono",
    "form.subject": "Asunto",
    "form.message": "Mensaje",
    "form.name": "Nombre completo",
    "form.type": "Tipo de trabajo",
    "form.o1": "Estructura metálica",
    "form.o2": "Metalistería",
    "form.o3": "Construcción civil",
    "form.o4": "Mantenimiento",
    "form.place": "Lugar de la obra",
    "form.start": "Inicio previsto",
    "form.brief": "Descripción del trabajo",
    "form.files": "Proyecto o pliego (PDF, DWG)",
    "tw.area": "Área de interés",
    "tw.a1": "Metalistería",
    "tw.a2": "Construcción civil",
    "tw.a3": "Administrativo / gestión",
    "tw.a4": "Otra área",
    "tw.msg": "Cuéntenos su experiencia",
    "tw.send": "Enviar candidatura",
    /* trabaja con nosotros */
    "tw.eyebrow": "Trabaja con nosotros",
    "tw.h": "Trabaja con nosotros",
    "tw.lede":
      "Candidatura espontánea. Envíe su área de interés y guardamos su contacto.",
    /* asesoría de inmigración */
    "imig.eyebrow": "Asesoría de inmigración",
    "imig.h": "Asesoría de inmigración",
    "imig.lede":
      "Servicio complementario, prestado por una entidad colaboradora y separado de la actividad principal.",
    "imig.sep": "Servicio separado",
    "imig.sepd":
      "La asesoría de inmigración la presta SMG Vistos, entidad colaboradora independiente con gestión propia. No forma parte de la oferta principal de Solution Metal Group y no es el foco de este sitio.",
    "imig.tab": "Tabla de servicios",
    "imig.todo": "Por rellenar antes de publicar",
    "imig.todod":
      "Los valores de esta tabla están en blanco a propósito. Complételos con los precios reales.",
    "imig.inc": "Incluido en el valor",
    "imig.state": "Tasas del Estado (no se quedan con nosotros)",
    "imig.p1": "Análisis del caso y plan del proceso",
    "imig.p1d":
      "Una hora de conversación, lista de lo que tiene y de lo que falta.",
    "imig.p2": "Montaje completo de la solicitud de visado",
    "imig.p2d":
      "Formularios, traducción jurada, revisión de documentos y cita en el consulado.",
    "imig.p3": "Seguimiento hasta la decisión",
    "imig.p3d": "Interlocución con consulado y AIMA.",
    "imig.p4": "Reagrupación familiar",
    "imig.p4d": "Proceso para traer cónyuge e hijos.",
    "imig.s1": "Tasa consular del visado",
    "imig.s2": "Tasa de la AIMA a la llegada",
    "imig.s3": "Apostilla y certificados",
    "imig.warn": "Lo que nunca hacemos",
    "imig.warnd":
      "No garantizamos la aprobación del visado — nadie puede. No cobramos porcentaje del salario. No retenemos pasaportes ni documentos originales.",
    "imig.legal":
      "Los procesos que exigen representación jurídica son conducidos por abogado colegiado.",
    "imig.back": "Volver al sitio principal",
    /* pie */
    "ft.tag": "Estructuras metálicas y construcción civil",
    "ft.sitemap": "Mapa del sitio",
    "ft.legal": "Legal",
    "ft.privacy": "Política de privacidad",
    "ft.book": "Libro de reclamaciones",
    /* próximos pasos */
    "next.label": "A continuación",
    "next.k1": "Ver el portafolio",
    "next.k4": "Pedir presupuesto",
    "next.k5": "Nosotros",
    "next.k6": "Hable con nosotros",
    "crumb.home": "Inicio",
    /* mensajes */
    "ok.form": "Mensaje enviado. Responderemos en breve.",
    "ok.o": "Solicitud enviada. Respondemos en 2 días laborables.",
    "ok.tw":
      "Candidatura recibida. Guardamos su contacto para futuras oportunidades.",
    err: "Revise los campos obligatorios.",
  },
};

/* ---------------- motor ---------------- */
const PT_FALLBACK = {
  "ok.form": "Mensagem enviada. Responderemos em breve.",
  "ok.o": "Pedido enviado. Respondemos em 2 dias úteis.",
  "ok.tw":
    "Candidatura recebida. Guardamos o seu contacto para futuras oportunidades.",
  err: "Verifique os campos obrigatórios.",
};
const nodes = document.querySelectorAll("[data-i18n]");
nodes.forEach((n) => (n.dataset.pt = n.textContent));
let lang = "pt";
try {
  const s = localStorage.getItem("lang");
  if (s) lang = s;
} catch (e) {}

function setLang(l) {
  lang = l;
  document.documentElement.lang = l === "en" ? "en" : l === "es" ? "es" : "pt";
  const d = I18N[l];
  nodes.forEach((n) => {
    n.textContent = d ? (d[n.dataset.i18n] ?? n.dataset.pt) : n.dataset.pt;
  });
  document
    .querySelectorAll(".langs button")
    .forEach((b) => b.setAttribute("aria-pressed", b.dataset.lang === l));
  try {
    localStorage.setItem("lang", l);
  } catch (e) {}
}
const t = (k) =>
  lang === "pt" ? PT_FALLBACK[k] : I18N[lang][k] || PT_FALLBACK[k];
document
  .querySelectorAll(".langs button")
  .forEach((b) => (b.onclick = () => setLang(b.dataset.lang)));
if (lang !== "pt") setLang(lang);

/* menu */
const burger = document.getElementById("burger"),
  links = document.getElementById("links");
if (burger) {
  burger.onclick = () => {
    const o = links.classList.toggle("open");
    burger.setAttribute("aria-expanded", o);
  };
  links.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      links.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    }
  });
}

/* formulários (demo, sem backend) */
function wire(formId, msgId, okKey) {
  const f = document.getElementById(formId);
  if (!f) return;
  const m = document.getElementById(msgId);
  f.addEventListener("submit", (e) => {
    e.preventDefault();
    m.className = "msg on";
    if (!f.checkValidity()) {
      m.classList.add("err");
      m.textContent = t("err");
      f.reportValidity();
      return;
    }
    m.textContent = t(okKey);
    f.reset();
  });
}
wire("form-orc", "msg-orc", "ok.o");
wire("form-ct", "msg-ct", "ok.form");
wire("form-tw", "msg-tw", "ok.tw");

/* revelação */
const io = new IntersectionObserver(
  (es) => es.forEach((x) => x.isIntersecting && x.target.classList.add("in")),
  { threshold: 0.08 },
);
document.querySelectorAll(".rv").forEach((el) => io.observe(el));
