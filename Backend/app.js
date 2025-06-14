import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";

import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import passport from "./config/passport.js";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import lessonRoutes from "./routes/lesson.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import moduleRoutes from "./routes/module.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import enrollmentRoutes from "./routes/enrollment.routes.js";
import assignmentRoutes from "./routes/assignment.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import { notFound, errorHandler } from "./middleware/error.js";
import courseRoutes from "./routes/course.routes.js";

dotenv.config(); // تأكد إنها مفعلة في أول الكود لتحميل المتغيرات

const app = express();

// 1. Cookie parser (لازم قبل session)
app.use(cookieParser());

// 2. Sessions (قبل passport.session())
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mydefaultsecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
    },
  })
);

// 3. Passport initialization and session
app.use(passport.initialize());
app.use(passport.session());

// 4. Security and Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(helmet());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// 5. Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});
app.use(limiter);

// 6. Logger
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// 7. Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/courses", courseRoutes);

// 8. Health check
app.get("/health", (req, res) => res.json({ status: "OK" }));

// 9. Root endpoint
app.get("/", (req, res) => {
  res.json(
    createResponse(true, "OAuth 2 Google Authentication API", {
      version: "1.0.0",
      endpoints: {
        auth: "/auth/google",
        callback: "/auth/google/callback",
        user: "/auth/user",
        logout: "/auth/logout",
        profile: "/user/profile",
      },
    })
  );
});

// 10. Error handling middleware
app.use(notFound);
app.use(errorHandler);

export default app;
