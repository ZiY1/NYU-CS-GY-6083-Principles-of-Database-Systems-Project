import { db } from '../connect.js';

// This function assumes that you have a way to generate or retrieve a new `acct_id` and `acct_no`.
// It also assumes that `cust_id` is retrieved or known at the point of calling this function,
// perhaps from a logged-in user's session data.

export const openCheckingAccount = (req, res) => {
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

    // Define the parameters for the zzz_account table.
    const accountParams = [
        req.body.acct_id, req.body.acct_type, req.body.acct_no, req.body.acct_name, req.body.acct_date_opened,
        req.body.acct_bill_state, req.body.acct_bill_city, req.body.acct_bill_street,
        req.body.acct_bill_zipcode, req.body.cust_id
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

            // If the account is successfully created, insert details into zzz_checking.
            const insertCheckingQuery = `
                INSERT INTO zzz_checking (
                    acct_id, acct_type, service_charge
                ) VALUES (?, ?, ?)
            `;

            // Define the parameters for the zzz_checking table.
            const checkingParams = [
                req.body.acct_id, req.body.acct_type, req.body.service_charge
            ];

            db.query(insertCheckingQuery, checkingParams, (err, checkingResults) => {
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

                    // Respond with a 200 OK status and a success message if the checking account is successfully created.
                    res.status(200).json({
                        message: "Checking account successfully created.",
                    });
                });
            });
        });
    });
};


export const getCheckingAccount = (req, res) => {
    // Query to select the account details from zzz_account and zzz_checking tables.
    const getAccountQuery = `
        SELECT 
            acct_no,
            za.acct_name,
            za.acct_date_opened,
            za.acct_bill_state,
            za.acct_bill_city,
            za.acct_bill_street,
            za.acct_bill_zipcode,
            zc.service_charge
        FROM 
            zzz_account AS za
        LEFT JOIN 
            zzz_checking AS zc ON za.acct_id = zc.acct_id AND za.acct_type = zc.acct_type
        WHERE 
            za.cust_id = ? AND za.acct_type = ?
    `;

    // Execute the query with the account ID and account type provided in the request parameters.
    db.query(getAccountQuery, [req.body.cust_id, req.body.acct_type], (err, data) => {
        // If an error occurs, return a 500 Internal Server Error response.
        if (err) return res.status(500).json(err);

        // If no matching account is found, return a 404 Not Found response.
        if (data.length === 0) return res.status(404).json("Checking account not found");

        // Return the account details with a 200 OK status.
        const checkingAccountDetails = data[0];
        res.status(200).json({
            message: "Account details retrieved successfully.",
            checkingAccountDetails
        });
    });
};


export const updateCheckingAccount = (req, res) => {
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
        req.body.cust_id,
        req.body.acct_type
    ];

    // Begin a transaction if you're updating multiple related tables and need to ensure atomicity
    db.beginTransaction((err) => {
        if (err) {
            return res.status(500).json(err);
        }

        db.query(updateAccountQuery, accountParams, (err, data) => {
            if (err) {
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

            // Define update the zzz_checking table query
            const updateCheckingQuery = `
                UPDATE zzz_checking
                SET service_charge = ?
                WHERE acct_id = (SELECT acct_id FROM zzz_account WHERE cust_id = ? AND acct_type = ?)
            `;

            // Define the parameters for the zzz_account table.
            const checkingParams = [
                req.body.service_charge,
                req.body.cust_id,
                req.body.acct_type
            ];

            db.query(updateCheckingQuery, checkingParams, (err, data) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json(err);
                    });
                }

                // Commit the transaction if all updates succeed
                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json(err);
                        });
                    }

                    res.status(200).json({
                        message: "Checking account updated successfully.",
                    });
                });
            });
        });
    });
};

export const deleteCheckingAccount = (req, res) => {
    const deleteCheckingQuery = `
        DELETE FROM zzz_checking  WHERE acct_id = (SELECT acct_id FROM zzz_account WHERE cust_id = ? AND acct_type = ?)
    `;

    const deleteAccountQuery = `
        DELETE FROM zzz_account WHERE cust_id = ? AND acct_type = ?
    `;

    const params = [
        req.body.cust_id,
        req.body.acct_type
    ];

    // Start a transaction
    db.beginTransaction((err) => {
        if (err) {
            return res.status(500).json(err);
        }

        // First, attempt to delete the checking account details
        db.query(deleteCheckingQuery, params, (err, data) => {
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

                    res.status(200).json({ message: "Checking account deleted successfully." });
                });
            });
        });
    });
};
