import express from "express";
import cors from "cors";
import opportunitiesRouter from "./routes/opportunities.routes.js";
import authRouter from "./routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// routes de ton projet
app.use("/api/auth", authRouter);
app.use("/api/opportunities", opportunitiesRouter);

// middleware d'erreur (1.4 dans la fiche)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
