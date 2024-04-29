import { db } from '../connect.js';
import jwt from "jsonwebtoken";

export const insertInsuranceCompany = (req, res) => {
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const insertInsuranceCompanyQuery = `
            INSERT INTO zzz_insur_co (
                ic_name,
                ic_state,
                ic_city,
                ic_street,
                ic_zipcode
            ) VALUES (?, ?, ?, ?, ?)
        `;

        const insurCoParams = [
            req.body.ic_name,
            req.body.ic_state,
            req.body.ic_city,
            req.body.ic_street,
            req.body.ic_zipcode,
        ];

        // Start the transaction.
        db.beginTransaction((err) => {
            if (err) return res.status(500).json(err);

            db.query(insertInsuranceCompanyQuery, insurCoParams, (err, data) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json(err);
                    });
                }

                // Commit the transaction if insert operations succeed.
                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json(err);
                        });
                    }

                    // Respond with a 200 OK status and a success message if the  successfully created.
                    res.status(200).json({
                        message: "Insurance Company successfully inserted.",
                    });
                });
            });
        });

    });
};

export const getAllInsuranceCompany = (req, res) => {
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const getAllInsuranceCompanyQuery = `
            SELECT 
                *
            FROM 
                zzz_insur_co;
        `;

        db.query(getAllInsuranceCompanyQuery, (err, data) => {
            // If an error occurs, return a 500 Internal Server Error response.
            if (err) return res.status(500).json(err);

            if (data.length === 0) return res.status(404).json("Record not found");

            // Return the insur co details with a 200 OK status.
            const insuranceCompanies = data;
            res.status(200).json({
                message: "Insurance Company retrieved successfully.",
                insuranceCompanies
            });
        });
    });
};

export const getInsuranceCompany = (req, res) => {
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const getInsuranceCompanyQuery = `
            SELECT 
                *
            FROM 
                zzz_insur_co
            WHERE
                ic_id = ?;
        `;

        db.query(getInsuranceCompanyQuery, [req.query.ic_id], (err, data) => {
            // If an error occurs, return a 500 Internal Server Error response.
            if (err) return res.status(500).json(err);

            if (data.length === 0) return res.status(404).json("Record not found");

            // Return the insur co details with a 200 OK status.
            const insuranceCompany = data[0];
            res.status(200).json({
                message: "Insurance Company retrieved successfully.",
                insuranceCompany
            });
        });
    });
};

export const updateInsuranceCompany = (req, res) => {
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const updateInsuranceCompanyQuery = `
            UPDATE 
                zzz_insur_co
            SET 
                ic_name = ?,
                ic_state = ?,
                ic_city = ?,
                ic_street = ?,
                ic_zipcode = ?
            WHERE 
                ic_id = ?;
        `;

        const insurCoParams = [
            req.body.ic_name,
            req.body.ic_state,
            req.body.ic_city,
            req.body.ic_street,
            req.body.ic_zipcode,
            req.body.ic_id
        ];

        db.query(updateInsuranceCompanyQuery, insurCoParams, (err, data) => {
            // If an error occurs, return a 500 Internal Server Error response.
            if (err) return res.status(500).json(err);

            if (data.affectedRows === 0) {
                return db.rollback(() => {
                    res.status(404).json({ message: "No matching record found to update." });
                });
            }

            // Commit the transaction if update succeed
            db.commit((err) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json({ error: err, message: "Failed to commit the update." });
                    });
                }

                res.status(200).json({
                    message: "Insurance Company updated successfully.",
                });
            });
        });
    });
};