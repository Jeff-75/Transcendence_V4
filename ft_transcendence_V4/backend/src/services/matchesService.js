import matchesModel from "../models/matchesModel.js";

export default {
  updateScore(matchId, score1, score2) {
    return matchesModel.updateScore(matchId, score1, score2);
  },

  getByTournament(tournamentId) {
    return matchesModel.getByTournament(tournamentId);
  }
};
