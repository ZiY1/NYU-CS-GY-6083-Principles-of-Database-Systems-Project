import { db } from '../connect.js';
import jwt from "jsonwebtoken";
import { AccountTypes } from '../constants/account_constants.js';
import { generateAccountNumber, getCurrentMySQLDateTime } from '../utils/account_utils.js';
import { AccountRateID } from '../constants/account_constants.js';

export const openSavingAccount = (req, res) => {
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        // Define the query to insert a new account into the zzz_account table.
        const insertAccountQuery = `
            INSERT INTO zzz_account (
                acct_id, 
                acct_type, 
                acct_no,
                acct_name, 
                acct_date_opened, 
                acct_bill_state, 
                acct_bill_city, 
                acct_bill_street, 
                acct_bill_zipcode, 
                cust_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const acctNo = generateAccountNumber();

        const acctDateOpened = getCurrentMySQLDateTime();

        // Define the parameters for the zzz_account table.
        const accountParams = [
            userInfo.cust_id, AccountTypes.SAVING, acctNo, req.body.acct_name, acctDateOpened,
            req.body.acct_bill_state, req.body.acct_bill_city, req.body.acct_bill_street,
            req.body.acct_bill_zipcode, userInfo.cust_id
        ];

        // Start the transaction.
        db.beginTransaction((err) => {
            if (err) return res.status(500).json(err);

            // Insert the new account into zzz_account.
            db.query(insertAccountQuery, accountParams, (err, data) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json(err);
                    });
                }

                const getSavingInterstRateQuery = `
                    SELECT 
                        interest_rate 
                    FROM 
                        zzz_acct_rate 
                    WHERE 
                        rate_id = ?;
                `;

                db.query(getSavingInterstRateQuery, [AccountRateID.RATE_ID], (err, data) => {
                    // If an error occurs, return a 500 Internal Server Error response.
                    if (err) return res.status(500).json(err);

                    // If no matching account is found, return a 404 Not Found response.
                    if (data.length === 0) return res.status(404).json("Record not found");

                    // Return the account details with a 200 OK status.
                    const interestRate = data[0].interest_rate;

                    // If the account is successfully created, insert details into zzz_saving.
                    const insertSavingQuery = `
                        INSERT INTO zzz_saving (
                            acct_id, acct_type, interest_rate
                        ) VALUES (?, ?, ?)
                    `;


                    // Define the parameters for the zzz_saving table.
                    const savingParams = [
                        userInfo.cust_id, AccountTypes.SAVING, interestRate
                    ];

                    db.query(insertSavingQuery, savingParams, (err, data) => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).json(err);
                            });
                        }

                        // Commit the transaction if both insert operations succeed.
                        db.commit((err) => {
                            if (err) {
                                return db.rollback(() => {
                                    res.status(500).json(err);
                                });
                            }

                            // Respond with a 200 OK status and a success message if the saving account is successfully created.
                            res.status(200).json({
                                message: "Saving account successfully created.",
                            });
                        });
                    });
                });
            });
        });
    });
};

export const getSavingAccount = (req, res) => {
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        // Query to select the account details from zzz_account and zzz_saving tables.
        const getSavingAccountQuery = `
            SELECT 
                acct_no,
                za.acct_name,
                za.acct_date_opened,
                za.acct_bill_state,
                za.acct_bill_city,
                za.acct_bill_street,
                za.acct_bill_zipcode,
                zs.interest_rate
            FROM 
                zzz_account AS za
            LEFT JOIN 
                zzz_saving AS zs ON za.acct_id = zs.acct_id AND za.acct_type = zs.acct_type
            WHERE 
                za.cust_id = ? AND za.acct_type = ?
        `;

        // Execute the query with the account ID and account type provided in the request parameters.
        db.query(getSavingAccountQuery, [userInfo.cust_id, AccountTypes.SAVING], (err, data) => {
            // If an error occurs, return a 500 Internal Server Error response.
            if (err) return res.status(500).json(err);

            // If no matching account is found, return a 404 Not Found response.
            if (data.length === 0) return res.status(404).json("Saving account not found");

            // Return the account details with a 200 OK status.
            const savingAccountDetails = data[0];
            res.status(200).json({
                message: "Saving account details retrieved successfully.",
                savingAccountDetails
            });
        });

    });
};

export const updateSavingAccount = (req, res) => {
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        // Define update the zzz_account table query
        const updateAccountQuery = `
            UPDATE zzz_account
            SET acct_name = ?, 
                acct_bill_state = ?, 
                acct_bill_city = ?, 
                acct_bill_street = ?, 
                acct_bill_zipcode = ?
            WHERE cust_id = ? AND acct_type = ?
        `;

        // Define the parameters for the zzz_account table. 
        // !!! Ensure that the order of parameters matches the placeholders in the SQL query.
        const accountParams = [
            req.body.acct_name,
            req.body.acct_bill_state,
            req.body.acct_bill_city,
            req.body.acct_bill_street,
            req.body.acct_bill_zipcode,
            userInfo.cust_id,
            AccountTypes.SAVING
        ];

        // Begin a transaction if you're updating multiple related tables and need to ensure atomicity
        db.beginTransaction((err) => {
            if (err) {
                return res.status(500).json({ error: err, message: "Failed to start database transaction." });
            }

            db.query(updateAccountQuery, accountParams, (err, accountResult) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json({ error: err, message: "Failed to update account details." });
                    });
                }

                // Check if the account update affected any rows
                if (accountResult.affectedRows === 0) {
                    // If no rows were affected, it means no matching account was found
                    return db.rollback(() => {
                        res.status(404).json({ message: "No matching account found to update." });
                    });
                }

                // Commit the transaction if account updates succeed
                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({ error: err, message: "Failed to commit the update." });
                        });
                    }

                    res.status(200).json({
                        message: "Account updated successfully, no change in service charge allowed.",
                    });
                });
            });
        });
    });
};

export const deleteSavingAccount = (req, res) => {
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const deleteSavingQuery = `
            DELETE FROM zzz_saving  WHERE acct_id = (SELECT acct_id FROM zzz_account WHERE cust_id = ? AND acct_type = ?)
        `;

        const deleteAccountQuery = `
            DELETE FROM zzz_account WHERE cust_id = ? AND acct_type = ?
        `;

        const params = [
            userInfo.cust_id,
            AccountTypes.SAVING
        ];

        // Start a transaction
        db.beginTransaction((err) => {
            if (err) {
                return res.status(500).json(err);
            }

            // First, attempt to delete the saving account details
            db.query(deleteSavingQuery, params, (err, data) => {
                if (err) {
                    // If there is an error, rollback the transaction
                    return db.rollback(() => {
                        res.status(500).json(err);
                    });
                }

                // Check if the account update affected any rows
                if (data.affectedRows === 0) {
                    // If no rows were affected, it means no matching account was found
                    return db.rollback(() => {
                        res.status(404).json({ message: "No matching account found to update." });
                    });
                }

                // Then, delete the main account record
                db.query(deleteAccountQuery, params, (err, data) => {
                    if (err) {
                        // If there is an error, rollback the transaction
                        return db.rollback(() => {
                            res.status(500).json(err);
                        });
                    }

                    // If both deletions are successful, commit the transaction
                    db.commit((err) => {
                        if (err) {
                            // If there is an error during commit, rollback the transaction
                            return db.rollback(() => {
                                res.status(500).json(err);
                            });
                        }

                        res.status(200).json({ message: "Saving account deleted successfully." });
                    });
                });
            });
        });
    });
};
