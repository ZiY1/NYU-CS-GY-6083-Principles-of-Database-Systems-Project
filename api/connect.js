import mysql from "mysql2";

export const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Hzy3309521.12#",
    database: "SAFE_DATABASE"
});


