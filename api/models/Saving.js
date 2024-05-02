import { DataTypes } from "sequelize";
import { sequelize } from "../connect.js";
const Saving = sequelize.define(
  "Saving",
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
      primaryKey: true,
      comment: "Unique account type",
    },
    interest_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      comment: "Monthly interest rate in percentage",
    },
  },
  {
    tableName: "zzz_saving",
    timestamps: false,
  }
);

export default Saving;
