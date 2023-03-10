'use strict'
module.exports = (sequelize, DataTypes) => {
    const WorkoutExercises = sequelize.define("WorkoutExercises", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            unique: true,
        },
        workoutId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Workouts',
                key: 'id'
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        exerciseId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Exercises',
                key: 'id'
            }
        },
        repetitions: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        weight: {
            type: DataTypes.DOUBLE,
            defaultValue: 0,
        },
    });
    return WorkoutExercises;
};