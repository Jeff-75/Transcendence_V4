import { db as knex } from "../config/database.js";

export default {
  getAll() {
    return knex("tournaments").select("*");
  },

  async create(name) {
    const [id] = await knex("tournaments").insert({ name });
    return { id, name };
  },

  async start(id) {
    await knex("tournaments").where({ id }).update({ started: 1 });

    const rows = await knex("tournament_players")
      .where({ tournament_id: id })
      .select("player_id");

    const playerIds = rows.map(r => r.player_id);

    if (playerIds.length < 2) return { createdMatches: 0 };

    const matchesToInsert = [];
    for (let i = 0; i < playerIds.length; i++) {
      for (let j = i + 1; j < playerIds.length; j++) {
        matchesToInsert.push({
          tournament_id: id,
          player1: playerIds[i],
          player2: playerIds[j],
          score1: null,
          score2: null,
          played: 0,
        });
      }
    }

    if (matchesToInsert.length > 0) {
      await knex("matches").insert(matchesToInsert);
    }

    return { createdMatches: matchesToInsert.length };
  },

  getMatches(id) {
    return knex("matches").where({ tournament_id: id }).select("*");
  },

  async getPlayers(id) {
    const rows = await knex("tournament_players")
      .where({ tournament_id: id })
      .join("players", "tournament_players.player_id", "players.id")
      .select("players.id", "players.name");
    return rows;
  },

  async getLeaderboard(id) {
    const matches = await knex("matches")
      .where({ tournament_id: id, played: 1 })
      .select("*");

    const scores = {};

    matches.forEach(m => {
      if (!scores[m.player1]) scores[m.player1] = 0;
      if (!scores[m.player2]) scores[m.player2] = 0;

      if (m.score1 > m.score2) scores[m.player1] += 3;
      else if (m.score2 > m.score1) scores[m.player2] += 3;
      else {
        scores[m.player1] += 1;
        scores[m.player2] += 1;
      }
    });

    return Object.entries(scores)
      .map(([playerId, points]) => ({ playerId: Number(playerId), points }))
      .sort((a, b) => b.points - a.points);
  }
};
