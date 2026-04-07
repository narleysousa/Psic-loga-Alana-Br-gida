/**
 * Atualize aqui os canais oficiais antes de publicar.
 * WhatsApp: formato internacional, sem +, espaços ou traços.
 * Ex.: 5584999999999
 */
const SITE_CONFIG = {
  whatsappNumber: "",
  whatsappMessage:
    "Oi Alana, vim pelo seu site. Gostaria de mais informações sobre psicoterapia.",
  socialLinks: {
    instagram: "https://www.instagram.com/alanabrigidapsico/",
    tiktok: "https://www.tiktok.com/@alanabrigidapsico",
    youtube: "",
  },
  /**
   * Feed real do Instagram (fotos que rolam como no site de referência):
   * 1) Crie uma conta gratuita em https://snapwidget.com/
   * 2) Conecte o perfil @alanabrigidapsico e escolha layout em faixa / carrossel.
   * 3) No código do embed, copie só o ID numérico da URL (…/embed/XXXXX).
   * 4) Cole abaixo. Com ID preenchido, o site usa o feed automático; senão, usa as fotos locais.
   */
  snapWidgetEmbedId: "",
};

const SOCIAL_PLACEHOLDERS = {
  instagram: "https://www.instagram.com/",
  tiktok: "https://www.tiktok.com/",
  youtube: "https://www.youtube.com/",
};

function isConfiguredUrl(url, platform) {
  return Boolean(url) && url !== SOCIAL_PLACEHOLDERS[platform];
}

function isConfiguredWhatsApp(number) {
  return /^\d{12,13}$/.test(number);
}

function setDisabledLink(link) {
  if (!link) return;
  link.href = "#";
  link.classList.add("is-disabled");
  link.setAttribute("aria-disabled", "true");
  link.removeAttribute("target");
  link.removeAttribute("rel");
}

function buildWhatsAppUrl() {
  if (!isConfiguredWhatsApp(SITE_CONFIG.whatsappNumber)) return null;
  const text = encodeURIComponent(SITE_CONFIG.whatsappMessage);
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${text}`;
}

function initWhatsAppLinks() {
  const url = buildWhatsAppUrl();
  const note = document.getElementById("contact-note");
  const mainLink = document.getElementById("link-whatsapp");
  const fab = document.getElementById("whatsapp-fab");

  if (!url) {
    setDisabledLink(mainLink);
    setDisabledLink(fab);
    if (note) {
      note.textContent =
        "O contato pelo WhatsApp será ativado assim que o número oficial for informado.";
    }
    return;
  }

  [mainLink, fab].forEach((link) => {
    if (!link) return;
    link.href = url;
    link.classList.remove("is-disabled");
    link.removeAttribute("aria-disabled");
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  if (note) {
    note.textContent =
      "Ao clicar, o WhatsApp abre com uma mensagem inicial para facilitar o contato.";
  }
}

function initSocialLinks() {
  document.querySelectorAll("[data-social-link]").forEach((link) => {
    const platform = link.dataset.socialLink;
    const hint = link.querySelector("[data-social-hint]");
    const url = SITE_CONFIG.socialLinks[platform];

    if (!isConfiguredUrl(url, platform)) {
      setDisabledLink(link);
      if (hint) hint.textContent = "Link em atualização.";
      return;
    }

    link.href = url;
    link.classList.remove("is-disabled");
    link.removeAttribute("aria-disabled");
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
}

function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    document.body.classList.toggle("nav-open", open);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menu");
      document.body.classList.remove("nav-open");
    });
  });
}

function initYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = String(new Date().getFullYear());
}

function initInstagramFeed() {
  const id = String(SITE_CONFIG.snapWidgetEmbedId || "").trim();
  const widgetRoot = document.getElementById("instagram-widget-root");
  const staticFallback = document.getElementById("instagram-static-marquee");
  if (!widgetRoot || !staticFallback) return;

  if (id && /^[a-zA-Z0-9_-]+$/.test(id)) {
    widgetRoot.textContent = "";
    const script = document.createElement("script");
    script.src = "https://snapwidget.com/js/snapwidget.js";
    script.async = true;
    widgetRoot.appendChild(script);

    const iframe = document.createElement("iframe");
    iframe.src = `https://snapwidget.com/embed/${id}`;
    iframe.className = "insta-feed__iframe";
    iframe.title = "Publicações do Instagram @alanabrigidapsico";
    iframe.setAttribute("allowtransparency", "true");
    iframe.setAttribute("loading", "lazy");
    iframe.style.border = "none";
    iframe.style.overflow = "hidden";
    iframe.style.width = "100%";
    widgetRoot.appendChild(iframe);

    widgetRoot.hidden = false;
    staticFallback.hidden = true;
  }
}

/** Faixa de fotos: loop infinito (duas faixas idênticas) + rolagem automática + setas. */
function initInstaFeedMarquee() {
  const wrap = document.getElementById("instagram-static-marquee");
  const viewport = document.getElementById("insta-feed-viewport");
  const prev = document.getElementById("insta-feed-prev");
  const next = document.getElementById("insta-feed-next");
  if (!wrap || !viewport || !prev || !next) return;

  const firstTrack = viewport.querySelector(".insta-feed__track");
  if (!firstTrack) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let pausedByHover = false;
  let last = performance.now();
  let normalizing = false;

  function loopWidth() {
    return firstTrack.offsetWidth;
  }

  function getStep() {
    const item = viewport.querySelector(".insta-feed__item");
    return item ? Math.round(item.getBoundingClientRect().width) : 280;
  }

  /** Mantém scrollLeft no intervalo [0, L): mesma vista que o início da segunda cópia (loop infinito). */
  function normalizeScroll() {
    if (normalizing) return;
    const hw = loopWidth();
    if (hw <= 0) return;
    let sl = viewport.scrollLeft;
    if (sl < hw - 0.5) return;
    normalizing = true;
    while (sl >= hw - 0.25) {
      sl -= hw;
    }
    viewport.scrollLeft = sl;
    requestAnimationFrame(() => {
      normalizing = false;
    });
  }

  viewport.addEventListener("scroll", normalizeScroll, { passive: true });

  function tick(now) {
    const elapsed = Math.min(now - last, 80);
    last = now;

    if (!pausedByHover && !reduceMotion.matches) {
      const hw = loopWidth();
      if (hw > 0) {
        const pxPerSec = hw / 48;
        viewport.scrollLeft += (pxPerSec * elapsed) / 1000;
        normalizeScroll();
      }
    }

    requestAnimationFrame(tick);
  }

  wrap.addEventListener("mouseenter", () => {
    pausedByHover = true;
  });
  wrap.addEventListener("mouseleave", () => {
    pausedByHover = false;
  });

  prev.addEventListener("click", (e) => {
    e.preventDefault();
    const hw = loopWidth();
    const step = getStep();
    const sl = viewport.scrollLeft;
    if (hw <= 0) return;
    if (sl < 1) {
      viewport.scrollLeft = Math.max(0, hw - step);
    } else {
      viewport.scrollBy({ left: -step, behavior: "smooth" });
    }
  });

  next.addEventListener("click", (e) => {
    e.preventDefault();
    viewport.scrollBy({ left: getStep(), behavior: "smooth" });
  });

  requestAnimationFrame(tick);
}

function initRevealAnimations() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  els.forEach((el) => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  initWhatsAppLinks();
  initSocialLinks();
  initInstagramFeed();
  initInstaFeedMarquee();
  initNav();
  initYear();
  initRevealAnimations();
});
