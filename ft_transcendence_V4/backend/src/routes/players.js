import { db } from "../config/database.js";

export default async function playersRoutes(app) {

  // GET /players
  app.get("/", async () => {
    const players = await db("players").select("*").orderBy("id", "asc");
    return { status: "success", data: players };
  });

  // POST /players
  app.post("/", async (request, reply) => {
    const { name } = request.body ?? {};

    if (!name || !name.trim()) {
      reply.code(400);
      return { status: "error", message: "Nom invalide" };
    }

    const cleanName = name.trim();

    const [id] = await db("players").insert({ name: cleanName });

    return {
      status: "success",
      message: "Joueur ajouté",
      player: { id, name: cleanName },
    };
  });

  // DELETE /players/:id
  app.delete("/:id", async (request) => {
    const { id } = request.params;
    await db("players").where({ id }).del();
    return { status: "success", message: "Joueur supprimé", id };
  });
}
