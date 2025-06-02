import express from "express";
import userRoutes from "./routes/user.routes.js";
import lessonRoutes from "./routes/lesson.routes.js";
import categoryRoutes from "./routes/category.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/categories", categoryRoutes);

export default app;
