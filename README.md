# Digital Studio — Website

**All files sit directly in one folder — no subfolders.** This was changed on purpose: the first version used folders (`css/`, `js/`, `assets/`), but folder structure got lost during upload, which broke every link on the live site. This flat version avoids that problem completely — every file just needs to go into your GitHub repo's root, together, in one upload.

## What's in this folder

```
index.html                  → Home page (About Us + 3 main buttons)
admin-login.html            → Admin sign-in page
ugb-services.html           → UGB info + semester/subject selector
competitive-exams.html      → SSC / Railway exam services
digital-services.html       → Web & design services
style.css                    → All styling (colors, fonts, layout, animations) — ONE file
main.js                       → Admin session, back button, toast notifications, WhatsApp number
products.js                   → Product add/edit/delete/render engine, used by every page with a product grid
sem1-bengali-major.html ... sem8-political-science-mdc.html  → 48 notes pages, Semester I–VIII × 6 subjects
logo.png                      → Your logo
generate_pages.py            → The script that generated the 48 semester pages (keep it — see below)
```

## How to upload correctly this time

1. On GitHub, go to your repo and **delete every existing file first** (or delete the repo and create a fresh one) — the old broken links need to be gone, not layered under.
2. Go to **Add file → Upload files**, then select **every file in this folder at once** (all the `.html` files, `style.css`, `main.js`, `products.js`, `logo.png`) and upload them together. Because there are no folders this time, there's nothing that can get lost in the upload.
3. Commit the upload, then check **Settings → Pages** is still pointing at the right branch. Give it a minute and reload your site.

## How to change things later (without touching 48 files)

- **Colors, fonts, spacing, animations** → edit `style.css` only. Every page uses this one file.
- **WhatsApp number** → edit the top of `main.js` (`DS_WHATSAPP_NUMBER`). Changes everywhere at once.
- **Admin User ID / Password** → edit the two constants near the bottom of `admin-login.html`.
- **Add a new semester/subject page** → edit the `SUBJECTS` list or semester range inside `generate_pages.py` and re-run `python3 generate_pages.py` from inside this same folder. It only touches the `semN-...html` files.

## Important limits to know about

- **Password visibility:** the admin password lives in the code of `admin-login.html`. If your GitHub repo is public (required for GitHub Pages on the free plan), anyone can view the page source and see it. Keep this in mind — this isn't real security, it's a simple gate.
- **Products aren't shared across visitors yet:** products you add in Admin mode are saved to your browser's local storage only — they'll show on your device, not automatically to every visitor. For a catalog every visitor sees, you'd eventually want a small free backend (Firebase fits a static site like this well). Happy to help set that up later — the product code already lives in one file (`products.js`), so the change would be contained.

## Buy button

Every "Buy ₹..." button opens WhatsApp (`wa.me`) with a pre-filled message containing the product name, price, and which page it was on — automatic, nothing else needed on your end.
