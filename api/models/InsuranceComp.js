import { DataTypes } from "sequelize";
import { sequelize } from "../connect.js";

const InsuranceCompany = sequelize.define(
  "InsuranceCompany",
  {
    ic_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "Unique insurance company ID",
    },
    ic_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "Insurance company name",
    },
    ic_state: {
      type: DataTypes.STRING(30),
      allowNull: false,
      comment: "Insurance company state",
    },
    ic_city: {
      type: DataTypes.STRING(30),
      allowNull: false,
      comment: "Insurance company city",
    },
    ic_street: {
      type: DataTypes.STRING(30),
      allowNull: false,
      comment: "Insurance company street",
    },
    ic_zipcode: {
      type: DataTypes.STRING(30),
      allowNull: false,
      comment: "Insurance company zip code",
    },
  },
  {
    tableName: "zzz_insur_co",
    timestamps: false,
  }
);

export default InsuranceCompany;
