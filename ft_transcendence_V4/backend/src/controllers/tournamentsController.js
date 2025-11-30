import tournamentsService from "../services/tournamentsService.js";

export default {
  async getAll(request, reply) {
    const tournaments = await tournamentsService.getAll();
    return reply.send(tournaments);
  },

  async create(request, reply) {
    const { name } = request.body;
    const tournament = await tournamentsService.create(name);
    return reply.send(tournament);
  },

  async join(request, reply) {
    const { id } = request.params;
    const { playerId } = request.body;

    const result = await tournamentsService.join(id, playerId);
    return reply.send(result);
  },

  async start(request, reply) {
    const { id } = request.params;
    const result = await tournamentsService.start(id);
    return reply.send(result);
  },

  async getMatches(request, reply) {
    const { id } = request.params;
    const matches = await tournamentsService.getMatches(id);
    return reply.send(matches);
  },

  async getPlayers(request, reply) {
    const { id } = request.params;
    const players = await tournamentsService.getPlayers(id);
    return reply.send(players);
  },

  async getLeaderboard(request, reply) {
    const { id } = request.params;
    const leaderboard = await tournamentsService.getLeaderboard(id);
    return reply.send(leaderboard);
  }
};
