/* =========================================================
   DIGITAL STUDIO — products.js
   One shared engine, reused by every subject/service page.
   Each page sets <body data-page-key="..." data-page-title="...">
   Products are stored in this browser's localStorage under
   key  ds_products::<page-key>   as a JSON array of:
   { id, name, price, image (data URL or link), desc }

   NOTE (read this before relying on it in production):
   localStorage lives only in the browser that saved it, so
   products an admin adds will show on that same device/browser,
   not automatically to every visitor. For a catalog every
   visitor sees, this page's data would need to move to a real
   backend (e.g. Firebase) later.
   ========================================================= */

(function(){
  const body = document.body;
  const PAGE_KEY = body.getAttribute("data-page-key");
  const PAGE_TITLE = body.getAttribute("data-page-title") || document.title;
  if(!PAGE_KEY) return; // page doesn't use the product engine

  // Optional per-page config, set via <body> attributes:
  //   data-cta-label="View more"   -> button text (default "Know more")
  //   data-product-size="lg"       -> bigger cards + video support in the modal
  const CTA_LABEL = body.getAttribute("data-cta-label") || "Know more";
  const SUPPORTS_VIDEO = body.getAttribute("data-product-size") === "lg";

  const STORAGE_KEY = "ds_products::" + PAGE_KEY;

  // Turns a YouTube/Vimeo link into an embeddable player URL.
  // Returns null for anything else (treated as a direct video file link).
  function toEmbedUrl(url){
    try{
      const u = new URL(url);
      if(u.hostname.includes("youtube.com")){
        const id = u.searchParams.get("v");
        if(id) return `https://www.youtube.com/embed/${id}`;
        if(u.pathname.startsWith("/embed/")) return url;
      }
      if(u.hostname === "youtu.be"){
        return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
      }
      if(u.hostname.includes("vimeo.com")){
        const id = u.pathname.split("/").filter(Boolean).pop();
        return `https://player.vimeo.com/video/${id}`;
      }
    }catch(e){ /* not a valid URL */ }
    return null;
  }

  function loadProducts(){
    try{
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    }catch(e){ return []; }
  }
  function saveProducts(list){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }
  function uid(){
    return "p_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2,7);
  }

  function whatsappBuyLink(product){
    const msg = `Hi Digital Studio! I'm interested in:\n${product.name} (₹${product.price})\nPage: ${PAGE_TITLE}`;
    return `https://wa.me/${DS_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  }

  /* ---------------- render ---------------- */
  function render(){
    const grid = document.getElementById("ds-product-grid");
    if(!grid) return;
    const products = loadProducts();
    grid.innerHTML = "";
    grid.classList.toggle("product-grid-lg", SUPPORTS_VIDEO);

    if(products.length === 0 && !dsIsAdmin()){
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
        No items posted here yet — check back soon, or message us on WhatsApp for what you need.
      </div>`;
    }

    products.forEach(p=>{
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <div class="admin-only product-admin-bar">
          <button class="icon-btn js-edit" title="Edit">✏️</button>
          <button class="icon-btn js-delete" title="Delete">🗑️</button>
        </div>
        <div class="product-thumb">
          ${p.image ? `<img src="${p.image}" alt="${escapeHtml(p.name)}">` : `<span class="ph-icon">🖼️</span>`}
        </div>
        <div class="product-body">
          <h4>${escapeHtml(p.name)}</h4>
          <div class="product-actions">
            <button class="btn-sm btn-know js-know">${escapeHtml(CTA_LABEL)}</button>
            <a class="btn-sm btn-buy js-buy" target="_blank" rel="noopener">Buy ₹${escapeHtml(String(p.price))}</a>
          </div>
        </div>
      `;
      card.querySelector(".js-know").addEventListener("click", ()=> openKnowMore(p));
      card.querySelector(".js-buy").setAttribute("href", whatsappBuyLink(p));
      const editBtn = card.querySelector(".js-edit");
      const delBtn = card.querySelector(".js-delete");
      if(editBtn) editBtn.addEventListener("click", ()=> openProductModal(p.id));
      if(delBtn) delBtn.addEventListener("click", ()=> deleteProduct(p.id));
      grid.appendChild(card);
    });

    if(dsIsAdmin()){
      const addCard = document.createElement("div");
      addCard.className = "add-card admin-only";
      addCard.innerHTML = `<span class="plus">+</span><span>Add product</span>`;
      addCard.addEventListener("click", ()=> openProductModal(null));
      grid.appendChild(addCard);
    }
  }

  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, s=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[s]));
  }

  /* ---------------- Know More modal ---------------- */
  function openKnowMore(p){
    const overlay = document.getElementById("ds-know-modal");
    overlay.querySelector(".km-title").textContent = p.name;
    overlay.querySelector(".km-price").textContent = "₹" + p.price;
    overlay.querySelector(".km-desc").textContent = p.desc || "No further details added yet.";
    const img = overlay.querySelector(".km-image");
    const videoSlot = overlay.querySelector(".km-video-slot");

    if(p.video && videoSlot){
      const embed = toEmbedUrl(p.video);
      videoSlot.innerHTML = embed
        ? `<iframe src="${embed}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
        : `<video src="${p.video}" controls></video>`;
      videoSlot.style.display = "block";
      if(img) img.parentElement.style.display = "none"; // video takes priority over the static image
    } else {
      if(videoSlot){ videoSlot.style.display = "none"; videoSlot.innerHTML = ""; }
      if(p.image){ img.src = p.image; img.parentElement.style.display = "flex"; }
      else if(img){ img.parentElement.style.display = "none"; }
    }

    overlay.querySelector(".km-buy").href = whatsappBuyLink(p);
    overlay.classList.add("open");
  }

  /* ---------------- Add / Edit modal ---------------- */
  let editingId = null;
  function openProductModal(id){
    editingId = id;
    const overlay = document.getElementById("ds-product-modal");
    const products = loadProducts();
    const existing = products.find(x=>x.id===id);
    overlay.querySelector(".pm-title").textContent = existing ? "Edit product" : "Add product";
    overlay.querySelector('[name="name"]').value = existing ? existing.name : "";
    overlay.querySelector('[name="price"]').value = existing ? existing.price : "";
    overlay.querySelector('[name="desc"]').value = existing ? (existing.desc||"") : "";
    const videoInput = overlay.querySelector('[name="video"]');
    if(videoInput) videoInput.value = existing ? (existing.video||"") : "";
    const preview = overlay.querySelector(".thumb-preview");
    if(existing && existing.image){
      preview.innerHTML = `<img src="${existing.image}">`;
      preview.dataset.image = existing.image;
    } else {
      preview.innerHTML = `<span class="ph-icon">🖼️ Image preview</span>`;
      preview.dataset.image = "";
    }
    overlay.querySelector(".pm-delete").style.display = existing ? "inline-flex" : "none";
    overlay.classList.add("open");
  }

  function deleteProduct(id){
    if(!confirm("Delete this product? This can't be undone.")) return;
    const products = loadProducts().filter(x=>x.id!==id);
    saveProducts(products);
    render();
    dsToast("Product deleted");
  }

  /* ---------------- wire modals once DOM ready ---------------- */
  document.addEventListener("DOMContentLoaded", ()=>{
    render();

    // Know more modal close
    const kmOverlay = document.getElementById("ds-know-modal");
    if(kmOverlay){
      kmOverlay.querySelector(".modal-close").addEventListener("click", ()=> kmOverlay.classList.remove("open"));
      kmOverlay.addEventListener("click", (e)=>{ if(e.target===kmOverlay) kmOverlay.classList.remove("open"); });
    }

    // Product add/edit modal
    const pmOverlay = document.getElementById("ds-product-modal");
    if(pmOverlay){
      pmOverlay.querySelector(".modal-close").addEventListener("click", ()=> pmOverlay.classList.remove("open"));
      pmOverlay.addEventListener("click", (e)=>{ if(e.target===pmOverlay) pmOverlay.classList.remove("open"); });

      const fileInput = pmOverlay.querySelector('[name="imagefile"]');
      const preview = pmOverlay.querySelector(".thumb-preview");
      fileInput.addEventListener("change", ()=>{
        const file = fileInput.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = ()=>{
          preview.innerHTML = `<img src="${reader.result}">`;
          preview.dataset.image = reader.result;
        };
        reader.readAsDataURL(file);
      });

      pmOverlay.querySelector(".pm-save").addEventListener("click", ()=>{
        const name = pmOverlay.querySelector('[name="name"]').value.trim();
        const price = pmOverlay.querySelector('[name="price"]').value.trim();
        const desc = pmOverlay.querySelector('[name="desc"]').value.trim();
        const videoField = pmOverlay.querySelector('[name="video"]');
        const video = videoField ? videoField.value.trim() : "";
        const image = preview.dataset.image || "";
        if(!name || !price){
          dsToast("Please add a name and price");
          return;
        }
        const products = loadProducts();
        if(editingId){
          const idx = products.findIndex(x=>x.id===editingId);
          if(idx>-1) products[idx] = {...products[idx], name, price, desc, image, video};
        } else {
          products.push({id:uid(), name, price, desc, image, video});
        }
        saveProducts(products);
        pmOverlay.classList.remove("open");
        render();
        dsToast("Saved — this page is updated");
      });

      pmOverlay.querySelector(".pm-delete").addEventListener("click", ()=>{
        if(editingId) deleteProduct(editingId);
        pmOverlay.classList.remove("open");
      });
    }
  });
})();
