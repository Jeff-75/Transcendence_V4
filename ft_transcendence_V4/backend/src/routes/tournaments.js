import tournamentsController from "../controllers/tournamentsController.js";

export default async function tournamentsRoutes(app) {
  app.get("/", tournamentsController.getAll);
  app.post("/", tournamentsController.create);
  app.post("/:id/join", tournamentsController.join);
  app.post("/:id/start", tournamentsController.start);
  app.get("/:id/matches", tournamentsController.getMatches);
  app.get("/:id/players", tournamentsController.getPlayers);
  app.get("/:id/leaderboard", tournamentsController.getLeaderboard);
}
