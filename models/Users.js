'use strict'
module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isAdmin:{
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        age: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        weight: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        height: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        }

    });
    return Users;
};