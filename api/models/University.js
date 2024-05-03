import { DataTypes } from "sequelize";
import { sequelize } from "../connect.js";

const University = sequelize.define(
  "University",
  {
    univ_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      comment: "Unique university ID",
      autoIncrement: true,
    },
    univ_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "University Name",
    },
  },
  {
    tableName: "zzz_univ",
    timestamps: false,
  }
);

export default University;
