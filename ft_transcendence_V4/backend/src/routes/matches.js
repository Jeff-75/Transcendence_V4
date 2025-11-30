import matchesController from "../controllers/matchesController.js";

export default async function matchesRoutes(app) {
  app.post("/:id/score", matchesController.updateScore);
  app.get("/tournament/:id", matchesController.getByTournament);
}
