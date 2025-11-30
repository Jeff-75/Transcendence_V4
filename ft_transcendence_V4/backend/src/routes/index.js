import playersRoutes from "./players.js";
import tournamentsRoutes from "./tournaments.js";
import scoresRoutes from "./scores.js";
import matchesRoutes from "./matches.js";

export default async function routes(app) {
  await app.register(playersRoutes, { prefix: "/players" });
  await app.register(tournamentsRoutes, { prefix: "/tournaments" });
  await app.register(scoresRoutes, { prefix: "/scores" });
  await app.register(matchesRoutes, { prefix: "/matches" });
}
