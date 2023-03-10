'use strict'
module.exports = (sequelize, DataTypes) => {
    const Workouts = sequelize.define("Workouts", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            unique: true,
        },
        title: {
            type: DataTypes.STRING,
            allownull: false,
        },
        description: {
            type: DataTypes.STRING,
            allownull: false,
        },
        status:{
            type: DataTypes.BOOLEAN,
            allowNull:false,
        },
        username:{
            type: DataTypes.STRING,
            allowNull:false,
        },
    });
    return Workouts;
};