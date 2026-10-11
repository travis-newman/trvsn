import "dotenv/config";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import express from "express";
import { sendContactMessage } from "./mailer.js";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
const clientDist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../client/dist");

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).send("ok");
});

app.get("/api/hello", (_req, res) => {
  res.json({ message: "Hello, world!" });
});

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body ?? {};

  if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string") {
    return res.status(400).json({ error: "name, email, and message are required" });
  }

  try {
    await sendContactMessage({ name, email, message });
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Failed to send contact message", err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// In production the built client is served from the same origin as the API.
if (existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get(/^(?!\/api\/).*/, (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
