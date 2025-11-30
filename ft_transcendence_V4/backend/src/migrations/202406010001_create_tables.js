export const up = async (knex) => {
  return knex.schema
    .createTable("players", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
    })
    .createTable("scores", (table) => {
      table.increments("id").primary();
      table.integer("player_id").references("id").inTable("players").onDelete("CASCADE");
      table.integer("score").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
    })
    .createTable("tournaments", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.integer("started").defaultTo(0);
      table.timestamp("created_at").defaultTo(knex.fn.now());
    })
    .createTable("tournament_players", (table) => {
      table.increments("id").primary();
      table.integer("tournament_id").references("id").inTable("tournaments").onDelete("CASCADE");
      table.integer("player_id").references("id").inTable("players").onDelete("CASCADE");
    })
    .createTable("matches", (table) => {
      table.increments("id").primary();
      table.integer("tournament_id").references("id").inTable("tournaments").onDelete("CASCADE");
      table.integer("player1").references("id").inTable("players");
      table.integer("player2").references("id").inTable("players");
      table.integer("score1").nullable();
      table.integer("score2").nullable();
      table.integer("played").defaultTo(0);
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
};

export const down = async (knex) => {
  return knex.schema
    .dropTableIfExists("matches")
    .dropTableIfExists("tournament_players")
    .dropTableIfExists("tournaments")
    .dropTableIfExists("scores")
    .dropTableIfExists("players");
};
