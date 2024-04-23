import { db } from '../connect.js';
import jwt from "jsonwebtoken";
import { AccountRateID } from '../constants/account_constants.js';

export const getServiceCharge = (req, res) => {
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const getServiceChargeQuery = `
            SELECT 
                service_charge 
            FROM 
                zzz_acct_rate 
            WHERE 
                rate_id = ?;
        `;

        db.query(getServiceChargeQuery, [AccountRateID.RATE_ID], (err, data) => {
            // If an error occurs, return a 500 Internal Server Error response.
            if (err) return res.status(500).json(err);

            // If no matching account is found, return a 404 Not Found response.
            if (data.length === 0) return res.status(404).json("Record not found");

            // Return the account details with a 200 OK status.
            const serviceCharge = data[0];
            res.status(200).json({
                message: "Service charge retrieved successfully.",
                serviceCharge
            });
        });
    });
};

export const getSavingInterstRate = (req, res) => {
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

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
            const interestRate = data[0];
            res.status(200).json({
                message: "Saving interest rate retrieved successfully.",
                interestRate
            });
        });
    });
};

export const getLoanInterstRate = (req, res) => {
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const getLoanInterstRateQuery = `
            SELECT 
                loan_rate 
            FROM 
                zzz_acct_rate 
            WHERE 
                rate_id = ?;
        `;

        db.query(getLoanInterstRateQuery, [AccountRateID.RATE_ID], (err, data) => {
            // If an error occurs, return a 500 Internal Server Error response.
            if (err) return res.status(500).json(err);

            // If no matching account is found, return a 404 Not Found response.
            if (data.length === 0) return res.status(404).json("Record not found");

            // Return the account details with a 200 OK status.
            const loanInterestRate = data[0];
            res.status(200).json({
                message: "Loan interest rate retrieved successfully.",
                loanInterestRate
            });
        });
    });
};