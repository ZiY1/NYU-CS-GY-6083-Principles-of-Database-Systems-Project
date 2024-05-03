// saving_account.js
import express from "express";
import { openSavingAccount, getSavingAccount, updateSavingAccount, deleteSavingAccount } from "../controllers/saving_account.js";

const router = express.Router();

// POST: Open a new saving account. The request body should contain the necessary account details.
router.post("/open", openSavingAccount);

// GET: Retrieve details of a saving account. The request body require cust_id and acct_type as a parameter.
router.get("/get", getSavingAccount);

// PUT: Update a saving account. The request body would contain the updated account details.
router.put("/update", updateSavingAccount);

// DELETE: Close a saving account. The request body require cust_id and acct_type as a parameter.
router.delete("/delete", deleteSavingAccount);

export default router;
