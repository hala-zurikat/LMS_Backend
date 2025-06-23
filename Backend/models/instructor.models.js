import { query } from "../config/db.js";

export async function getInstructorStats(instructorId) {
  try {
    console.log("📊 Getting stats for instructorId:", instructorId);

    if (!instructorId) {
      throw new Error("Instructor ID is required");
    }

    // 📚 Total Courses Created
    const totalCoursesRes = await query(
      "SELECT COUNT(*) FROM courses WHERE instructor_id = $1",
      [instructorId]
    );

    // 👨‍🎓 Total Enrollments in Instructor's Courses
    const totalEnrollmentsRes = await query(
      `SELECT COUNT(*) FROM enrollments 
       WHERE course_id IN (
         SELECT id FROM courses WHERE instructor_id = $1
       )`,
      [instructorId]
    );

    // 📝 Total Assignments across Instructor's Courses
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

    // 📈 Average Progress per Course
    const coursesProgressRes = await query(
      `SELECT c.title AS name, AVG(e.progress) AS progress
       FROM courses c
       LEFT JOIN enrollments e ON c.id = e.course_id
       WHERE c.instructor_id = $1
       GROUP BY c.title`,
      [instructorId]
    );

    return {
      totalCourses: parseInt(totalCoursesRes.rows[0].count),
      totalEnrollments: parseInt(totalEnrollmentsRes.rows[0].count),
      totalAssignments: parseInt(totalAssignmentsRes.rows[0].count),
      coursesProgress: coursesProgressRes.rows.map((row) => ({
        name: row.name,
        progress: Math.round(row.progress) || 0,
      })),
    };
  } catch (error) {
    console.error("❌ Error in getInstructorStats:", error);
    throw new Error("Error fetching instructor stats: " + error.message);
  }
}
