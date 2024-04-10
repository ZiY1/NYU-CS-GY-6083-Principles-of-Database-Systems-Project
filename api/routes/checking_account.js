// checking_account.js
import express from "express";
import { openCheckingAccount, getCheckingAccount, updateCheckingAccount, deleteCheckingAccount } from "../controllers/checking_account.js";

const router = express.Router();

// POST: Open a new checking account. The request body should contain the necessary account details.
router.post("/open", openCheckingAccount);

// GET: Retrieve details of a checking account. The request body require cust_id and acct_type as a parameter.
router.get("/get", getCheckingAccount);

// PUT: Update a checking account. The request body would contain the updated account details.
router.put("/update", updateCheckingAccount);

// DELETE: Close a checking account. The request body require cust_id and acct_type as a parameter.
router.delete("/delete", deleteCheckingAccount);

export default router;
