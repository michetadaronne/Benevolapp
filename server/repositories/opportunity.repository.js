import Opportunity from "../models/Opportunity.js";

export async function getAllOpportunities() {
  const docs = await Opportunity.find().lean();
  return docs.map((doc) => ({
    ...doc,
    volunteerCount: doc.volunteers ? doc.volunteers.length : 0,
    volunteers: undefined,
  }));
}

export async function getOpportunityById(id) {
  const doc = await Opportunity.findById(id).lean();
  if (!doc) return null;
  return {
    ...doc,
    volunteerCount: doc.volunteers ? doc.volunteers.length : 0,
    volunteers: undefined,
  };
}

export async function getOpportunityByIdForOrganizer(id, organizerId) {
  const doc = await Opportunity.findOne({
    _id: id,
    createdBy: organizerId,
  })
    .populate("volunteers", "name email role")
    .lean();
  if (!doc) return null;
  return {
    ...doc,
    volunteerCount: doc.volunteers ? doc.volunteers.length : 0,
  };
}

export async function createOpportunity(data) {
  const doc = await Opportunity.create(data);
  return doc.toObject();
}

export async function updateOpportunity(id, updates) {
  return Opportunity.findByIdAndUpdate(id, updates, { new: true }).lean();
}

export async function deleteOpportunity(id) {
  const res = await Opportunity.findByIdAndDelete(id);
  return !!res;
}

export async function joinOpportunity(id, userId) {
  const doc = await Opportunity.findByIdAndUpdate(
    id,
    { $addToSet: { volunteers: userId } },
    { new: true }
  ).lean();
  if (!doc) return null;
  return {
    ...doc,
    volunteerCount: doc.volunteers ? doc.volunteers.length : 0,
    volunteers: undefined,
  };
}

export async function leaveOpportunity(id, userId) {
  const doc = await Opportunity.findByIdAndUpdate(
    id,
    { $pull: { volunteers: userId } },
    { new: true }
  ).lean();
  if (!doc) return null;
  return {
    ...doc,
    volunteerCount: doc.volunteers ? doc.volunteers.length : 0,
    volunteers: undefined,
  };
}

export async function getOpportunitiesByCreator(creatorId) {
  const docs = await Opportunity.find({ createdBy: creatorId })
    .populate("volunteers", "name email role")
    .lean();
  return docs.map((doc) => ({
    ...doc,
    volunteerCount: doc.volunteers ? doc.volunteers.length : 0,
  }));
}
