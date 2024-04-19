// loan_account.js
import express from "express";
import { openLoanAccount, getLoanAccount, updateLoanAccount, deleteLoanAccount } from "../controllers/loan_account.js";

const router = express.Router();

// POST: Open a new loan account. The request body should contain the necessary account details.
router.post("/open", openLoanAccount);

// GET: Retrieve details of a loan account. The request body require cust_id and acct_type as a parameter.
router.get("/get", getLoanAccount);

// PUT: Update a loan account. The request body would contain the updated account details.
router.put("/update", updateLoanAccount);

// DELETE: Close a loan account. The request body require cust_id and acct_type as a parameter.
router.delete("/delete", deleteLoanAccount);

export default router;