const path = require("path");

module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: path.join(__dirname, "data", "database.sqlite")
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, "src", "migrations"),
      extension: "mjs",      // <-- ajouter cette ligne
      tableName: "knex_migrations"
    }
  }
};
