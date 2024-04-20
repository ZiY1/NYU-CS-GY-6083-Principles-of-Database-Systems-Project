import express from "express";
import { getServiceCharge, getSavingInterstRate } from "../controllers/acct_rate.js";

const router = express.Router();

router.get("/service_charge", getServiceCharge);

router.get("/saving_interest_rate", getSavingInterstRate);

export default router;