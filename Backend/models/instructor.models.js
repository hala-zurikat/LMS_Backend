import { query } from "../config/db.js";

export async function getInstructorStats(instructorId) {
  try {
    console.log("Getting stats for instructorId:", instructorId);

    const totalCoursesRes = await query(
      "SELECT COUNT(*) FROM courses WHERE instructor_id = $1",
      [instructorId]
    );
    console.log("totalCoursesRes:", totalCoursesRes.rows);

    const totalEnrollmentsRes = await query(
      `SELECT COUNT(*) FROM enrollments 
       WHERE course_id IN (SELECT id FROM courses WHERE instructor_id = $1)`,
      [instructorId]
    );
    console.log("totalEnrollmentsRes:", totalEnrollmentsRes.rows);

    const totalAssignmentsRes = await query(
      `SELECT COUNT(*) FROM assignments 
   WHERE lesson_id IN (
     SELECT l.id FROM lessons l
     JOIN modules m ON l.module_id = m.id
     WHERE m.course_id IN (
       SELECT id FROM courses WHERE instructor_id = $1
     )
   )`,
      [instructorId]
    );

    const coursesProgressRes = await query(
      `SELECT c.title AS name, AVG(e.progress) AS progress
       FROM courses c
       LEFT JOIN enrollments e ON c.id = e.course_id
       WHERE c.instructor_id = $1
       GROUP BY c.title`,
      [instructorId]
    );
    console.log("coursesProgressRes:", coursesProgressRes.rows);

    return {
      totalCourses: Number(totalCoursesRes.rows[0].count),
      totalEnrollments: Number(totalEnrollmentsRes.rows[0].count),
      totalAssignments: Number(totalAssignmentsRes.rows[0].count),
      coursesProgress: coursesProgressRes.rows.map((row) => ({
        name: row.name,
        progress: Math.round(row.progress) || 0,
      })),
    };
  } catch (error) {
    console.error("Error in getInstructorStats:", error);
    throw new Error("Error fetching instructor stats: " + error.message);
  }
}
