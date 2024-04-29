import mysql from "mysql2";
import { Sequelize } from "sequelize";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "your_new_password",
  database: "SAFE_DATABASE",
  port: "33061",
});

// ORM for AdminJS
export const sequelize = new Sequelize(
  "SAFE_DATABASE",
  "root",
  "your_new_password",
  {
    host: "localhost",
    dialect: "mysql",
    port: 33061,
    dialectModule: mysql,
  }
);
