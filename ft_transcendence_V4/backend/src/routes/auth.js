import bcrypt from "bcrypt";

export default async function authRoutes(app) {
  // REGISTER
  app.post("/register", async (req, reply) => {
    const { username, password } = req.body;

    if (!username || !password)
      return reply.code(400).send({ error: "Missing fields" });

    const hashed = await bcrypt.hash(password, 10);

    // TODO : save user in database
    // For now: mock only
    return { success: true, user: { username } };
  });

  // LOGIN
  app.post("/login", async (req, reply) => {
    const { username, password } = req.body;

    // TODO : check DB user
    const ok = true; // temporary

    if (!ok)
      return reply.code(401).send({ error: "Invalid credentials" });

    const token = app.jwt.sign({ username });

    return {
      access_token: token,
      user: { username }
    };
  });
}
