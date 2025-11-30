import { db as knex } from "../config/database.js";

export default {
  async addPlayer(tournamentId, playerId) {
    const exists = await knex("tournament_players")
      .where({ tournament_id: tournamentId, player_id: playerId })
      .first();

    if (exists) return { tournamentId, playerId, message: "Already joined" };

    await knex("tournament_players").insert({
      tournament_id: tournamentId,
      player_id: playerId
    });

    return { tournamentId, playerId };
  }
};
