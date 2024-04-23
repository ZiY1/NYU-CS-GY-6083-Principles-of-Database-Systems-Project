import { db } from '../connect.js';
import jwt from "jsonwebtoken";
import { AccountTypes } from '../constants/account_constants.js';
import { generateAccountNumber, getCurrentMySQLDateTime, calculateMonthlyLoanPayment } from '../utils/account_utils.js';
import { AccountRateID } from '../constants/account_constants.js';

export const openLoanAccount = (req, res) => {
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
            userInfo.cust_id, AccountTypes.LOAN, acctNo, req.body.acct_name, acctDateOpened,
            req.body.acct_bill_state, req.body.acct_bill_city, req.body.acct_bill_street,
            req.body.acct_bill_zipcode, userInfo.cust_id,
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
                    const loanInterestRate = data[0].loan_rate;

                    // If the account is successfully created, insert details into zzz_loan.
                    const insertLoanQuery = `
                        INSERT INTO zzz_loan (
                            acct_id,
                            acct_type, 
                            loan_rate,
                            loan_amount,
                            loan_month,
                            loan_payment,
                            loan_type
                        ) VALUES (?, ?, ?, ?, ?, ?, ?)
                    `;

                    const loanPayment = calculateMonthlyLoanPayment(req.body.loan_amount, loanInterestRate, req.body.loan_month);

                    // Define the parameters for the zzz_loan table.
                    const loanParams = [
                        userInfo.cust_id,
                        AccountTypes.LOAN,
                        loanInterestRate,
                        req.body.loan_amount,
                        req.body.loan_month,
                        loanPayment,
                        req.body.loan_type
                    ];

                    db.query(insertLoanQuery, loanParams, (err, data) => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).json(err);
                            });
                        }

                        // If the zzz_loan is successfully created, conditionally insert details into zzz_stud_ln or zzz_home_ln.
                        if (req.body.loan_type == AccountTypes.STUDENT_LOAN) {
                            const insertStudentLoanQuery = `
                                INSERT INTO zzz_stud_ln (
                                    acct_id,
                                    acct_type, 
                                    stud_id,
                                    stud_type,
                                    exp_grad_date,
                                    univ_id
                                ) VALUES (?, ?, ?, ?, ?, ?)
                            `;

                            // Define the parameters for the zzz_stud_ln table.
                            const studentLoanParams = [
                                userInfo.cust_id,
                                AccountTypes.LOAN,
                                req.body.stud_id,
                                req.body.stud_type,
                                req.body.exp_grad_date,
                                req.body.univ_id
                            ];

                            db.query(insertStudentLoanQuery, studentLoanParams, (err, data) => {
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

                                    // Respond with a 200 OK status and a success message if the student loan account is successfully created.
                                    res.status(200).json({
                                        message: "Student Loan account successfully created.",
                                    });
                                });
                            });

                        } else if (req.body.loan_type == AccountTypes.HOME_LOAN) {
                            const insertHomeLoanQuery = `
                                INSERT INTO zzz_home_ln (
                                    acct_id,
                                    acct_type, 
                                    built_year,
                                    home_ins_acc_no,
                                    ins_premium,
                                    ic_id
                                ) VALUES (?, ?, ?, ?, ?, ?)
                            `;

                            // Define the parameters for the zzz_home_ln table.
                            const homeLoanParams = [
                                userInfo.cust_id,
                                AccountTypes.LOAN,
                                req.body.built_year,
                                req.body.home_ins_acc_no,
                                req.body.ins_premium,
                                req.body.ic_id
                            ];

                            db.query(insertHomeLoanQuery, homeLoanParams, (err, data) => {
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

                                    // Respond with a 200 OK status and a success message if the home loan account is successfully created.
                                    res.status(200).json({
                                        message: "Home Loan account successfully created.",
                                    });
                                });
                            });
                        } else {
                            // Commit the transaction if both insert operations succeed.
                            db.commit((err) => {
                                if (err) {
                                    return db.rollback(() => {
                                        res.status(500).json(err);
                                    });
                                }

                                // Respond with a 200 OK status and a success message if the loan account is successfully created.
                                res.status(200).json({
                                    message: "Loan account successfully created.",
                                });
                            });
                        }
                    });
                });
            });
        });
    });
};

