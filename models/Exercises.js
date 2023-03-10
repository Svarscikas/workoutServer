module.exports = (sequelize, DataTypes) => {
    const Exercises = sequelize.define("Exercises", {
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
        maxWeight: {
            type: DataTypes.DOUBLE,
            defaultValue: 0,
        },
    },
    {timestamps: false}
    );
    
    return Exercises;
};