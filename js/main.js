/**
 * Configure o número do WhatsApp no formato internacional, sem + ou espaços.
 * Ex.: 5584999999999 (DDI + DDD + número)
 */
const WHATSAPP_NUMBER = "5584000000000";

const WHATSAPP_MESSAGE =
  "Oi Alana, vim pelo seu site. Gostaria de mais informações sobre psicoterapia.";

function buildWhatsAppUrl() {
  const text = encodeURIComponent(WHATSAPP_MESSAGE);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

function initWhatsAppLinks() {
  const url = buildWhatsAppUrl();
  const fab = document.getElementById("whatsapp-fab");
  const mainLink = document.getElementById("link-whatsapp");
  if (fab) fab.href = url;
  if (mainLink) mainLink.href = url;
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

document.addEventListener("DOMContentLoaded", () => {
  initWhatsAppLinks();
  initNav();
  initYear();
});
