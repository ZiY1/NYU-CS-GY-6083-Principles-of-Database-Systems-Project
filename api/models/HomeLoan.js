import { DataTypes } from "sequelize";
import { sequelize } from "../connect.js";

const HomeLoan = sequelize.define(
  "HomeLoan",
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
    built_year: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      comment: "House built year",
    },
    home_ins_acc_no: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "Home insurance account number",
    },
    ins_premium: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: false,
      comment: "Annually fees to maintain an insurance policy",
    },
    ic_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "zzz_home_ln",
    timestamps: false,
  }
);

export default HomeLoan;
