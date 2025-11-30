import knex from "knex";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export let db = null;

export async function initDatabase() {
  if (db) return db;

  db = knex({
    client: "sqlite3",
    connection: {
      filename: path.join(__dirname, "../data/database.sqlite"),
    },
    useNullAsDefault: true,
  });

  // --- Players ---
  const hasPlayers = await db.schema.hasTable("players");
  if (!hasPlayers) {
    await db.schema.createTable("players", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.timestamp("created_at").defaultTo(db.fn.now());
    });
  }

  // --- Tournaments ---
  const hasTournaments = await db.schema.hasTable("tournaments");
  if (!hasTournaments) {
    await db.schema.createTable("tournaments", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.boolean("started").defaultTo(false);
      table.timestamp("created_at").defaultTo(db.fn.now());
    });
  }

  // --- Tournament Players ---
  const hasTournamentPlayers = await db.schema.hasTable("tournament_players");
  if (!hasTournamentPlayers) {
    await db.schema.createTable("tournament_players", (table) => {
      table.increments("id").primary();
      table.integer("tournament_id").notNullable();
      table.integer("player_id").notNullable();
      table.foreign("tournament_id").references("tournaments.id");
      table.foreign("player_id").references("players.id");
    });
  }

  // --- Matches ---
  const hasMatches = await db.schema.hasTable("matches");
  if (!hasMatches) {
    await db.schema.createTable("matches", (table) => {
      table.increments("id").primary();
      table.integer("tournament_id").notNullable();
      table.integer("player1").notNullable();
      table.integer("player2").notNullable();
      table.integer("score1").nullable();
      table.integer("score2").nullable();
      table.boolean("played").defaultTo(false);
      table.timestamp("created_at").defaultTo(db.fn.now());
      table.foreign("tournament_id").references("tournaments.id");
    });
  }

  // --- Scores (optionnel, si tu l’utilises) ---
  const hasScores = await db.schema.hasTable("scores");
  if (!hasScores) {
    await db.schema.createTable("scores", (table) => {
      table.increments("id").primary();
      table.string("player1").notNullable();
      table.string("player2").notNullable();
      table.integer("score1").notNullable();
      table.integer("score2").notNullable();
      table.string("winner").notNullable();
      table.timestamp("created_at").defaultTo(db.fn.now());
    });
  }

  console.log("📚 Database ready with all tables");
  return db;
}
