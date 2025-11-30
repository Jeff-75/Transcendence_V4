import Fastify from "fastify";
import cors from "@fastify/cors";
import routes from "./routes/index.js";
import { initDatabase } from "./config/database.js";

const app = Fastify({ logger: true });

// Init DB
await initDatabase();

// CORS
await app.register(cors, {
  origin: "*",
});

// Routes
await app.register(routes);

// Start server
const start = async () => {
  try {
    await app.listen({ port: 8081, host: "0.0.0.0" });
    console.log("Backend running on http://localhost:8081");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
