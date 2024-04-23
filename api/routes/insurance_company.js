import express from "express";
import { insertInsuranceCompany, getAllInsuranceCompany, getInsuranceCompany, updateInsuranceCompany } from "../controllers/insurance_company.js";

const router = express.Router();

router.post("/insert", insertInsuranceCompany);

router.get("/get_all", getAllInsuranceCompany);

router.get("/get", getInsuranceCompany);

router.put("/update", updateInsuranceCompany);

export default router;