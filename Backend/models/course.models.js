import { query } from "../config/db.js";

const CourseModel = {
  async getCoursesByInstructorId(instructorId) {
    const result = await query(
      `SELECT 
         c.*, 
         u.name AS instructor_name 
       FROM courses c
       JOIN users u ON c.instructor_id = u.id
       WHERE c.instructor_id = $1`,
      [instructorId]
    );
    return result.rows;
  },

  async createCourse(courseData) {
    // الصورة الافتراضية
    const defaultThumbnail = "/course-thumbnails/fullstack_web.jpg";

    const result = await query(
      `INSERT INTO courses 
        (title, description, instructor_id, category_id, price, thumbnail_url, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [
        courseData.title,
        courseData.description,
        courseData.instructor_id,
        courseData.category_id,
        courseData.price || 0.0,
        courseData.thumbnail_url || defaultThumbnail,
      ]
    );
    return result.rows[0];
  },

  async getCourseById(id) {
    const result = await query(
      `SELECT 
         c.*, 
         u.name AS instructor_name 
       FROM courses c
       JOIN users u ON c.instructor_id = u.id
       WHERE c.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async updateCourse(id, data) {
    const result = await query(
      `UPDATE courses 
       SET title = $1, description = $2, category_id = $3, updated_at = NOW()
       WHERE id = $4 
       RETURNING *`,
      [data.title, data.description, data.category_id, id]
    );
    return result.rows[0];
  },

  async deleteCourse(id) {
    // حذف الـ submissions المرتبطة بالـ assignments التي ضمن دروس الكورس
    await query(
      `DELETE FROM submissions
     WHERE assignment_id IN (
       SELECT a.id FROM assignments a
       JOIN lessons l ON a.lesson_id = l.id
       JOIN modules m ON l.module_id = m.id
       WHERE m.course_id = $1
     )`,
      [id]
    );

    // حذف الـ assignments المرتبطة بدروس الكورس
    await query(
      `DELETE FROM assignments
     WHERE lesson_id IN (
       SELECT l.id FROM lessons l
       JOIN modules m ON l.module_id = m.id
       WHERE m.course_id = $1
     )`,
      [id]
    );

    // حذف الـ quizzes المرتبطة بدروس الكورس
    await query(
      `DELETE FROM quizzes
     WHERE lesson_id IN (
       SELECT l.id FROM lessons l
       JOIN modules m ON l.module_id = m.id
       WHERE m.course_id = $1
     )`,
      [id]
    );

    // حذف الدروس المرتبطة بكل الوحدات في الكورس
    await query(
      `DELETE FROM lessons
     WHERE module_id IN (
       SELECT id FROM modules WHERE course_id = $1
     )`,
      [id]
    );

    // حذف الوحدات المرتبطة بالكورس
    await query(`DELETE FROM modules WHERE course_id = $1`, [id]);

    // حذف التسجيلات المرتبطة بالكورس (المستخدمين المسجلين)
    await query(`DELETE FROM enrollments WHERE course_id = $1`, [id]);

    // حذف الكورس نفسه
    const result = await query(
      `DELETE FROM courses WHERE id = $1 RETURNING *`,
      [id]
    );

    return result.rows[0]; // إرجاع الكورس المحذوف (اختياري)
  },
  // ✅ Get all courses with category and instructor
  async getAllCourses() {
    const result = await query(
      `SELECT 
         c.*, 
         u.name AS instructor_name, 
         cat.name AS category_name
       FROM courses c
       JOIN users u ON c.instructor_id = u.id
       LEFT JOIN categories cat ON c.category_id = cat.id`
    );
    return result.rows;
  },

  // ✅ Get courses by student user_id (enrolled)
  async getCoursesByUserId(userId) {
    const result = await query(
      `SELECT 
         c.*, 
         u.name AS instructor_name, 
         cat.name AS category_name
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       JOIN users u ON c.instructor_id = u.id
       LEFT JOIN categories cat ON c.category_id = cat.id
       WHERE e.user_id = $1`,
      [userId]
    );
    return result.rows;
  },

  // ✅ Get courses by category
  async getCoursesByCategory(categoryId) {
    const result = await query(
      `SELECT 
         c.*, 
         u.name AS instructor_name, 
         cat.name AS category_name
       FROM courses c
       JOIN users u ON c.instructor_id = u.id
       LEFT JOIN categories cat ON c.category_id = cat.id
       WHERE c.category_id = $1`,
      [categoryId]
    );
    return result.rows;
  },

  async getCourseContentById(courseId) {
    // استعلام جلب معلومات الكورس
    const courseResult = await query(
      `SELECT id, title, description FROM courses WHERE id = $1`,
      [courseId]
    );
    if (courseResult.rows.length === 0) return null;

    const course = courseResult.rows[0];

    // استعلام جلب الوحدات مع الدروس
    const modulesResult = await query(
      `SELECT
         m.id, m.title, m.description, m."order",
         COALESCE(
           json_agg(
             json_build_object(
               'id', l.id,
               'title', l.title,
               'content_type', l.content_type,
               'content_url', l.content_url,
               'duration', l.duration,
               'order', l."order",
               'is_free', l.is_free
             ) ORDER BY l."order"
           ) FILTER (WHERE l.id IS NOT NULL), '[]'
         ) AS lessons
       FROM modules m
       LEFT JOIN lessons l ON l.module_id = m.id
       WHERE m.course_id = $1
       GROUP BY m.id
       ORDER BY m."order"`,
      [courseId]
    );

    course.modules = modulesResult.rows;

    return course;
  },
  async searchCourses(searchTerm) {
    const searchValue = `%${searchTerm.toLowerCase()}%`;

    const result = await query(
      `SELECT 
         c.*, 
         u.name AS instructor_name, 
         cat.name AS category_name
       FROM courses c
       JOIN users u ON c.instructor_id = u.id
       LEFT JOIN categories cat ON c.category_id = cat.id
       WHERE LOWER(c.title) LIKE $1 OR LOWER(c.description) LIKE $1`,
      [searchValue]
    );

    return result.rows;
  },
};

export { CourseModel };
