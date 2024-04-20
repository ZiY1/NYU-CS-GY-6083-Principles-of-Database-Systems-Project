import express from "express";
import { getServiceCharge } from "../controllers/acct_rate.js";

const router = express.Router();

router.get("/service_charge", getServiceCharge);

export default router;