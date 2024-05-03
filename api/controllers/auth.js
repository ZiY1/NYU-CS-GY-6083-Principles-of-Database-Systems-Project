import { db } from '../connect.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Registers a new user by inserting authentication credentials into the zzz_cust_auth table
 * and customer information into the zzz_customer table within a transaction.
 * 
 * This ensures atomicity of the user registration process: both insertions either succeed together
 * or fail together without leaving the database in an inconsistent state.
 *
 * @param {Object} req - The request object from Express.js containing the user's input (username, password, and customer details).
 * @param {Object} res - The response object from Express.js used to send back the HTTP response.
 * 
 * Steps:
 * 1. Begins a database transaction.
 * 2. Inserts user authentication credentials into the zzz_cust_auth table.
 * 3. If the username already exists, rolls back the transaction and returns a 409 Conflict status.
 * 4. Inserts customer information into the zzz_customer table.
 * 5. If any database operations fail, rolls back the transaction and returns a 500 Internal Server Error status.
 * 6. If all operations succeed, commits the transaction and returns a 200 OK status with a success message.
 * 
 * Note:
 * - The function uses bcrypt for password hashing to securely store user passwords.
 * - It utilizes transactions managed by the `db` object (assumed to be a MySQL database connection).
 * - Error handling is done through early returns sending specific HTTP status codes and messages.
 */
export const register = (req, res) => {
    // Check if the user already exists by querying the zzz_cust_auth table with the provided username.
    // The query uses a placeholder (?) for the username to prevent SQL injection attacks.
    // [req.body.username]: This array of parameters will be safely injected into the query string where the placeholder (?) is located.
    // This technique of using placeholders and parameterized queries helps in preventing SQL injection attacks by automatically escaping the input values,
    // ensuring that any malicious input is neutralized before being executed as part of the SQL query.
    const checkUserQuery = "SELECT * FROM zzz_cust_auth WHERE user_name = ?";

    // Execute the query to check for existing username.
    db.query(checkUserQuery, [req.body.username], (err, data) => {
        // If an error occurs during the query, respond with a 500 Internal Server Error.
        if (err) return res.status(500).json(err);

        // If the username already exists (data.length > 0), respond with a 409 Conflict status.
        if (data.length) return res.status(409).json("Username already exists!");

        // Hash the user's password using bcrypt for secure storage.
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        // Begin a database transaction to ensure atomicity of the user registration process.
        db.beginTransaction((err) => {
            if (err) return res.status(500).json(err);

            // Define the query to insert authentication credentials into the zzz_cust_auth table.
            const insertAuthQuery = "INSERT INTO zzz_cust_auth (user_name, user_password) VALUES (?, ?)";

            // Execute the query to insert the new user's authentication credentials.
            // Using parameterized queries here again prevents SQL injection attacks.
            db.query(insertAuthQuery, [req.body.username, hashedPassword], (err, data) => {
                // If an error occurs, rollback the transaction and respond with a 500 Internal Server Error.
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json(err);
                    });
                }

                // Define the query to insert customer information into the zzz_customer table.
                // As before, using parameterized queries prevents SQL injection attacks by ensuring safe query execution.
                const insertCustomerQuery = `
                    INSERT INTO zzz_customer (
                        cust_fname, cust_lname, cust_state, cust_city, cust_street, cust_zipcode, user_name
                    ) VALUES (?, ?, ?, ?, ?, ?, ?)
                `;

                // Execute the query to insert the new customer's information.
                db.query(insertCustomerQuery, [
                    req.body.firstName, req.body.lastName, req.body.state, req.body.city, req.body.street, req.body.zipCode, req.body.username
                ], (err, data) => {
                    // If an error occurs, rollback the transaction and respond with a 500 Internal Server Error.
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

                        // Respond with a 200 OK status and a success message if the user is successfully created.
                        res.status(200).json("User has been created.");
                    });
                });
            });
        });
    });
};


