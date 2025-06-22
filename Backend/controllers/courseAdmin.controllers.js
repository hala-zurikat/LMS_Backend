import { CourseAdminModel } from "../models/courseAdmin.models.js";

export async function getAllAdminCourses(req, res) {
  try {
    const courses = await CourseAdminModel.getAllCourses();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
export async function getCourseContentAdmin(req, res) {
  const { courseId } = req.params;
  if (isNaN(courseId))
    return res.status(400).json({ message: "Invalid course ID" });

  try {
    const courseContent = await CourseAdminModel.getCourseContentById(courseId);
    if (!courseContent)
      return res.status(404).json({ message: "Course not found" });

    res.json(courseContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
export async function approveCourse(req, res) {
  const { courseId } = req.params;
  const { approve } = req.body;

  try {
    await CourseAdminModel.updateCourseApproval(courseId, approve);
    res.json({ message: "Course approval updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
