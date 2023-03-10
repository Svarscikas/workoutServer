'use strict';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const WorkoutExercises = require('./WorkoutExercises');
const Users = require('./Users')
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}


fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

//db.Exercises.hasMany(db.Workouts);
//db.Workouts.hasMany(db.Exercises);
/* db.Workouts.belongsToMany(db.Exercises, {
  through: 'WorkoutExercises',
  unique: false,
  });
db.Exercises.belongsToMany(db.Workouts, { 
  through: 'WorkoutExercises',
  unique: false,
}); */



//dummy data
//addData(1,1);
//addData(1,1);
async function addData(exerciseId, workoutId){
  //const testExercise = await sequelize.models.Exercises.findByPk(exerciseId)
  //const testWorkout = await sequelize.models.Workouts.findByPk(workoutId)
  await db.WorkoutExercises.create({exerciseId: exerciseId, workoutId: workoutId});
}
  
module.exports = db;

