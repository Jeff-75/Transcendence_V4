import matchesService from "../services/matchesService.js";

export default {
  async updateScore(request, reply) {
    const { id } = request.params;
    const { score1, score2 } = request.body;

    const result = await matchesService.updateScore(id, score1, score2);
    return reply.send(result);
  },

  async getByTournament(request, reply) {
    const { id } = request.params;
    const matches = await matchesService.getByTournament(id);
    return reply.send(matches);
  }
};
