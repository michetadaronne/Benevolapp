import request from "supertest";
import app from "../app.js";
import { describe, it, expect, beforeAll } from "vitest";
import { connectToDb } from "../db/mongo.js";

let createdId;
let authToken;

const uniqueEmail = `organizer-${Date.now()}@benevolapp.test`;

beforeAll(async () => {
  await connectToDb();

  const registerRes = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Test Organizer",
      email: uniqueEmail,
      password: "TestPassword123!",
      role: "organizer",
    });

  authToken = registerRes.body?.token;
});

describe("Opportunities API", () => {
  it("GET /api/opportunities returns an array", async () => {
    const res = await request(app).get("/api/opportunities");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /api/opportunities creates an opportunity", async () => {
    const res = await request(app)
      .post("/api/opportunities")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "Test opportunity",
        organization: "Test Org",
        city: "Paris",
        date: "2026-01-10",
        startTime: "09:00",
        endTime: "12:00",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    createdId = res.body._id;
  });

  it("GET /api/opportunities/:id returns the created opportunity", async () => {
    const res = await request(app).get(`/api/opportunities/${createdId}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("_id", createdId);
  });

  it("GET /api/opportunities/:id returns 404 when not found", async () => {
    const fakeId = "000000000000000000000000";
    const res = await request(app).get(`/api/opportunities/${fakeId}`);

    expect(res.status).toBe(404);
  });
});
