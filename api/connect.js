import mysql from "mysql2";
import { Sequelize } from "sequelize";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Hzy3309521.12#",
  database: "SAFE_DATABASE",
  port: "3306",
});

// ORM for AdminJS
export const sequelize = new Sequelize(
  "SAFE_DATABASE",
  "root",
  "Hzy3309521.12#",
  {
    host: "localhost",
    dialect: "mysql",
    port: 3306,
    dialectModule: mysql,
  }
);