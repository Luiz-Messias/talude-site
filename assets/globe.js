/* Globo de atuação (empresa.html)
   Biblioteca: globe.gl (three.js) — vendorizada em assets/vendor/globe.gl.min.js.
   O script da biblioteca só é carregado quando a secção se aproxima do ecrã. */
(function () {
  const host = document.querySelector(".globe-canvas");
  if (!host) return;
  const frame = host.parentElement;

  /* etiquetas traduzidas: vêm da legenda (.globe-key) na mesma ordem */
  const legend = Array.from(document.querySelectorAll(".globe-key"));

  const MARKERS = [
    { i: 0, lat: 41.9, lng: -8.4, cls: "s-left" } /* Portugal */,
    { i: 1, lat: 39.9, lng: -4.0, cls: "s-down" } /* Espanha */,
    { i: 2, lat: 46.6, lng: 2.4, cls: "" } /* França */,
    { i: 3, lat: 52.1, lng: 5.3, cls: "s-up" } /* Holanda */,
  ];

  const hasWebGL = (() => {
    try {
      const c = document.createElement("canvas");
      return !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch (e) {
      return false;
    }
  })();

  if (!hasWebGL) {
    frame.classList.add("no-webgl");
    return;
  }

  const labelOf = (m) =>
    legend[m.i] ? legend[m.i].textContent.trim() : "";

  let started = false;
  let world = null;

  function pinEl(marker) {
    const el = document.createElement("div");
    el.className = "gpin" + (marker.cls ? " " + marker.cls : "");
    el.setAttribute("aria-hidden", "true");
    const sp = document.createElement("span");
    sp.textContent = labelOf(marker);
    el.appendChild(sp);
    return el;
  }

  function loadVendor() {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "assets/vendor/globe.gl.min.js";
      s.async = true;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function start() {
    if (started) return;
    started = true;
    loadVendor()
      .then(() => {
        const Globe = window.Globe;
        if (typeof Globe !== "function") throw new Error("globe.gl indisponível");
        world = new Globe(host, { animateIn: true })
          .globeImageUrl("assets/img/earth-1024.jpg")
          .bumpImageUrl("assets/img/earth-topo-1024.jpg")
          .backgroundColor("rgba(0,0,0,0)")
          .showAtmosphere(true)
          .atmosphereColor("#4a9be0")
          .atmosphereAltitude(0.16)
          .htmlElementsData(MARKERS)
          .htmlLat((d) => d.lat)
          .htmlLng((d) => d.lng)
          .htmlAltitude(0.012)
          .htmlElement((d) => pinEl(d));

        /* a globe.gl dimensiona a cena pela janela; forçamos o tamanho da secção */
        const px = () => Math.max(240, Math.round(frame.clientWidth) || 520);
        world.width(px()).height(px());
        let rt = null;
        window.addEventListener("resize", () => {
          clearTimeout(rt);
          rt = setTimeout(() => {
            const next = px();
            world.width(next).height(next);
          }, 150);
        });

        const c = world.controls();
        c.autoRotate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        c.autoRotateSpeed = 0.5;
        c.enableZoom = false; /* mantém o scroll da página */
        c.enablePan = false;
        c.minPolarAngle = Math.PI * 0.16;
        c.maxPolarAngle = Math.PI * 0.84;
        world.pointOfView({ lat: 38, lng: -6, altitude: 1.7 });

        frame.addEventListener("pointerdown", () =>
          frame.classList.add("is-dragging")
        );
        window.addEventListener("pointerup", () =>
          frame.classList.remove("is-dragging")
        );

        /* as etiquetas dos marcadores acompanham o idioma do site */
        document.querySelectorAll(".langs button").forEach((btn) =>
          btn.addEventListener("click", () =>
            setTimeout(() => {
              const labels = legend.map((n) => n.textContent.trim());
              host.querySelectorAll(".gpin").forEach((el, i) => {
                const sp = el.querySelector("span");
                if (sp && labels[i]) sp.textContent = labels[i];
              });
            }, 0)
          )
        );
      })
      .catch(() => frame.classList.add("no-webgl"));
  }

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          io.disconnect();
          start();
        }
      },
      { rootMargin: "400px 0px" }
    );
    io.observe(frame);
  } else {
    start();
  }
})();
