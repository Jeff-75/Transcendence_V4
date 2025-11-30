import tournamentModel from "../models/tournamentModel.js";
import tournamentPlayersModel from "../models/tournamentPlayersModel.js";

export default {
  getAll() {
    return tournamentModel.getAll();
  },

  create(name) {
    return tournamentModel.create(name);
  },

  join(tournamentId, playerId) {
    return tournamentPlayersModel.addPlayer(tournamentId, playerId);
  },

  start(tournamentId) {
    return tournamentModel.start(tournamentId);
  },

  getMatches(tournamentId) {
    return tournamentModel.getMatches(tournamentId);
  },

  getPlayers(tournamentId) {
    return tournamentModel.getPlayers(tournamentId);
  },

  getLeaderboard(tournamentId) {
    return tournamentModel.getLeaderboard(tournamentId);
  }
};
