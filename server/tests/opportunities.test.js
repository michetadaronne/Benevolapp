import request from "supertest";
import app from "../app.js";
import { describe, it, expect, beforeAll } from "vitest";
import { connectToDb } from "../db/mongo.js";

let createdId;

beforeAll(async () => {
  await connectToDb();
});

describe("Opportunities API", () => {
  it("GET /api/opportunities retourne un tableau", async () => {
    const res = await request(app).get("/api/opportunities");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /api/opportunities crée une opportunité", async () => {
    const res = await request(app)
      .post("/api/opportunities")
      .send({
        title: "Test bénévolat",
        organization: "Test Org",
        city: "Paris",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id"); // <- IMPORTANT: _id et plus id
    createdId = res.body._id;
  });

  it("GET /api/opportunities/:id retourne 404 si non trouvé", async () => {
    const fakeId = "000000000000000000000000";
    const res = await request(app).get(`/api/opportunities/${fakeId}`);

    expect(res.status).toBe(404);
  });
});
