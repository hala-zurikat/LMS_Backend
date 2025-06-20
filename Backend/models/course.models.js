import { query } from "../config/db.js";

export const CourseModel = {
  async getAllCourses() {
    try {
      const result = await query(
        `SELECT 
         courses.*, 
         users.name AS instructor_name
       FROM 
         courses
       JOIN 
         users ON courses.instructor_id = users.id
       WHERE 
         users.role = 'instructor'
       ORDER BY 
         courses.id`
      );
      return result.rows;
    } catch (error) {
      throw new Error("Error fetching courses: " + error.message);
    }
  },

  async getCourseById(id) {
    try {
      const result = await query(
        `SELECT 
         courses.*, 
         users.name AS instructor_name
       FROM 
         courses
       JOIN 
         users ON courses.instructor_id = users.id
       WHERE 
         courses.id = $1`,
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error("Error fetching course: " + error.message);
    }
  },

  // الدالة الجديدة لجلب محتوى الكورس كامل (modules + lessons + assignments)
  async getCourseContentById(id) {
    try {
      // جلب بيانات الكورس الأساسية مع اسم المعلم
      const courseResult = await query(
        `SELECT c.*, u.name AS instructor_name
         FROM courses c
         JOIN users u ON c.instructor_id = u.id
         WHERE c.id = $1`,
        [id]
      );

      if (courseResult.rows.length === 0) {
        return null;
      }
      const course = courseResult.rows[0];

      // Modules مع الدروس (lessons)
      const modulesResult = await query(
        `SELECT m.id, m.title, m.description, m."order",
           COALESCE(json_agg(
             json_build_object(
               'id', l.id,
               'title', l.title,
               'content_type', l.content_type,
               'content_url', l.content_url,
               'duration', l.duration,
               'order', l."order",
               'is_free', l.is_free
             ) ORDER BY l."order"
           ) FILTER (WHERE l.id IS NOT NULL), '[]') AS lessons
         FROM modules m
         LEFT JOIN lessons l ON l.module_id = m.id
         WHERE m.course_id = $1
         GROUP BY m.id
         ORDER BY m."order"`,
        [id]
      );

      // الواجبات (Assignments) المرتبطة بالكورس عبر الدروس
      const assignmentsResult = await query(
        `SELECT a.id, a.title, a.description, a.deadline, l.id AS lesson_id
         FROM assignments a
         JOIN lessons l ON a.lesson_id = l.id
         JOIN modules m ON l.module_id = m.id
         WHERE m.course_id = $1
         ORDER BY a.deadline`,
        [id]
      );

      return {
        ...course,
        modules: modulesResult.rows,
        assignments: assignmentsResult.rows,
      };
    } catch (error) {
      throw new Error("Error fetching course content: " + error.message);
    }
  },

  async createCourse(data) {
    try {
      const {
        title,
        description,
        instructor_id,
        category_id,
        price,
        thumbnail_url,
        is_published,
        is_approved,
      } = data;

      const result = await query(
        `INSERT INTO courses (title, description, instructor_id, category_id, price, thumbnail_url, is_published, is_approved)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          title,
          description,
          instructor_id,
          category_id,
          price ?? 0.0,
          thumbnail_url,
          is_published ?? false,
          is_approved ?? false,
        ]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error("Error creating course: " + error.message);
    }
  },

  async updateCourse(id, data) {
    try {
      const {
        title,
        description,
        instructor_id,
        category_id,
        price,
        thumbnail_url,
        is_published,
        is_approved,
      } = data;

      const result = await query(
        `UPDATE courses SET
          title = $1,
          description = $2,
          instructor_id = $3,
          category_id = $4,
          price = $5,
          thumbnail_url = $6,
          is_published = $7,
          is_approved = $8,
          updated_at = CURRENT_TIMESTAMP
         WHERE id = $9
         RETURNING *`,
        [
          title,
          description,
          instructor_id,
          category_id,
          price,
          thumbnail_url,
          is_published,
          is_approved,
          id,
        ]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error("Error updating course: " + error.message);
    }
  },

  async getCoursesByCategory(categoryId) {
    try {
      const result = await query(
        `SELECT 
         courses.*, 
         users.name AS instructor_name
       FROM 
         courses
       JOIN 
         users ON courses.instructor_id = users.id
       WHERE 
         courses.category_id = $1
       ORDER BY 
         courses.id`,
        [categoryId]
      );
      return result.rows;
    } catch (error) {
      throw new Error("Error fetching courses by category: " + error.message);
    }
  },

  async deleteCourse(id) {
    try {
      const result = await query(
        `DELETE FROM courses WHERE id = $1 RETURNING *`,
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error("Error deleting course: " + error.message);
    }
  },
};
