import Opportunity from "../models/Opportunity.js";

type OpportunityFilters = {
  city?: string;
  date?: string;
  category?: string;
};

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function getAllOpportunities(filters: OpportunityFilters = {}) {
  const query: Record<string, unknown> = {};
  if (filters.city) {
    const city = filters.city.trim();
    if (city) {
      query.city = { $regex: new RegExp(`^${escapeRegex(city)}`, "i") };
    }
  }
  if (filters.date) {
    query.date = filters.date;
  }
  if (filters.category) {
    const category = filters.category.trim();
    if (category) {
      query.categories = { $regex: new RegExp(`^${escapeRegex(category)}`, "i") };
    }
  }

  const docs = await Opportunity.find(query).lean();
  return docs.map((doc) => ({
    ...doc,
    volunteerCount: doc.volunteers ? doc.volunteers.length : 0,
    volunteers: undefined,
  }));
}

export async function getOpportunityById(id, userId?: string) {
  const doc = await Opportunity.findById(id).lean();
  if (!doc) return null;
  const isJoined = Boolean(
    userId && doc.volunteers?.some((volunteerId) => `${volunteerId}` === `${userId}`)
  );
  return {
    ...doc,
    volunteerCount: doc.volunteers ? doc.volunteers.length : 0,
    isJoined,
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
  const isJoined = Boolean(
    doc.volunteers?.some((volunteer) => {
      if (!volunteer) return false;
      const volunteerId = typeof volunteer === "object" && "_id" in volunteer
        ? (volunteer as { _id: unknown })._id
        : volunteer;
      return `${volunteerId}` === `${organizerId}`;
    })
  );
  return {
    ...doc,
    volunteerCount: doc.volunteers ? doc.volunteers.length : 0,
    isJoined,
  };
}

export async function createOpportunity(data: Record<string, unknown>) {
  const doc = (await Opportunity.create(data as any)) as any;
  return doc.toObject();
}

export async function updateOpportunityForOrganizer(id, organizerId, updates) {
  return Opportunity.findOneAndUpdate(
    { _id: id, createdBy: organizerId },
    updates,
    { new: true }
  ).lean();
}

export async function deleteOpportunityForOrganizer(id, organizerId) {
  const res = await Opportunity.findOneAndDelete({ _id: id, createdBy: organizerId });
  return !!res;
}

export async function joinOpportunity(id, userId) {
  const doc = await Opportunity.findByIdAndUpdate(
    id,
    { $addToSet: { volunteers: userId } },
    { new: true }
  ).lean();
  if (!doc) return null;
  const isJoined = Boolean(
    doc.volunteers?.some((volunteerId) => `${volunteerId}` === `${userId}`)
  );
  return {
    ...doc,
    volunteerCount: doc.volunteers ? doc.volunteers.length : 0,
    isJoined,
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
  const isJoined = Boolean(
    doc.volunteers?.some((volunteerId) => `${volunteerId}` === `${userId}`)
  );
  return {
    ...doc,
    volunteerCount: doc.volunteers ? doc.volunteers.length : 0,
    isJoined,
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

export async function getOpportunitiesJoinedByUser(userId) {
  const docs = await Opportunity.find({ volunteers: userId }).lean();
  return docs.map((doc) => ({
    ...doc,
    volunteerCount: doc.volunteers ? doc.volunteers.length : 0,
    volunteers: undefined,
  }));
}
