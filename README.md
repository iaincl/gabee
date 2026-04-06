# GABEE ☕

A personal coffee diary and caffeine tracker built for espresso obsessives.

**Live app:** [gabee-client.vercel.app](https://gabee-client.vercel.app)

---

## What it does

GABEE helps you dial in your espresso and track your daily caffeine intake across all drinks — home brews and outside café orders.

**Home brew logger**
- Log dose, yield, grind setting and brew time
- Instant 1:2 ratio checker — flags under and over extracted shots
- Auto-estimates caffeine from dose weight
- Tasting notes and star rating

**Outside drink tracker**
- Quick emoji grid to log café drinks, office coffee, energy drinks
- 12+ drink types with auto caffeine estimates by size
- Log where you got it and any notes

**Daily dashboard**
- Animated iced americano cup that fills up as you consume caffeine
- Cup counter (0 cups → 4+ cups) with draggable slider
- Smart toast alerts at 75% and 100% of your 400mg daily limit
- Live scrolling ticker with today's stats

**History**
- All entries grouped by day
- Filter by home brews or outside drinks
- Daily caffeine totals and averages

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | SQLite (better-sqlite3) |
| Auth | JWT + bcryptjs |
| Styling | Inline styles + IBM Plex Mono font |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Running locally

**Prerequisites:** Node.js 22+, npm

**1. Clone the repo**
```bash
git clone https://github.com/iaincl/gabee.git
cd gabee
```

**2. Start the backend**
```bash
cd gabee-server
npm install
cp .env.example .env
# Add your JWT_SECRET to .env
node index.js
```

**3. Start the frontend**
```bash
cd gabee-client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Environment variables

**Backend (`gabee-server/.env`)**
```
JWT_SECRET=your_secret_key_here
PORT=3001
```

**Frontend (`gabee-client/.env.development`)**
```
VITE_API_URL=http://localhost:3001/api
```

---

## Features in progress

- Email notifications (welcome email, daily summary, limit alerts)
- Bean inventory tracker
- Dial-in assistant — suggests grind settings based on past ratings
- Weekly caffeine trend charts

---

## About

Built as a personal project to solve a real problem — keeping track of espresso variables and daily caffeine across home brews and café drinks. Designed with a clean, minimal aesthetic inspired by editorial typography.

**Stack decisions:**
- SQLite chosen for simplicity — perfect for a single-user personal tool
- JWT auth implemented from scratch to demonstrate security fundamentals
- No UI library — all styling written by hand to show CSS proficiency
