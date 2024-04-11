import express from "express";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import checkingAccountRoutes from "./routes/checking_account.js";
import savingAccountRoutes from "./routes/saving_account.js";
import cors from "cors";
import cookieParser from "cookie-parser";

// Application configuration
const corsOrigin = "http://localhost:5173";
const port = 8800;

const app = express();

// Middleware to enhance CORS security by specifying allowed origin
app.use(
    cors({
        origin: corsOrigin,
        credentials: true,
    })
);

// Middleware for parsing JSON bodies and cookies
app.use(express.json());
app.use(cookieParser());

// Custom middleware to set specific headers for handling credentials
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

// API routes with specific base paths
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/checking_account", checkingAccountRoutes);
app.use("/api/saving_account", savingAccountRoutes);

// Centralized error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging
    res.status(500).send('Something broke!'); // Send a generic error response
});

// Start the server
app.listen(port, () => {
    console.log(`Backend running on port ${port}!`);
});

/** TODO: Consider Using
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";

// Initialize environment variables
dotenv.config();

// Application configuration
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
const port = process.env.PORT || 8800;

const app = express();

// Middleware for security headers
app.use(helmet());

// Conditional middleware for logging HTTP requests in development environment
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Middleware to enhance CORS security by specifying allowed origin
app.use(cors({
    origin: corsOrigin,
    credentials: true, // Enable credentials for cross-origin requests
}));

// Middleware for parsing JSON bodies and cookies
app.use(express.json());
app.use(cookieParser());

// Custom middleware to set specific headers for handling credentials
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

// API routes with versioning and specific base paths
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);

// Centralized error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging
    res.status(500).send('Something broke!'); // Send a generic error response
});

// Start the server
app.listen(port, () => {
    console.log(`Backend running on port ${port}!`);
});

*/