import { db } from "../config/database.js";

export default async function scoresRoutes(app) {
  
  // GET /scores
  app.get("/", async () => {
    const data = await db("scores").select("*").orderBy("id", "desc");
    return data;
  });

  // POST /scores
  app.post("/", async (request, reply) => {
    const { player1, player2, score1, score2, winner } = request.body ?? {};

    if (!player1 || !player2 || winner === undefined) {
      reply.code(400);
      return { error: "missing_fields" };
    }

    await db("scores").insert({
      player1,
      player2,
      score1: Number(score1),
      score2: Number(score2),
      winner
    });

    return { success: true };
  });

  // POST /scores/reset
  app.post("/reset", async () => {
    await db("scores").del();
    return { status: "success", message: "Scores supprimés" };
  });
}
