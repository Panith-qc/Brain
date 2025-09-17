// app/config/db.config.js
module.exports = {
  // Use single DATABASE_URL from environment (Render → Environment)
  url: process.env.DATABASE_URL || null,

  // Fallbacks only if url is not provided (rare in Render)
  HOST: process.env.DB_HOST || "localhost",
  USER: process.env.DB_USER || "postgres",
  PASSWORD: process.env.DB_PASSWORD || "",
  DB: process.env.DB_NAME || "postgres",

  dialect: "postgres",
  logging: false,
  dialectOptions: {
    // Supabase requires SSL
    ssl: { require: true, rejectUnauthorized: false },
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
