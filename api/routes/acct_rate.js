import express from "express";
import { getServiceCharge, getSavingInterstRate, getLoanInterstRate } from "../controllers/acct_rate.js";

const router = express.Router();

router.get("/service_charge", getServiceCharge);

router.get("/saving_interest_rate", getSavingInterstRate);

router.get("/loan_interest_rate", getLoanInterstRate);

export default router;