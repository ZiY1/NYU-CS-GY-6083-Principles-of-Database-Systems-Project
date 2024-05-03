import express from "express";
import { getUser } from "../controllers/user.js";
import { updateProfile } from "../controllers/user.js";

const router = express.Router();

router.get("/get", getUser);
router.put("/update", updateProfile);

export default router;