/**
 * Executes a SQL query to fetch a user's authentication credentials and customer ID.
 *
 * This query performs an inner join between the 'zzz_cust_auth' and 'zzz_customer' tables
 * to ensure that both authentication credentials and customer information are linked 
 * by the username. It is specifically designed to support the login process by retrieving
 * necessary user information for authentication and session management.
 *
 * The query uses parameterized input for the username to prevent SQL injection attacks,
 * ensuring the application's security when executing SQL commands.
 *
 * Parameters:
 * - req.body.username: The username provided by the client in the HTTP request body. This
 *   username is used to filter the database search, ensuring that only the records
 *   matching the provided username are selected.
 *
 * Expected Results:
 * - user_name: The username from the 'zzz_cust_auth' table, confirming the user's identity.
 * - user_password: The hashed password stored in the 'zzz_cust_auth' table, used for
 *   verifying the user's password during the login process.
 * - cust_id: The unique customer ID from the 'zzz_customer' table, which can be used
 *   for identifying user-related records throughout the application.
 *
 * The query returns these details as part of the login function to facilitate user 
 * authentication and session initialization by generating a JWT token based on the
 * customer ID.
 *
 * Usage:
 * The query is executed within the login function's database query call. The function
 * expects a successful match to proceed with password verification and token generation.
 * If no match is found, or if the password verification fails, the login process is
 * aborted, and an appropriate error response is returned to the client.
 */
export const login = (req, res) => {
    // Query to select the user's authentication credentials from the zzz_cust_auth table.
    const q = `
    SELECT 
        zca.user_name, 
        zca.user_password, 
        zc.cust_id 
    FROM 
        zzz_cust_auth AS zca 
    JOIN 
        zzz_customer AS zc ON zca.user_name = zc.user_name 
    WHERE 
        zca.user_name = ?
`;


    // Execute the query with the username provided in the request body.
    db.query(q, [req.body.username], (err, data) => {
        // If an error occurs, return a 500 Internal Server Error response.
        if (err) return res.status(500).json(err);

        // If no matching user is found, return a 404 Not Found response.
        if (data.length == 0) return res.status(404).json("User not found");

        // Check if the provided password matches the hashed password stored in the database.
        const checkPassword = bcrypt.compareSync(req.body.password, data[0].user_password);

        // If the password does not match, return a 400 Bad Request response.
        if (!checkPassword) return res.status(400).json("Wrong username or password");

        // Generate a JWT token using the customer ID as the payload.
        // Note: Replace "secretkey" with a secure, environment-specific key for production use.
        const token = jwt.sign({ cust_id: data[0].cust_id }, "secretkey");

        // Exclude the password from the response data for security reasons.
        const { user_password, ...others } = data[0];

        // Send the JWT token in a httpOnly cookie and return the other user data in the response body.
        res.cookie("accessToken", token, {
            httpOnly: true,
        }).status(200).json(others);
    });
};


/**
 * Handles the logout process by clearing the user's authentication token.
 *
 * This function clears the 'accessToken' cookie from the client's browser, effectively
 * ending the user's session. It sets the HTTP response to return a 200 OK status
 * and a JSON message indicating that the user has been successfully logged out.
 *
 * The function also sets specific flags on the cookie to enhance security:
 * - `secure`: When set to true, instructs the browser to only send the cookie over HTTPS.
 *   In a production environment with SSL/TLS, this should always be set to true to
 *   prevent the cookie from being transmitted over unencrypted connections.
 * - `sameSite`: Set to 'none' to allow the cookie to be sent in requests originating from
 *   third-party websites. This setting requires the `secure` flag to be true. If your
 *   application doesn't require cross-site requests, consider using 'strict' or 'lax'
 *   for additional protection against CSRF attacks.
 *
 * Note: The `secure` flag may need to be disabled in a development environment if HTTPS
 * is not enabled. Consider dynamically setting this based on the environment.
 *
 * Usage:
 * This function is meant to be used as an Express route handler, responding to a logout
 * request from the client. It assumes the presence of express-cookie middleware or
 * equivalent for managing cookies in Express applications.
 */
export const logout = (req, res) => {
    // Determine if the environment supports HTTPS. This might be replaced with a more
    // sophisticated check or a configuration setting in a real-world application.
    const secure = process.env.NODE_ENV === 'production';

    res.clearCookie("accessToken", {
        secure: secure, // Set based on the environment. Important for production.
        sameSite: secure ? "none" : "lax" // 'lax' is a reasonable default for development.
    }).status(200).json("User has been logged out.");
};
