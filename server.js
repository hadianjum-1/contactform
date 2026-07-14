import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import contactRoutes from "./routes/contactRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Trust Render/Heroku proxy
app.set("trust proxy", 1);

// Security headers
app.use(helmet());

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "https://nexgenbyte.com",
  "https://www.nexgenbyte.com",
  "https://contactform-two-beryl.vercel.app",
  "https://contactform-two-beryl.vercel.app/",
];

app.use(
  cors({
    origin(origin, callback) {
      // Allow Postman, server-to-server requests
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/+$/, "");

      if (allowedOrigins.includes(origin) || allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Request logging
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use("/api/contact", limiter);

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "NexGenByte API is running.",
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/contact", contactRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

// Error Handler (always last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`
==================================
 NexGenByte API Started
==================================
 Environment : ${process.env.NODE_ENV}
 Port        : ${PORT}
 URL         : http://localhost:${PORT}
==================================
`);
});