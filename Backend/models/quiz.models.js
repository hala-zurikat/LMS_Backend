import { query } from "../config/db.js";

// Get all quizzes
export const allQuizzes = async () => {
  try {
    const result = await query("SELECT * FROM Quizzes");
    return result.rows;
  } catch (err) {
    console.error("Failed to fetch all quizzes:", err.message);
    throw err;
  }
};

// Create new quiz
export const createQuizz = async (
  lesson_id,
  question,
  options,
  correct_answer
) => {
  try {
    const result = await query(
      "INSERT INTO Quizzes (lesson_id, question, options, correct_answer) VALUES ($1, $2, $3, $4) RETURNING *",
      [lesson_id, question, options, correct_answer]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Failed to create quiz:", err.message);
    throw err;
  }
};

// Update quiz
export const updateQuizz = async (
  id,
  { lesson_id, question, options, correct_answer }
) => {
  try {
    if (!id || isNaN(id) || id <= 0) {
      throw new Error("Invalid quiz ID");
    }

    const result = await query(
      "UPDATE Quizzes SET lesson_id=$1, question=$2, options=$3, correct_answer=$4 WHERE id=$5 RETURNING *",
      [lesson_id, question, options, correct_answer, id]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Failed to update quiz:", err.message);
    throw err;
  }
};

// Get quizzes by lesson_id
export const getQuizzesByLessonId = async (lesson_id) => {
  try {
    const result = await query("SELECT * FROM Quizzes WHERE lesson_id=$1", [
      lesson_id,
    ]);
    return result.rows;
  } catch (err) {
    console.error("Failed to get quizzes by lesson_id:", err.message);
    throw err;
  }
};

// Get quiz by id
export const getQuizzesById = async (id) => {
  try {
    if (!id || isNaN(id) || id <= 0) {
      throw new Error("Invalid quiz ID");
    }

    const result = await query("SELECT * FROM Quizzes WHERE id=$1", [id]);
    return result.rows[0];
  } catch (err) {
    console.error("Failed to get quiz by id:", err.message);
    throw err;
  }
};

// Delete quiz
export const deleteQuizz = async (id) => {
  try {
    if (!id || isNaN(id) || id <= 0) {
      throw new Error("Invalid quiz ID");
    }

    const result = await query("DELETE FROM Quizzes WHERE id=$1 RETURNING *", [
      id,
    ]);
    return result.rows[0];
  } catch (err) {
    console.error("Failed to delete quiz:", err.message);
    throw err;
  }
};
