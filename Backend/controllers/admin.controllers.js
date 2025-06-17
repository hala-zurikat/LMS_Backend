import { createResponse } from "../utils/helper.js";
import db from "../config/db.js";
export async function getAdminStats(req, res) {
  try {
    const totalUsers = await db.query("SELECT COUNT(*) FROM users");
    const totalCourses = await db.query("SELECT COUNT(*) FROM courses");
    const totalAssignments = await db.query("SELECT COUNT(*) FROM assignments");
    const totalEnrollments = await db.query("SELECT COUNT(*) FROM enrollments");

    res.json(
      createResponse(true, "Admin statistics fetched successfully", {
        totalUsers: Number(totalUsers.rows[0].count),
        totalCourses: Number(totalCourses.rows[0].count),
        totalAssignments: Number(totalAssignments.rows[0].count),
        totalEnrollments: Number(totalEnrollments.rows[0].count),
      })
    );
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res
      .status(500)
      .json(
        createResponse(false, "Failed to fetch statistics", null, error.message)
      );
  }
}
