import { DataTypes } from "sequelize";
import { sequelize } from "../connect.js";

const Admin = sequelize.define(
  "Admin",
  {
    admin_name: {
      type: DataTypes.STRING(30),
      allowNull: false,
      primaryKey: true,
      comment: "Unique admin name for authentication",
    },
    admin_password: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "Admin password for authentication",
    },
  },
  {
    tableName: "zzz_admin",
    timestamps: false,
  }
);

export default Admin;