export const getLoanAccount = (req, res) => {
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");


        // Query to select the account details from zzz_account, zzz_loan, and conditionally from zzz_stud_ln or zzz_home_ln.
        const getLoanAccountQuery = `
            SELECT 
                za.acct_no,
                za.acct_name,
                za.acct_date_opened,
                za.acct_bill_state,
                za.acct_bill_city,
                za.acct_bill_street,
                za.acct_bill_zipcode,
                zl.loan_rate,
                zl.loan_amount,
                zl.loan_month,
                zl.loan_payment,
                zl.loan_type,
                zsl.stud_id,
                zsl.stud_type,
                zsl.exp_grad_date,
                zsl.univ_id,
                zhl.built_year,
                zhl.home_ins_acc_no,
                zhl.ins_premium,
                zhl.ic_id
            FROM 
                zzz_account AS za
            JOIN 
                zzz_loan AS zl ON za.acct_id = zl.acct_id AND za.acct_type = zl.acct_type
            LEFT JOIN 
                zzz_stud_ln AS zsl ON zl.acct_id = zsl.acct_id AND zl.acct_type = zsl.acct_type AND zl.loan_type = 'T'
            LEFT JOIN 
                zzz_home_ln AS zhl ON zl.acct_id = zhl.acct_id AND zl.acct_type = zhl.acct_type AND zl.loan_type = 'H'
            WHERE 
                za.cust_id = ? AND za.acct_type = ?
        `;

        // Execute the query with the customer ID and account type provided in the request parameters.
        db.query(getLoanAccountQuery, [userInfo.cust_id, AccountTypes.LOAN], (err, data) => {
            if (err) return res.status(500).json({ error: err, message: "Failed to retrieve loan account details." });

            // If no matching account is found, return a 404 Not Found response.
            if (data.length === 0) return res.status(404).json({ message: "Loan account not found" });

            // Return the account details with a 200 OK status.
            const loanAccountDetails = data[0];
            res.status(200).json({
                message: "Loan account details retrieved successfully.",
                loanAccountDetails
            });
        });
    });
};

