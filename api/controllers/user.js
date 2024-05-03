import { db } from '../connect.js';
import jwt from "jsonwebtoken";

export const getUser = (req, res) => {
    // TODO
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        // Query to select user details from zzz_customer table based on cust_id
        const getUserQuery = `
            SELECT 
                * 
            FROM 
                zzz_customer 
            WHERE 
                cust_id = ?
        `;

        // Execute the query with the cust_id provided in the request parameters
        db.query(getUserQuery, [userInfo.cust_id], (err, data) => {
            // If an error occurs, return a 500 Internal Server Error response
            if (err) return res.status(500).json(err);

            // If no matching user is found, return a 404 Not Found response
            if (data.length === 0) return res.status(404).json("User not found");

            // Return the user details with a 200 OK status
            const userData = data[0];
            res.status(200).json({
                message: "User details retrieved successfully",
                user: userData
            });
        });
    });
};

export const updateProfile = (req, res) => {
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        // Define update the zzz_customer table query
        const updateProfileQuery = `
        UPDATE zzz_customer
        SET cust_fname = ?, 
            cust_lname = ?, 
            cust_state = ?, 
            cust_city = ?, 
            cust_street = ?,
            cust_zipcode = ?
        WHERE cust_id = ?
        `;

        // Define the parameters for the zzz_account table. 
        // !!! Ensure that the order of parameters matches the placeholders in the SQL query.
        const profileParams = [
            req.body.first_name,
            req.body.last_name,
            req.body.state,
            req.body.city,
            req.body.street,
            req.body.zipcode,
            userInfo.cust_id
        ];

        // Begin a transaction if you're updating multiple related tables and need to ensure atomicity
        db.beginTransaction((err) => {
            if (err) {
                return res.status(500).json({ error: err, message: "Failed to start database transaction." });
            }

            db.query(updateProfileQuery, profileParams, (err, profileResult) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json({ error: err, message: "Failed to update profile details." });
                    });
                }

                // Check if the account update affected any rows
                if (profileResult.affectedRows === 0) {
                    // If no rows were affected, it means no matching account was found
                    return db.rollback(() => {
                        res.status(404).json({ message: "No matching profile found to update." });
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
                        message: "Profile updated successfully.",
                    });
                });
            });
        });
    });
};