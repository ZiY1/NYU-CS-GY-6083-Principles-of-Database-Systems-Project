import mysql from "mysql2";

export const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "your_new_password",
    database: "SAFE_DATABASE",
    port: "33061"
});


