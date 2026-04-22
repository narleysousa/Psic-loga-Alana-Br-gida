/**
 * Atualize aqui os canais oficiais antes de publicar.
 * WhatsApp: formato internacional, sem +, espaços ou traços.
 * Ex.: 5584999999999
 */
const SITE_CONFIG = {
  whatsappNumber: "",
  whatsappDirectLink:
    "https://wa.me/message/3FVRILTPOUVLC1",
  whatsappMessage:
    "Oi Alana, vim pelo seu site. Gostaria de mais informações sobre psicoterapia.",
  socialLinks: {
    instagram: "https://www.instagram.com/alanabrigidapsico/",
    tiktok: "https://www.tiktok.com/@alanabrigidapsico",
    youtube: "https://www.youtube.com/@alanabrigidaa",
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
  if (SITE_CONFIG.whatsappDirectLink) return normalizeWhatsAppUrl(SITE_CONFIG.whatsappDirectLink);
  if (!isConfiguredWhatsApp(SITE_CONFIG.whatsappNumber)) return null;
  const text = encodeURIComponent(SITE_CONFIG.whatsappMessage);
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${text}`;
}

function normalizeWhatsAppUrl(url) {
  const value = String(url || "").trim();
  if (!value) return null;

  // Alguns browsers Android falham com api.whatsapp.com/message e query params antigos.
  const directCodeMatch = value.match(/api\.whatsapp\.com\/message\/([A-Za-z0-9]+)(\?.*)?$/i);
  if (directCodeMatch) {
    return `https://wa.me/message/${directCodeMatch[1]}`;
  }

  return value;
}

function getWhatsAppTarget() {
  return /Android/i.test(navigator.userAgent) ? "_self" : "_blank";
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

  if (mainLink) {
    mainLink.href = url;
    mainLink.classList.remove("is-disabled");
    mainLink.removeAttribute("aria-disabled");
    mainLink.target = getWhatsAppTarget();
    if (mainLink.target === "_blank") {
      mainLink.rel = "noopener noreferrer";
    } else {
      mainLink.removeAttribute("rel");
    }
  }

  if (fab) {
    fab.href = url;
    fab.classList.remove("is-disabled");
    fab.removeAttribute("aria-disabled");
    fab.target = getWhatsAppTarget();
    if (fab.target === "_blank") {
      fab.rel = "noopener noreferrer";
    } else {
      fab.removeAttribute("rel");
    }
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
  const header = document.querySelector(".site-header");
  if (!toggle || !nav) return;

  function syncMobileHeaderHeight() {
    if (!header) return;
    const headerHeight = Math.ceil(header.getBoundingClientRect().height);
    document.documentElement.style.setProperty("--mobile-header-height", `${headerHeight}px`);
  }

  syncMobileHeaderHeight();
  window.addEventListener("resize", syncMobileHeaderHeight);
  window.addEventListener("orientationchange", syncMobileHeaderHeight);

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    document.body.classList.toggle("nav-open", open);
    if (open) syncMobileHeaderHeight();
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

function initBackToTop() {
  const backToTop = document.querySelector(".site-footer__top");
  if (!backToTop) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  backToTop.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: reduceMotion.matches ? "auto" : "smooth",
    });
  });
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

/** Faixa de fotos: loop infinito via translateX (GPU) + setas. */
function initInstaFeedMarquee() {
  const wrap = document.getElementById("instagram-static-marquee");
  const viewport = document.getElementById("insta-feed-viewport");
  const inner = viewport && viewport.querySelector(".insta-feed__inner");
  const prev = document.getElementById("insta-feed-prev");
  const next = document.getElementById("insta-feed-next");
  if (!wrap || !viewport || !inner || !prev || !next) return;

  const firstTrack = viewport.querySelector(".insta-feed__track");
  if (!firstTrack) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let pausedByHover = false;
  let offset = 0;
  let last = performance.now();
  let arrowAnim = null;

  function halfWidth() {
    return firstTrack.offsetWidth;
  }

  function getStep() {
    const item = viewport.querySelector(".insta-feed__item");
    return item ? Math.round(item.getBoundingClientRect().width) : 280;
  }

  function applyTransform() {
    inner.style.transform = `translateX(${-offset}px)`;
  }

  function normalize() {
    const hw = halfWidth();
    if (hw > 0) {
      offset = ((offset % hw) + hw) % hw;
    }
  }

  function tick(now) {
    const elapsed = Math.min(now - last, 80);
    last = now;

    if (!pausedByHover && !reduceMotion.matches && arrowAnim === null) {
      const hw = halfWidth();
      if (hw > 0) {
        offset += (hw / 48) * (elapsed / 1000);
        normalize();
        applyTransform();
      }
    }

    requestAnimationFrame(tick);
  }

  function animateArrow(delta) {
    if (arrowAnim !== null) cancelAnimationFrame(arrowAnim);
    const target = offset + delta;
    const duration = 350;
    const start = performance.now();
    const from = offset;

    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      offset = from + (target - from) * ease;
      normalize();
      applyTransform();
      if (t < 1) {
        arrowAnim = requestAnimationFrame(step);
      } else {
        arrowAnim = null;
      }
    }
    arrowAnim = requestAnimationFrame(step);
  }

  wrap.addEventListener("mouseenter", () => { pausedByHover = true; });
  wrap.addEventListener("mouseleave", () => { pausedByHover = false; last = performance.now(); });

  prev.addEventListener("click", (e) => {
    e.preventDefault();
    animateArrow(-getStep());
  });

  next.addEventListener("click", (e) => {
    e.preventDefault();
    animateArrow(getStep());
  });

  requestAnimationFrame(tick);
}

function initRevealAnimations() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }

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
  initBackToTop();
  initRevealAnimations();
});
