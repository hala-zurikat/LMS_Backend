// 📁 controllers/instructor.controllers.js
import { CourseModel } from "../models/course.models.js";
import { getInstructorStats } from "../models/instructor.models.js";

export async function instructorStatsHandler(req, res) {
  try {
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

// ✅ Get all courses for instructor
export async function getInstructorCoursesHandler(req, res) {
  try {
    const instructorId = req.user.id;
    const courses = await CourseModel.getCoursesByInstructorId(instructorId);
    res.status(200).json(courses);
  } catch (error) {
    console.error("❌ Failed to fetch courses", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

// ✅ Create course
export async function createCourseHandler(req, res) {
  try {
    const instructorId = req.user.id;
    const courseData = {
      ...req.body,
      instructor_id: instructorId,
    };

    const course = await CourseModel.createCourse(courseData);
    res.status(201).json(course);
  } catch (error) {
    console.error("❌ Failed to create course", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

// ✅ Update course
export async function updateCourseHandler(req, res) {
  try {
    const instructorId = req.user.id;
    const courseId = req.params.id;

    const course = await CourseModel.getCourseById(courseId);
    if (!course || course.instructor_id !== instructorId) {
      return res
        .status(404)
        .json({ message: "Course not found or access denied" });
    }

    const updatedCourse = await CourseModel.updateCourse(courseId, {
      ...req.body,
      instructor_id: instructorId, // keep ownership
    });

    res.json(updatedCourse);
  } catch (error) {
    console.error("Failed to update course", error);
    res.status(500).json({ message: "Failed to update course" });
  }
}

// ✅ Delete course
export async function deleteCourseHandler(req, res) {
  try {
    const instructorId = req.user.id;
    const courseId = req.params.id;

    const course = await CourseModel.getCourseById(courseId);
    if (!course || course.instructor_id !== instructorId) {
      return res
        .status(404)
        .json({ message: "Course not found or access denied" });
    }

    await CourseModel.deleteCourse(courseId);
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Failed to delete course", error);
    res.status(500).json({ message: "Failed to delete course" });
  }
}
