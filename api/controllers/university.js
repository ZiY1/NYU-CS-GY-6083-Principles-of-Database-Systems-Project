import { db } from '../connect.js';
import jwt from "jsonwebtoken";

export const insertUniversity = (req, res) => {
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const insertUniversityQuery = `
            INSERT INTO zzz_univ (
                univ_name
            ) VALUES (?)
        `;

        const univParams = [
            req.body.univ_name
        ];

        // Start the transaction.
        db.beginTransaction((err) => {
            if (err) return res.status(500).json(err);

            db.query(insertUniversityQuery, univParams, (err, data) => {
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
                        message: "University successfully inserted.",
                    });
                });
            });
        });

    });
};

export const getAllUniversities = (req, res) => {
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const getAllUniversitiesQuery = `
            SELECT 
                *
            FROM 
                zzz_univ;
        `;

        db.query(getAllUniversitiesQuery, (err, data) => {
            // If an error occurs, return a 500 Internal Server Error response.
            if (err) return res.status(500).json(err);

            if (data.length === 0) return res.status(404).json("Record not found");

            // Return the univ details with a 200 OK status.
            const universities = data;
            res.status(200).json({
                message: "Universities retrieved successfully.",
                universities
            });
        });
    });
};

export const getUniversity = (req, res) => {
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const getUniversityQuery = `
            SELECT 
                *
            FROM 
                zzz_univ
            WHERE
                univ_id = ?;
        `;

        db.query(getUniversityQuery, [req.query.univ_id], (err, data) => {
            // If an error occurs, return a 500 Internal Server Error response.
            if (err) return res.status(500).json(err);

            if (data.length === 0) return res.status(404).json("Record not found");

            // Return the univ details with a 200 OK status.
            const univ = data;
            res.status(200).json({
                message: "University retrieved successfully.",
                univ
            });
        });
    });
};

export const updateUniversity = (req, res) => {
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const updateUniversityQuery = `
        UPDATE zzz_univ
            SET univ_name = ?
            WHERE univ_id = ?
        `;

        db.query(updateUniversityQuery, [req.body.univ_name, req.body.univ_id], (err, data) => {
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
                    message: "University updated successfully.",
                });
            });
        });
    });
};


// Delete might be restricted by FK constriant

// export const deleteUniversity = (req, res) => {
//     const token = req.cookies.accessToken;

//     if (!token) return res.status(401).json("Not logged in!");

//     jwt.verify(token, "secretkey", (err, userInfo) => {
//         if (err) return res.status(403).json("Token is not valid!");

//         const deleteUniversityQuery = `
//             DELETE 
//                 FROM zzz_univ  
//                 WHERE univ_id = ?;
//         `;

//         // Start a transaction
//         db.beginTransaction((err) => {
//             if (err) {
//                 return res.status(500).json(err);
//             }

//             db.query(deleteUniversityQuery, [req.body.univ_id], (err, data) => {
//                 if (err) {
//                     // If there is an error, rollback the transaction
//                     return db.rollback(() => {
//                         res.status(500).json(err);
//                     });
//                 }

//                 if (data.affectedRows === 0) {
//                     return db.rollback(() => {
//                         res.status(404).json({ message: "No matching record found to update." });
//                     });
//                 }

//                 // Commit the transaction
//                 db.commit((err) => {
//                     if (err) {
//                         // If there is an error during commit, rollback the transaction
//                         return db.rollback(() => {
//                             res.status(500).json(err);
//                         });
//                     }

//                     res.status(200).json({ message: "University deleted successfully." });
//                 });
//             });
//         });

//     });
// };

