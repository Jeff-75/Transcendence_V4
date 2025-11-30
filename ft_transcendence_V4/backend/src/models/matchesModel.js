import { db as knex } from "../config/database.js";

export default {
  async updateScore(matchId, score1, score2) {
    await knex("matches")
      .where({ id: matchId })
      .update({ score1, score2, played: 1 });

    return { matchId, score1, score2 };
  },

  getByTournament(tournamentId) {
    return knex("matches").where({ tournament_id: tournamentId }).select("*");
  }
};
