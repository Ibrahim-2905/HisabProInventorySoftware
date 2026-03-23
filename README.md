# Hisaab Pro 🧾

Mobile-first PWA inventory & profit tracker for small shops. Built with React + Supabase.

---

## Features

- Sell items with one tap — cart-based kiosk UI
- Inventory management — add, edit, delete, restock
- Profit & loss reports — today, week, month, all time
- Bar charts for last 7 days performance
- Top selling products
- Low stock & out of stock alerts
- Full offline support — works without internet
- Auto-sync when connection returns
- Installable on Android/iOS (PWA)
- Multi-user — each shopkeeper has their own private account

---

## Tech Stack

- React 18 + Vite
- Supabase (Auth + PostgreSQL)
- IndexedDB via `idb` (offline storage)
- Recharts (charts)
- Vite PWA Plugin (service worker + installable)

---

## Project Structure

```
src/
  constants/
    COLORS.js          ← all colors in one place
  lib/
    supabase.js        ← supabase client
  utils/
    db.js              ← IndexedDB (offline)
    formatters.js      ← PKR currency, dates
  context/
    AuthContext.jsx    ← auth state
  hooks/
    useProducts.js     ← product CRUD + offline
    useSales.js        ← sales recording + offline
    useOffline.js      ← online/offline detection + sync
  components/
    ui/
      Button.jsx
      Card.jsx
      Modal.jsx
      Input.jsx
      Badge.jsx
      Toast.jsx
      Loader.jsx
      EmptyState.jsx
    layout/
      Header.jsx
      BottomNav.jsx
      PageWrapper.jsx
    shared/
      OfflineBanner.jsx
  pages/
    Auth/AuthPage.jsx
    Home/HomePage.jsx
    Sell/SellPage.jsx
    Inventory/
      InventoryPage.jsx
      AddProductModal.jsx
    Reports/ReportsPage.jsx
    Settings/SettingsPage.jsx
supabase/
  schema.sql           ← run this in Supabase SQL editor
```

---

## Setup Guide

### Step 1 — Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **SQL Editor** → paste the contents of `supabase/schema.sql` → click Run
4. Go to **Settings → API**
5. Copy your **Project URL** and **anon public key**

### Step 2 — Environment Variables

```bash
cp .env.example .env
```

Open `.env` and fill in:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 3 — Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Step 4 — Build for Production

```bash
npm run build
```

### Step 5 — Deploy to Vercel (free)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Add environment variables (same as `.env`)
4. Deploy → get your live link

---

## Installing on Phone (PWA)

**Android (Chrome):**
1. Open the app link in Chrome
2. Tap the menu (3 dots) → "Add to Home Screen"
3. Done — works like a real app

**iPhone (Safari):**
1. Open the app link in Safari
2. Tap Share button → "Add to Home Screen"
3. Done

---

## Offline Behavior

| Situation | Behavior |
|---|---|
| Online | All data syncs to Supabase in real time |
| Goes offline | Yellow banner shown — app keeps working |
| Sell offline | Sale recorded locally, stock updated locally |
| Add product offline | Product added locally |
| Back online | All pending changes auto-sync to Supabase |

---

## Colors Reference (COLORS.js)

| Token | Hex | Use |
|---|---|---|
| bg | #0D1117 | Page background |
| surface | #161B22 | Cards |
| primary | #00C896 | Main green (profit, buttons) |
| accent | #FF9F1C | Amber (stock value, add) |
| success | #3FB950 | Profit numbers |
| danger | #F85149 | Loss, out of stock, errors |
| text | #E6EDF3 | Main text |
| textSecondary | #8B949E | Subtitles |

---

## Phase 2 (Payment System — Coming Next)

- Payment page with JazzCash/Bank details
- Screenshot upload for payment proof
- Admin panel (approve/reject signups)
- Auto account creation after approval
- WhatsApp/email notification on new signups
