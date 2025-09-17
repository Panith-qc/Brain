const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
require("dotenv").config();

const app = express();

// allow your GitHub Pages origin (and localhost for dev)
const ALLOWED_ORIGINS = ["https://panith-qc.github.io", "http://localhost:3000"];
app.use(cors({
  origin(origin, cb) { if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true); return cb(new Error("Not allowed by CORS")); },
  credentials: true,
}));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(cookieSession({
  name: "bezkoder-session",
  keys: [process.env.COOKIE_SECRET || "COOKIE_SECRET"],
  httpOnly: true,
  sameSite: "strict",
}));

// DB (Sequelize)
const db = require("./app/models");
const Role = db.role;

db.sequelize.sync({ alter: true })
  .then(seedRolesIfEmpty)
  .catch(err => console.error("DB sync error:", err?.message || err));

// basic routes
app.get("/", (_req, res) => res.json({ message: "Welcome to bezkoder application." }));
app.get("/health", (_req, res) => res.json({ ok: true }));
app.get("/debug/ping-db", async (_req, res) => {
  try { await db.sequelize.query("select 1"); res.json({ db: "ok" }); }
  catch (e) { console.error("DB ERROR:", e); res.status(500).json({ error: e.message }); }
});

// API routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// global error handler (keep last)
app.use((err, _req, res, _next) => {
  console.error("UNCAUGHT ERROR:", err);
  res.status(500).json({ error: err?.message || "Server error" });
});

// start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));

async function seedRolesIfEmpty() {
  if (!Role) return;
  const count = await Role.count();
  if (count > 0) return;
  await Role.bulkCreate([
    { id: 1, name: "sales" },
    { id: 2, name: "vp" },
    { id: 3, name: "admin" },
    { id: 4, name: "level" },
  ], { ignoreDuplicates: true });
  console.log("Seeded roles");
}
