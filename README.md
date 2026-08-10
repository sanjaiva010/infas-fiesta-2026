# Infa's Fiesta 2026 — Annual Day Invitation

Notebook-styled, hand-written invitation microsite for the Annual Day of **Infant Jesus Matriculation Higher Secondary School, Tiruppur** (Thu, 20 Aug 2026 @ 4:30 PM).

## Contents
- `index.html` — the whole page
- `css/site.css` — notebook ruled-paper theme, handwriting fonts, tearing sticky-note stacks
- `js/site.js` — countdown, sticky-tear animation, RSVP, confetti
- `js/supabase-config.js` — **fill these keys to connect RSVPs**
- `supabase/schema.sql` — RSVP table for Supabase
- `assets/` — school crest + logo (downloaded from the school site)

---

## 1) Go live on GitHub Pages

```bash
cd annual-day
git init
git add .
git commit -m "Infa's Fiesta 2026 invitation"
git branch -M main
git remote add origin https://github.com/<your-username>/infas-fiesta-2026.git
git push -u origin main
```

Then enable Pages: **Repo → Settings → Pages → Build from branch: `main` / `/` (root)**.
Your site is live at `https://<your-username>.github.io/infas-fiesta-2026/`

> `.nojekyll` is already present so Pages serves the raw folder.

## 2) Connect RSVPs to Supabase

1. Create a free project at https://supabase.com
2. SQL Editor → paste + run `supabase/schema.sql` (creates the `rsvps` table + insert policy)
3. Project Settings → API → copy the **Project URL** and **anon/public key**
4. Paste them into `js/supabase-config.js`
5. Re-push (`git add . && git commit && git push`) — the form now writes RSVPs to Supabase
6. See responses under **Table Editor → rsvps** (or: Supabase → Build → Table Editor)

> Before keys are added the form runs in **preview mode**: RSVPs are saved on the visitor's device only.

## 3) Change the event date
Edit `TARGET = new Date(2026, 7, 20, 16, 30, 0)` at the top of `js/site.js`.
(Year, month-1, day, hour, minute, second.)

## 4) Nice-to-haves
- **Custom domain**: add a CNAME file + your domain in Pages settings
- **Supabase dashboard**: check RSVP counts under Table Editor, or build a small admin view
- **Analytics**: add a free Plausible/Umami snippet to `index.html`