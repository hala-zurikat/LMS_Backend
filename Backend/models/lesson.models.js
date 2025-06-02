import { query } from "../config/db.js";

// Get all lessons
export const getAllLessons = async () => {
  const result = await query(
    'SELECT * FROM lessons ORDER BY module_id, "order"'
  );
  return result.rows;
};

//Get lesson by Id
export const getLessonById = async () => {
  const result = await query("select * from lessons where id=$1", [id]);
  return result.rows[0];
};

//Update lesson
export const updateLesson = async (id, lesson) => {
  const {
    module_id,
    title,
    content_type,
    content_url,
    duration,
    order,
    is_free,
  } = lesson;
  const result = await query(
    `UPDATE lessons SET 
      module_id = $1,
      title = $2,
      content_type = $3,
      content_url = $4,
      duration = $5,
      "order" = $6,
      is_free = $7,
      updated_at = NOW()
     WHERE id = $8 RETURNING *`,
    [module_id, title, content_type, content_url, duration, order, is_free, id]
  );
  return result.rows[0];
};

//Create a lesson
export const createLesson = async (lesson) => {
  const {
    module_id,
    title,
    content_type,
    content_url,
    duration,
    order,
    is_free,
  } = lesson;
  const result = await query(
    `INSERT INTO lessons (module_id, title, content_type, content_url, duration, "order", is_free, created_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,NOW(),NOW()) RETURNING *`,
    [module_id, title, content_type, content_url, duration, order, is_free]
  );

  return result.rows[0];
};

//Delete lesson
export const deleteLesson = async (id) => {
  await query("delete from lessons where id=$1", [id]);
};
