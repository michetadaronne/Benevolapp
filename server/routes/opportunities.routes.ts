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
  getOpportunitiesJoinedByUser,
} from "../repositories/opportunity.repository.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const { JWT_SECRET = "dev-secret" } = process.env;

// GET /api/opportunities
router.get("/", async (req, res, next) => {
  try {
    const { city, date, category } = req.query;

    const opportunities = await getAllOpportunities({
      city: typeof city === "string" ? city : undefined,
      date: typeof date === "string" ? date : undefined,
      category: typeof category === "string" ? category : undefined,
    });

    res.status(200).json(opportunities);
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
      const opportunities = await getOpportunitiesByCreator(String(req.user._id));
      res.json(opportunities);
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/opportunities/joined
router.get("/joined", requireAuth, async (req, res, next) => {
  try {
    const opportunities = await getOpportunitiesJoinedByUser(String(req.user._id));
    res.json(opportunities);
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
        const payload = jwt.verify(token, JWT_SECRET) as any;
        requester = { id: String(payload.sub), role: payload.role };
      } catch {}
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

// POST /api/opportunities
router.post(
  "/",
  requireAuth,
  requireRole("organizer"),
  async (req, res, next) => {
    try {
      const {
        title,
        organization,
        city,
        date,
        startTime,
        endTime,
        description,
        categories = [],
      } = req.body;

      if (!title || !organization || !city || !date || !startTime || !endTime) {
        return res.status(400).json({
          error:
            "Missing required fields (title, organization, city, date, startTime, endTime)",
        });
      }

      const newOpportunity = await createOpportunity({
        title,
        organization,
        city,
        date,
        startTime,
        endTime,
        description: description || "",
        categories: Array.isArray(categories)
          ? categories
          : typeof categories === "string" && categories.length > 0
          ? [categories]
          : [],
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
      const updated = await joinOpportunity(
        req.params.id,
        String(req.user._id)
      );

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
      const updated = await leaveOpportunity(
        req.params.id,
        String(req.user._id)
      );

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
