import mysql from "mysql2";

export const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    //password: "Hzy3309521.12#",
    database: "SAFE_DATABASE"
});

// test db connection
db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      return;
    }
    console.log('Connected to MySQL database');
    
});
