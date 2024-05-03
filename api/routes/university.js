import express from "express";
import { insertUniversity, getAllUniversities, getUniversity, updateUniversity } from "../controllers/university.js";

const router = express.Router();

router.post("/insert", insertUniversity);

router.get("/get_all", getAllUniversities);

router.get("/get", getUniversity);

router.put("/update", updateUniversity);

export default router;