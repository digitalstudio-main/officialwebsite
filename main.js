/* =========================================================
   DIGITAL STUDIO — main.js
   Shared on every page: admin session check, topbar wiring,
   toast notifications, WhatsApp number constant.
   ========================================================= */

/* ---- your WhatsApp number lives here, one place only ---- */
const DS_WHATSAPP_NUMBER = "918653414799"; // country code 91 + number

/* ---- toast ---- */
function dsToast(message){
  let el = document.getElementById("ds-toast");
  if(!el){
    el = document.createElement("div");
    el.id = "ds-toast";
    el.className = "toast";
    el.innerHTML = '<span class="dot-ok"></span><span class="toast-msg"></span>';
    document.body.appendChild(el);
  }
  el.querySelector(".toast-msg").textContent = message;
  el.classList.add("show");
  clearTimeout(el._t);
  el._t = setTimeout(()=> el.classList.remove("show"), 2400);
}

/* ---- admin session (sessionStorage so it clears when browser closes) ---- */
function dsIsAdmin(){
  return sessionStorage.getItem("ds_admin") === "true";
}
function dsLogoutAdmin(){
  sessionStorage.removeItem("ds_admin");
  dsToast("Logged out of Admin");
  setTimeout(()=> location.reload(), 500);
}

/* ---- wire up topbar admin pill / status on every page ---- */
document.addEventListener("DOMContentLoaded", () => {
  const isAdmin = dsIsAdmin();
  document.body.classList.toggle("is-admin", isAdmin);

  const loginPill = document.getElementById("ds-admin-login-pill");
  const statusPill = document.getElementById("ds-admin-status-pill");

  if(isAdmin){
    if(loginPill) loginPill.style.display = "none";
    if(statusPill){
      statusPill.style.display = "flex";
      const logoutBtn = statusPill.querySelector("button");
      if(logoutBtn) logoutBtn.addEventListener("click", dsLogoutAdmin);
    }
  } else {
    if(loginPill) loginPill.style.display = "inline-flex";
    if(statusPill) statusPill.style.display = "none";
  }

  // Back button: history.back() with a safe fallback to home
  document.querySelectorAll(".js-back").forEach(btn=>{
    btn.addEventListener("click", (e)=>{
      e.preventDefault();
      if(document.referrer && document.referrer.indexOf(location.host) !== -1){
        history.back();
      } else {
        window.location.href = btn.getAttribute("data-fallback") || "index.html";
      }
    });
  });
});
