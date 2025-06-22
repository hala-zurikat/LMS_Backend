import dotenv from "dotenv";
import app from "./app.js";
import "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const ENV = process.env.NODE_ENV || "development";

// 🟢 لازم نخزن نتيجة app.listen في متغير server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running in ${ENV} mode on port ${PORT}`);
});

// ✅ التعامل مع الإنهاء الآمن للتطبيق
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("✅ Server closed.");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("🛑 SIGINT received (Ctrl+C). Shutting down gracefully...");
  server.close(() => {
    console.log("✅ Server closed.");
    process.exit(0);
  });
});
