// app/models/index.js
const config = require("../config/db.config.js");
const { Sequelize, DataTypes } = require("sequelize");

// Prefer DATABASE_URL (Supabase)
let sequelize;
if (config.url) {
  sequelize = new Sequelize(config.url, {
    dialect: "postgres",
    logging: false,
    dialectOptions: config.dialectOptions,
    pool: config.pool,
  });
} else {
  sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host: config.HOST,
    dialect: "postgres",
    logging: false,
    dialectOptions: config.dialectOptions,
    pool: config.pool,
  });
}

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// We are already inside app/models — use "./..."
db.user = require("./user.model.js")(sequelize, DataTypes);
db.role = require("./role.model.js")(sequelize, DataTypes);
db.doc  = require("./doc.model.js")(sequelize, DataTypes);
db.web  = require("./web.model.js")(sequelize, DataTypes);

// Associations
db.role.belongsToMany(db.user, { through: "user_roles" });
db.user.belongsToMany(db.role, { through: "user_roles" });

db.doc.belongsToMany(db.role,  { through: "doc_roles" });
db.role.belongsToMany(db.doc,  { through: "doc_roles" });

db.web.belongsToMany(db.role,  { through: "web_roles" });
db.role.belongsToMany(db.web,  { through: "web_roles" });

db.ROLES = ["level", "admin", "sales", "vp"];

module.exports = db;
