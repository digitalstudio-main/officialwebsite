import os

SUBJECTS = [
    ("bengali-major", "Bengali Major"),
    ("bengali-minor", "Bengali Minor"),
    ("bengali-mdc", "Bengali MDC"),
    ("political-science-major", "Political Science Major"),
    ("political-science-minor", "Political Science Minor"),
    ("political-science-mdc", "Political Science MDC"),
]

SEM_WORDS = {1:"I",2:"II",3:"III",4:"IV",5:"V",6:"VI",7:"VII",8:"VIII"}

# FLAT structure: every file lives in the same folder, no subfolders.
TEMPLATE = '''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Semester {sem_word} — {subject_name} Notes | Digital Studio</title>
<link rel="icon" href="logo.png">
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
</head>
<body data-page-key="{page_key}" data-page-title="Semester {sem_word} - {subject_name}">

  <header class="topbar">
    <div class="topbar-inner">
      <a href="ugb-services.html" class="back-link js-back" data-fallback="ugb-services.html">← Back</a>
      <div class="top-actions">
        <a href="admin-login.html" id="ds-admin-login-pill" class="admin-pill">Admin Login</a>
        <div id="ds-admin-status-pill" class="admin-status" style="display:none;">Admin mode <button>Log out</button></div>
      </div>
    </div>
  </header>

  <section class="page-hero">
    <div class="container">
      <span class="breadcrumb">University of Gour Banga · Semester {sem_word}</span>
      <h1>{subject_name} Notes</h1>
      <p>Notes, study material and resources for {subject_name}, Semester {sem_word}, University of Gour Banga.</p>
    </div>
  </section>

  <section class="products-panel">
    <div class="container">
      <div class="products-toolbar">
        <h2>Available material</h2>
      </div>
      <div class="product-grid" id="ds-product-grid"></div>
    </div>
  </section>

  <footer>
    <div class="container">
      <div class="footer-bottom">
        <span>© 2026 Digital Studio. All rights reserved.</span>
        <span>Designed &amp; built with care in India.</span>
      </div>
    </div>
  </footer>

  <div class="modal-overlay" id="ds-know-modal">
    <div class="modal-box">
      <button class="modal-close">✕</button>
      <div class="thumb-preview" style="margin-bottom:14px;"><img class="km-image" src=""></div>
      <h3 class="km-title"></h3>
      <p class="km-price" style="font-weight:700;color:var(--navy);"></p>
      <p class="km-desc"></p>
      <div class="modal-actions">
        <a class="btn km-buy" target="_blank" rel="noopener">Buy on WhatsApp</a>
      </div>
    </div>
  </div>

  <div class="modal-overlay" id="ds-product-modal">
    <div class="modal-box">
      <button class="modal-close">✕</button>
      <h3 class="pm-title">Add product</h3>
      <label>Product name</label>
      <input type="text" name="name" placeholder="e.g. Full Semester Notes PDF">
      <label>Price (₹)</label>
      <input type="number" name="price" placeholder="e.g. 99">
      <label>Description (shown in Know More)</label>
      <textarea name="desc" placeholder="What's included, number of pages, format, etc."></textarea>
      <label>Image</label>
      <input type="file" name="imagefile" accept="image/*">
      <div class="thumb-preview"><span class="ph-icon">🖼️ Image preview</span></div>
      <div class="modal-actions">
        <button class="btn pm-save">Save</button>
        <button class="btn btn-ghost pm-delete" style="display:none;">Delete</button>
      </div>
    </div>
  </div>

  <script src="main.js"></script>
  <script src="products.js"></script>
</body>
</html>
'''

count = 0
for sem in range(1, 9):
    for slug, name in SUBJECTS:
        page_key = f"sem{sem}-{slug}"
        filename = f"{page_key}.html"
        html = TEMPLATE.format(sem_word=SEM_WORDS[sem], subject_name=name, page_key=page_key)
        with open(filename, "w", encoding="utf-8") as f:
            f.write(html)
        count += 1

print(f"Generated {count} pages")
