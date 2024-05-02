import { DataTypes } from "sequelize";
import { sequelize } from "../connect.js";

const Loan = sequelize.define(
  "Loan",
  {
    acct_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "Unique account ID",
    },
    acct_type: {
      type: DataTypes.STRING(1),
      allowNull: false,
      comment: "Unique account type",
    },
    loan_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      comment: "Monthly loan rate in percentage",
    },
    loan_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      comment: "Total amount of the loan in US dollars",
    },
    loan_month: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      comment: "Term of the loan in months",
    },
    loan_payment: {
      type: DataTypes.DECIMAL(7, 2),
      allowNull: false,
      comment: "Monthly loan back payment, e.g., $600.87",
    },
    loan_type: {
      type: DataTypes.STRING(1),
      allowNull: false,
      comment: "Type of the loan",
    },
  },
  {
    tableName: "zzz_loan",
    timestamps: false,
  }
);

export default Loan;
