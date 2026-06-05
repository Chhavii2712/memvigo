# memvigo — Unified Next.js App

Everything runs in **one folder** on **one port** (`localhost:3000`).
No separate API server. No Docker. No port juggling.

---

## One-Time Setup (do this once)

### Step 1 — Install PostgreSQL
**Option A: Local install**
- Windows: https://www.postgresql.org/download/windows/
- Mac: `brew install postgresql && brew services start postgresql`
- Ubuntu: `sudo apt install postgresql && sudo service postgresql start`

**Option B: Free cloud DB (easier for beginners)**
- Go to https://neon.tech → sign up free → create a project → copy the connection string

### Step 2 — Enter the project folder
```bash
cd memvigo-unified
```

### Step 3 — Install dependencies
```bash
npm install
```

### Step 4 — Set up environment variables
```bash
# Copy the example file
cp .env.local.example .env.local

# Open .env.local and fill in:
#   DATABASE_URL  → your PostgreSQL connection string
#   JWT_SECRET    → any long random string
#   JWT_REFRESH_SECRET → a different long random string
#   INTERNAL_SECRET → leave as-is for dev
```
Generate random secrets with this command:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 5 — Create database tables
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### Step 6 — Start the app
```bash
npm run dev
```
Open http://localhost:3000 — that's it!

---

## Running the Java Engine (optional)

The Java engine sends live alerts to your dashboard.
Make sure Next.js is running first, then:

```bash
cd ../engine
mvn clean package -q
java -jar target/memvigo-engine-1.0.0.jar
```

The engine POSTs alerts to `http://localhost:3000/api/internal/alert` every ~30 seconds.
Register on the website first — alerts get linked to the first registered user.

---

## Folder Structure

```
memvigo-unified/
├── prisma/
│   └── schema.prisma          ← Database schema
│
├── src/
│   ├── app/
│   │   ├── page.jsx            ← Landing page (/)
│   │   ├── layout.jsx          ← Root layout with AuthProvider
│   │   ├── globals.css
│   │   │
│   │   ├── login/page.jsx      ← /login
│   │   ├── register/page.jsx   ← /register
│   │   ├── dashboard/page.jsx  ← /dashboard (protected)
│   │   ├── alerts/page.jsx     ← /alerts (protected)
│   │   ├── settings/page.jsx   ← /settings (protected)
│   │   │
│   │   └── api/                ← All backend routes live here
│   │       ├── auth/
│   │       │   ├── register/route.js
│   │       │   ├── login/route.js
│   │       │   ├── refresh/route.js
│   │       │   └── logout/route.js
│   │       ├── alerts/
│   │       │   ├── route.js          ← GET (paginated)
│   │       │   ├── latest/route.js   ← GET latest N
│   │       │   └── [id]/route.js     ← DELETE (dismiss)
│   │       ├── telemetry/
│   │       │   ├── current/route.js
│   │       │   └── history/route.js
│   │       ├── internal/
│   │       │   └── alert/route.js    ← Java engine intake
│   │       └── health/route.js
│   │
│   ├── lib/
│   │   ├── db.js         ← Prisma client singleton
│   │   ├── jwt.js        ← Token sign/verify helpers
│   │   ├── auth.js       ← getAuthUser() middleware helper
│   │   └── AuthContext.jsx ← React auth state + Axios interceptor
│   │
│   ├── hooks/
│   │   └── useData.js    ← SWR polling hooks
│   │
│   └── middleware.js     ← Route protection (redirects to /login)
│
├── .env.local            ← Your secrets (never commit this)
├── package.json
└── next.config.js
```

---

## Key Difference from Old Architecture

| Old (2 folders)               | New (unified)                  |
|-------------------------------|--------------------------------|
| `api/` Express server port 4000 | Gone — deleted                |
| `web/` Next.js port 3000      | `memvigo-unified/` port 3000 |
| Axios calls `localhost:4000/api/...` | Axios calls `/api/...`  |
| 2 terminals, Docker for DB    | 1 terminal, just needs Postgres|
| CORS config needed            | No CORS — same origin          |
| `NEXT_PUBLIC_API_URL` env var | Not needed anymore             |
