import { DataTypes } from "sequelize";
import { sequelize } from "../connect.js";

const CustAuth = sequelize.define(
  "CustAuth",
  {
    user_name: {
      type: DataTypes.STRING(30),
      allowNull: false,
      primaryKey: true,
      comment: "Unique user name for authentication",
    },
    user_password: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "User password for authentication",
    },
  },
  {
    tableName: "zzz_cust_auth",
    timestamps: false,
  }
);

export default CustAuth;
