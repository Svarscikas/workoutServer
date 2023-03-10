'use strict'
module.exports = (sequelize, DataTypes) => {
    const PersonalBests = sequelize.define("PersonalBests", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            unique: true,
        },
        exerciseId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Exercises',
                key: 'id'
            }
        },
        personalBest: {
            type: DataTypes.DOUBLE,
            defaultValue: 0,
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id'
            }
        }
    });
    return PersonalBests;
};