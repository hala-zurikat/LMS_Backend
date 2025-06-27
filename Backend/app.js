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
import adminRoutes from "./routes/admin.routes.js";
import instructorRoutes from "./routes/instructor.routes.js";
import adminCoursesRoutes from "./routes/adminCourse.routes.js";

dotenv.config();

const app = express();

// ✅ Rate Limiters
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

// 1. Cookie parser
app.use(cookieParser());

// 2. Sessions
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

// 3. Passport
app.use(passport.initialize());
app.use(passport.session());

// 4. Security + Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(helmet());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Rate Limiting فقط في بيئة الإنتاج
if (process.env.NODE_ENV === "production") {
  app.use("/api/auth/login", loginLimiter);

  app.use((req, res, next) => {
    if (req.path === "/api/auth/login") return next();
    return generalLimiter(req, res, next);
  });
}

// 5. Logger
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// 6. Routes
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
app.use("/api/admin", adminRoutes);
app.use("/api/instructor", instructorRoutes);
app.use("/api/admin/users", userRoutes);
app.use("/api/admin/courses", adminCoursesRoutes);

// 7. Health Check
app.get("/health", (req, res) => res.json({ status: "OK" }));

// 8. Root endpoint
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

// 9. Error handlers
app.use(notFound);
app.use(errorHandler);

export default app;
