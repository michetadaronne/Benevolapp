import express from "express";
import {
  getAllOpportunities,
  getOpportunityById,
  getOpportunityByIdForOrganizer,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  joinOpportunity,
  leaveOpportunity,
  getOpportunitiesByCreator,
} from "../repositories/opportunity.repository.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const { JWT_SECRET = "dev-secret" } = process.env;

// GET /api/opportunities
router.get("/", async (req, res, next) => {
  try {
    const opportunities = await getAllOpportunities();
    res.status(200).json(opportunities);
  } catch (err) {
    next(err);
  }
});

// GET /api/opportunities/:id
router.get("/:id", async (req, res, next) => {
  try {
    let requester = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      try {
        const payload = jwt.verify(token, JWT_SECRET);
        requester = { id: payload.sub, role: payload.role };
      } catch {
        requester = null;
      }
    }

    let opportunity = null;
    if (requester?.role === "organizer") {
      opportunity = await getOpportunityByIdForOrganizer(
        req.params.id,
        requester.id
      );
    }
    if (!opportunity) {
      opportunity = await getOpportunityById(req.params.id);
    }
    if (!opportunity) {
      return res.status(404).json({ error: "Opportunity not found" });
    }
    res.json(opportunity);
  } catch (err) {
    next(err);
  }
});

// GET /api/opportunities/mine
router.get(
  "/mine",
  requireAuth,
  requireRole("organizer"),
  async (req, res, next) => {
    try {
      const opportunities = await getOpportunitiesByCreator(req.user._id);
      res.json(opportunities);
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/opportunities
router.post(
  "/",
  requireAuth,
  requireRole("organizer"),
  async (req, res, next) => {
    try {
      const { title, organization, city, date, time, description } = req.body;

      if (!title || !organization || !city) {
        return res.status(400).json({
          error: "Missing required fields (title, organization, city)",
        });
      }

      const newOpportunity = await createOpportunity({
        title,
        organization,
        city,
        date: date || null,
        time: time || null,
        description: description || "",
        createdBy: req.user?._id,
      });

      res.status(201).json(newOpportunity);
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/opportunities/:id/join
router.post(
  "/:id/join",
  requireAuth,
  requireRole("volunteer"),
  async (req, res, next) => {
    try {
      const updated = await joinOpportunity(req.params.id, req.user._id);
      if (!updated) {
        return res.status(404).json({ error: "Opportunity not found" });
      }
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/opportunities/:id/join
router.delete(
  "/:id/join",
  requireAuth,
  requireRole("volunteer"),
  async (req, res, next) => {
    try {
      const updated = await leaveOpportunity(req.params.id, req.user._id);
      if (!updated) {
        return res.status(404).json({ error: "Opportunity not found" });
      }
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/opportunities/:id
router.put(
  "/:id",
  requireAuth,
  requireRole("organizer"),
  async (req, res, next) => {
    try {
      const updated = await updateOpportunity(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Opportunity not found" });
      }
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/opportunities/:id
router.delete(
  "/:id",
  requireAuth,
  requireRole("organizer"),
  async (req, res, next) => {
    try {
      const deleted = await deleteOpportunity(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Opportunity not found" });
      }
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
);

export default router;
