// repositories/opportunity.repository.js
import { getDb } from "../db/mongo.js";
import { ObjectId } from "mongodb";

function collection() {
  return getDb().collection("opportunities");
}

export async function getAllOpportunities() {
  return await collection().find().toArray();
}

export async function getOpportunityById(id) {
  try {
    return await collection().findOne({ _id: new ObjectId(id) });
  } catch {
    return null; // id invalide
  }
}

export async function createOpportunity(data) {
  const result = await collection().insertOne(data);
  return { _id: result.insertedId, ...data };
}

export async function updateOpportunity(id, updates) {
  try {
    const result = await collection().findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updates },
      { returnDocument: "after" }
    );

    return result.value; // null si non trouvé
  } catch {
    return null;
  }
}

export async function deleteOpportunity(id) {
  try {
    const result = await collection().deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  } catch {
    return false;
  }
}
