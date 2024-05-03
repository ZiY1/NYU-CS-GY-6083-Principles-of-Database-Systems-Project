import { DataTypes } from "sequelize";
import { sequelize } from "../connect.js";

const Account = sequelize.define(
  "Account",
  {
    acct_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    acct_type: {
      type: DataTypes.CHAR(1),
      allowNull: false,
    },
    acct_no: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },
    acct_name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    acct_date_opened: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    acct_bill_state: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    acct_bill_city: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    acct_bill_street: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    acct_bill_zipcode: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    cust_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "zzz_account",  
        key: "cust_id",
      },
    },
  },
  {
    tableName: "zzz_account",
    timestamps: false,
  }
);

export default Account;
