import { query } from "../config/db.js";
import bcrypt from "bcryptjs";
//Create new user
export const createUser = async (
  name,
  email,
  avatar,
  password,
  role = "user"
) => {
  try {
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const result = await query(
      "insert into users (name, email,avatar, password_hash, role) values ($1,$2,$3,$4,$5) returning *",
      [name, email, avatar, password_hash, role]
    );

    return result.rows[0];
  } catch (err) {
    console.error("Error creating user:", err);
    throw err;
  }
};

//Read all users
export const getAll = async () => {
  const result = await query("select * from users ");

  return result.rows;
};

//Read by id || email
export const getById = async (id) => {
  const result = await query("select * from users where id= $1", [id]);

  return result.rows[0];
};

export const getByEmail = async (email) => {
  const result = await query("select * from users where email=$1", [email]);

  return result.rows[0];
};

//Update user
export const updateUser = async (id, name, email, avatar, role, is_active) => {
  const result = await query(
    "update users set name=$1,email=$2, avatar=$3,role=$4,is_active=$5,updated_at=NOW() where id=$6 returning*",
    [name, email, avatar, role, is_active, id]
  );

  return result.rows[0];
};

//Delete users
export const deactivateUser = async (id) => {
  const result = await query(
    "update users set is_active=false, updated_at=NOW() where id=$1",
    [id]
  );
};
