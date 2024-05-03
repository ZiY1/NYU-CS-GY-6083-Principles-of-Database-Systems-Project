import { DataTypes } from 'sequelize';
import { sequelize } from '../connect.js';

const Customer = sequelize.define('Customer', {
    cust_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cust_fname: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    cust_lname: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    cust_state: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    cust_city: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    cust_street: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    cust_zipcode: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    user_name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'zzz_customer',
    timestamps: false
});

export default Customer;
