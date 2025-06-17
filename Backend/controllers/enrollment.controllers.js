// controllers/enrollmentController.js
import { EnrollmentModel } from "../models/enrollment.models.js";
import { enrollmentSchema } from "../validations/enrollment.validation.js";

export const EnrollmentController = {
  async getAll(req, res) {
    try {
      const enrollments = await EnrollmentModel.getAll();
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req, res) {
    const { id } = req.params;
    try {
      const enrollment = await EnrollmentModel.getById(id);
      if (!enrollment)
        return res.status(404).json({ error: "Enrollment not found" });
      res.json(enrollment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      // اصنع object كامل مع user_id من req.user أو req.session
      const enrollmentData = {
        user_id: req.user?.id || req.session?.userId, // تأكد من وجود user في req
        course_id: req.body.course_id,
        enrolled_at: new Date(), // ممكن تعطي تاريخ التسجيل تلقائياً
      };

      // تحقق من صحة البيانات
      const { error } = enrollmentSchema.validate(enrollmentData);
      if (error)
        return res.status(400).json({ error: error.details[0].message });

      // تحقق من التسجيل المسبق
      const existingEnrollment = await EnrollmentModel.findByUserAndCourse(
        enrollmentData.user_id,
        enrollmentData.course_id
      );
      if (existingEnrollment) {
        return res
          .status(409)
          .json({ error: "You are already enrolled in this course" });
      }

      // إنشاء التسجيل
      const newEnrollment = await EnrollmentModel.create(enrollmentData);
      res.status(201).json(newEnrollment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async getMyEnrollments(req, res) {
    try {
      const userId = req.user?.id || req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const courses = await EnrollmentModel.findCoursesByUser(userId);

      res.json(courses); // ✅ هذا الصح
    } catch (error) {
      console.error("Error fetching user enrollments:", error);
      res.status(500).json({ error: error.message });
    }
  },

  async update(req, res) {
    const { id } = req.params;
    try {
      const { error } = enrollmentSchema.validate(req.body);
      if (error)
        return res.status(400).json({ error: error.details[0].message });

      const updated = await EnrollmentModel.update(id, req.body);
      if (!updated)
        return res.status(404).json({ error: "Enrollment not found" });

      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req, res) {
    const { id } = req.params;
    try {
      const deleted = await EnrollmentModel.delete(id);
      if (!deleted)
        return res.status(404).json({ error: "Enrollment not found" });

      res.json({ message: "Enrollment deleted", deleted });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
