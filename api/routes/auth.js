import express from "express";
import { register, login, logout } from "../controllers/auth.js";

// Create a new router instance
const router = express.Router();

// POST: Registers a new user. The request body should contain the username, password, and other user details.
router.post("/register", register);

// POST: Authenticates a user and establishes a session. The request body needs a username and password.
router.post("/login", login);

// POST: Ends the user's session and clears the authentication token.
router.post("/logout", logout);

// Export the router for use in the main application file
export default router;
