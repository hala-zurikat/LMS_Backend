import { getInstructorStats } from "../models/instructor.models.js";

export async function instructorStatsHandler(req, res) {
  try {
    console.log("User from req:", req.user); // تحقق من وجود user
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: No user info" });
    }

    const instructorId = req.user.id;
    const stats = await getInstructorStats(instructorId);
    res.json(stats);
  } catch (error) {
    console.error("Error in instructorStatsHandler:", error);
    res.status(500).json({ error: "Failed to fetch instructor stats" });
  }
}
