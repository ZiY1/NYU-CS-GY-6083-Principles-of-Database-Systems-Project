import { DataTypes } from "sequelize";
import { sequelize } from "../connect.js";

const Checking = sequelize.define(
  "Checking",
  {
    acct_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      comment: "Unique account ID",
    },
    acct_type: {
      type: DataTypes.STRING(1),
      allowNull: false,
      comment: "Unique account type",
    },
    service_charge: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: false,
      comment: "Monthly account maintenance fees in US dollars",
    },
  },
  {
    tableName: "zzz_checking",
    timestamps: false,
  }
);

export default Checking;
