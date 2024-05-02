import { DataTypes } from "sequelize";
import { sequelize } from "../connect.js";

const StudentLoan = sequelize.define(
  "StudentLoan",
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
    stud_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "Unique Student ID",
    },
    stud_type: {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment: "Student type",
    },
    exp_grad_date: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "Expected graduation date",
    },
    univ_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "zzz_stud_ln",
    timestamps: false,
  }
);

export default StudentLoan;
