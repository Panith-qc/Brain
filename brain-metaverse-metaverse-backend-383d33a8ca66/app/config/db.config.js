// app/config/db.config.js
require("dotenv").config();
const dns = require("dns");

module.exports = {
  // Single Supabase connection string from Render env
  url: process.env.DATABASE_URL,

  dialect: "postgres",
  logging: false,

  // These options are passed through to 'pg' by Sequelize.
  // - Enforce SSL (Supabase)
  // - Force IPv4 by overriding DNS lookup
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false },
    lookup: (hostname, opts, cb) => dns.lookup(hostname, { family: 4 }, cb),
    keepAlive: true,
  },

  // Reasonable pool for free tiers
  pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
};
