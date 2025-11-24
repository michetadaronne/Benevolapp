import express from "express";
import {
  getAllOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} from "../repositories/opportunity.repository.js";

const router = express.Router();

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
    const opportunity = await getOpportunityById(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ error: "Opportunity not found" });
    }
    res.json(opportunity);
  } catch (err) {
    next(err);
  }
});

// POST /api/opportunities
router.post("/", async (req, res, next) => {
  try {
    const { title, organization, city, date, time, description } = req.body;

    if (!title || !organization || !city) {
      return res
        .status(400)
        .json({ error: "Missing required fields (title, organization, city)" });
    }

    const newOpportunity = await createOpportunity({
      title,
      organization,
      city,
      date: date || null,
      time: time || null,
      description: description || "",
    });

    res.status(201).json(newOpportunity);
  } catch (err) {
    next(err);
  }
});

// PUT /api/opportunities/:id
router.put("/:id", async (req, res, next) => {
  try {
    const updated = await updateOpportunity(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Opportunity not found" });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/opportunities/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await deleteOpportunity(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Opportunity not found" });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
