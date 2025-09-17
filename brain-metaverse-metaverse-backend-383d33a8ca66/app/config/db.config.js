// app/config/db.config.js
module.exports = {
  url: process.env.DATABASE_URL || null, // Render env var
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false },
  },
  pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
};