export const updateLoanAccount = (req, res) => {
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
            WHERE cust_id = ? AND acct_type = ?; 
        `;

        const accountParams = [
            req.body.acct_name,
            req.body.acct_bill_state,
            req.body.acct_bill_city,
            req.body.acct_bill_street,
            req.body.acct_bill_zipcode,
            userInfo.cust_id,
            AccountTypes.LOAN
        ];

        // Start a transaction
        db.beginTransaction((err) => {
            if (err) {
                return res.status(500).json({ error: err, message: "Failed to start transaction." });
            }

            // Execute the update on zzz_account
            db.query(updateAccountQuery, accountParams, (err, data) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json({ error: err, message: "Failed to update account details." });
                    });
                }

                if (data.affectedRows === 0) {
                    // If no rows were affected, it means no matching account was found
                    return db.rollback(() => {
                        res.status(404).json({ message: "No matching account found to update." });
                    });
                }

                // Since we are not updating zzz_loan fields, check if other related updates are needed
                if (req.body.loan_type === AccountTypes.STUDENT_LOAN) {
                    const updateStudentLoanQuery = `
                        UPDATE zzz_stud_ln
                        SET stud_id = ?, 
                            stud_type = ?, 
                            exp_grad_date = ?, 
                            univ_id = ?
                        WHERE acct_id = (
                            SELECT acct_id FROM zzz_account WHERE cust_id = ? AND acct_type = ?
                        );
                    `;

                    const studentLoanParams = [
                        req.body.stud_id,
                        req.body.stud_type,
                        req.body.exp_grad_date,
                        req.body.univ_id,
                        userInfo.cust_id,
                        AccountTypes.LOAN
                    ];

                    db.query(updateStudentLoanQuery, studentLoanParams, (err, data) => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).json({ error: err, message: "Failed to update student loan details." });
                            });
                        }

                        if (data.affectedRows === 0) {
                            // If no rows were affected, it means no matching account was found
                            return db.rollback(() => {
                                res.status(404).json({ message: "No matching account found to update." });
                            });
                        }

                        // Commit transaction
                        db.commit((err) => {
                            if (err) {
                                return db.rollback(() => {
                                    res.status(500).json({ error: err, message: "Failed to commit the updates." });
                                });
                            }
                            res.status(200).json({ message: "Student loan account updated successfully." });
                        });
                    });
                } else if (req.body.loan_type === AccountTypes.HOME_LOAN) {
                    const updateHomeLoanQuery = `
                        UPDATE zzz_home_ln
                        SET built_year = ?, 
                            home_ins_acc_no = ?, 
                            ins_premium = ?, 
                            ic_id = ?
                        WHERE acct_id = (SELECT acct_id FROM zzz_account WHERE cust_id = ? AND acct_type = ?)
                    `;

                    const homeLoanParams = [
                        req.body.built_year,
                        req.body.home_ins_acc_no,
                        req.body.ins_premium,
                        req.body.ic_id,
                        userInfo.cust_id,
                        AccountTypes.LOAN
                    ];

                    db.query(updateHomeLoanQuery, homeLoanParams, (err, data) => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).json({ error: err, message: "Failed to update home loan details." });
                            });
                        }

                        if (data.affectedRows === 0) {
                            // If no rows were affected, it means no matching account was found
                            return db.rollback(() => {
                                res.status(404).json({ message: "No matching account found to update." });
                            });
                        }

                        // Commit transaction
                        db.commit((err) => {
                            if (err) {
                                return db.rollback(() => {
                                    res.status(500).json({ error: err, message: "Failed to commit the updates." });
                                });
                            }
                            res.status(200).json({ message: "Home loan account updated successfully." });
                        });
                    });
                } else {
                    // No further updates needed, commit transaction
                    db.commit((err) => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).json({ error: err, message: "Failed to commit the updates." });
                            });
                        }
                        res.status(200).json({ message: "Loan account updated successfully, no core loan details changed." });
                    });
                }
            });
        });
    });
};


export const deleteLoanAccount = (req, res) => {
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");
        const deleteStudentLoanQuery = `
            DELETE FROM zzz_stud_ln WHERE acct_id = (SELECT acct_id FROM zzz_account WHERE cust_id = ? AND acct_type = ?);
        `;

        const deleteHomeLoanQuery = `
            DELETE FROM zzz_home_ln WHERE acct_id = (SELECT acct_id FROM zzz_account WHERE cust_id = ? AND acct_type = ?);
        `;

        const deleteLoanQuery = `
            DELETE FROM zzz_loan WHERE acct_id = (SELECT acct_id FROM zzz_account WHERE cust_id = ? AND acct_type = ?);
        `;

        const deleteAccountQuery = `
            DELETE FROM zzz_account WHERE cust_id = ? AND acct_type = ?;
        `;

        const params = [
            userInfo.cust_id,
            AccountTypes.LOAN
        ];

        // Start a transaction
        db.beginTransaction((err) => {
            if (err) {
                return res.status(500).json({ error: err, message: "Failed to start transaction for deleting loan account." });
            }

            if (req.body.loan_type === AccountTypes.STUDENT_LOAN) {
                // Execute the deletion query for specific loan details
                db.query(deleteStudentLoanQuery, params, (err, data) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({ error: err, message: "Failed to delete student loan details." });
                        });
                    }

                    if (data.affectedRows === 0) {
                        // If no rows were affected, it means no matching account was found
                        return db.rollback(() => {
                            res.status(404).json({ message: "No matching student loan account found." });
                        });
                    }

                    db.query(deleteLoanQuery, params, (err) => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).json({ error: err, message: "Failed to delete loan details." });
                            });
                        }

                        db.query(deleteAccountQuery, params, (err) => {
                            if (err) {
                                return db.rollback(() => {
                                    res.status(500).json({ error: err, message: "Failed to delete the main account." });
                                });
                            }

                            // Commit the transaction if all deletions succeed
                            db.commit((err) => {
                                if (err) {
                                    return db.rollback(() => {
                                        res.status(500).json({ error: err, message: "Failed to commit the deletions." });
                                    });
                                }
                                res.status(200).json({ message: "Student loan account and all related details successfully deleted." });
                            });
                        });
                    });
                });
            } else if (req.body.loan_type === AccountTypes.HOME_LOAN) {
                // Execute the deletion query for specific loan details
                db.query(deleteHomeLoanQuery, params, (err, data) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({ error: err, message: "Failed to delete home loan details." });
                        });
                    }

                    if (data.affectedRows === 0) {
                        // If no rows were affected, it means no matching account was found
                        return db.rollback(() => {
                            res.status(404).json({ message: "No matching home loan account found." });
                        });
                    }

                    db.query(deleteLoanQuery, params, (err) => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).json({ error: err, message: "Failed to delete loan details." });
                            });
                        }

                        db.query(deleteAccountQuery, params, (err) => {
                            if (err) {
                                return db.rollback(() => {
                                    res.status(500).json({ error: err, message: "Failed to delete the main account." });
                                });
                            }

                            // Commit the transaction if all deletions succeed
                            db.commit((err) => {
                                if (err) {
                                    return db.rollback(() => {
                                        res.status(500).json({ error: err, message: "Failed to commit the deletions." });
                                    });
                                }
                                res.status(200).json({ message: "Home loan account and all related details successfully deleted." });
                            });
                        });
                    });
                });
            } else {
                db.query(deleteLoanQuery, params, (err, data) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({ error: err, message: "Failed to delete loan details." });
                        });
                    }

                    if (data.affectedRows === 0) {
                        // If no rows were affected, it means no matching account was found
                        return db.rollback(() => {
                            res.status(404).json({ message: "No matching home loan account found." });
                        });
                    }

                    db.query(deleteAccountQuery, params, (err) => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).json({ error: err, message: "Failed to delete the main account." });
                            });
                        }

                        // Commit the transaction if all deletions succeed
                        db.commit((err) => {
                            if (err) {
                                return db.rollback(() => {
                                    res.status(500).json({ error: err, message: "Failed to commit the deletions." });
                                });
                            }
                            res.status(200).json({ message: "Other loan account and all related details successfully deleted." });
                        });
                    });
                });
            }
        });
    });
};

