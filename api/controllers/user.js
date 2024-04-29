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