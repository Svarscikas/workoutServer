const express = require('express');
const db = require('../models');
const router = express.Router();
const { Workouts, Exercises, WorkoutExercises, sequelize, PersonalBests } = require('../models');
const {validateToken} = require("../middleware/authMiddleware");


router.get("/", validateToken, async (req,res)=>{
    let workoutList = await Workouts.findAll({
        order: [
            ['createdAt', 'DESC']
        ],
        where: {
            username: req.user.username,
        },
        raw: true
    });
    for(let i = 0; i < workoutList.length; i++) {
        const count = await WorkoutExercises.count({
            where: {
                workoutId : workoutList[i].id,
            }
        });
        workoutList[i].exerciseCount = count;
    }
    res.json(workoutList);
});

router.get("/byId/:id", async(req,res)=>{
    const id = req.params.id;
    const workout = await Workouts.findByPk(id);
    const exercises = await sequelize.query(`SELECT WorkoutExercises.id,WorkoutExercises.workoutId,workoutexercises.exerciseId,exercises.title,workoutexercises.weight, workoutexercises.repetitions from workoutexercises JOIN exercises on exercises.id =workoutexercises.exerciseId where projectdb.workoutexercises.workoutId = ${id}`,
    {type: sequelize.QueryTypes.SELECT}
    );
    //const exercises = await workout.getExercises();
    res.json({exercises:exercises,workout:workout});
});


//Delete workout from db
router.delete("/:id", validateToken, async(req, res)=> {
    const id = req.params.id;
    const user = req.user.id;
    const workExercises = await WorkoutExercises.findAll({
        where : {
            'workoutId': id,
        }
    });
    await WorkoutExercises.destroy({
        where : {
            'workoutId' : id,
        }
    })
    for(let i = 0; i < workExercises.length; i++){
        await deleteOrUpdatePersonalBest(user, workExercises[i].exerciseId);
    }
    const workout = await Workouts.destroy({
        where : {
            id : id,
        }
    });
    const workouts = await Workouts.findAll({
        order: [
            ['createdAt', 'DESC']
        ],
        where: {
            username : req.user.username,
        }
    });
    res.json(workouts);
})

router.put("/byId/:id", async (req,res)=>{
    const id = req.params.id;
    const workout = await Workouts.findByPk(id);
    if(workout) {
        workout.status = true;
    }
    await workout.save();
    res.json("Saved succesfully.");
})

//Post workout to db.
router.post("/", validateToken, async (req, res)=>{
    const workout = req.body;
    const user = req.user.username;
    workout.username = user;
    await Workouts.create(workout);
    const workoutList = await Workouts.findAll({
        order: [
            ['createdAt', 'DESC']
        ],
        where: {
            username : user,
        }
    });
    res.json(workoutList);
});
//Add exercise to a workout
router.post("/byId/:id" , validateToken, async(req,res)=>{
    const id = req.body.workoutId;
    const exercise = req.body;
    const weight = req.body.weight;
    const userId = req.user.id;
    let currentPb = await PersonalBests.findOne({
        where:{
            exerciseId : exercise.exercise,
            userId: userId,
        }
    });  
    if(!currentPb){
        currentPb = PersonalBests.create({exerciseId: exercise.exercise, userId: userId, personalBest: weight });
    }
    if(weight > currentPb.personalBest){
        currentPb.personalBest = weight;
        await currentPb.save();
    }
    await WorkoutExercises.create({userId: userId,exerciseId: req.body.exercise, workoutId: id, weight :req.body.weight, repetitions:req.body.repetitions})
    const exercises = await sequelize.query(`SELECT WorkoutExercises.id,WorkoutExercises.workoutId,workoutexercises.exerciseId,exercises.title,workoutexercises.weight, workoutexercises.repetitions from workoutexercises JOIN exercises on exercises.id =workoutexercises.exerciseId where projectdb.workoutexercises.workoutId = ${id} ORDER BY workoutexercises.createdAt ASC`,
    {type: sequelize.QueryTypes.SELECT}
    );
    res.json(exercises); 
})

//Finds user best lift in desired exercise
async function calculatePersonalBest(userId, exerciseId) {
    const Lifts = await WorkoutExercises.findAll({
        where: {
            userId: userId,
            exerciseId: exerciseId
        },
        order: [
            ['weight', 'DESC']
        ]
    });
    if(Lifts.length > 0){
        return Lifts[0].weight;
    }
    else{
        return 0;
    }
}

async function deleteOrUpdatePersonalBest(userId, exerciseId){
    const maxLift = await calculatePersonalBest(userId, exerciseId);
        let personalBest = await PersonalBests.findOne({
            where: {
                userId: userId,
                exerciseId: exerciseId
            }
        });
        if(personalBest){
            if(maxLift == 0){
                personalBest.destroy();
            }
            else{
                personalBest.personalBest = maxLift;
                personalBest.save();
            }
        }
}

//Delete exercise from a workout
router.delete("/byId/:id/:workoutId", validateToken, async (req, res)=>{
    const id = req.params.id;
    const user = req.user.id;
    const workoutId= req.params.workoutId;
    const exercise = await WorkoutExercises.findByPk(id);
    const exerciseId = exercise.exerciseId;
    const deletedExercise = await WorkoutExercises.destroy({
        where: { id: id}
    })
    if(deletedExercise){
        deleteOrUpdatePersonalBest(user,exerciseId);
        // const maxLift = await calculatePersonalBest(user, exerciseId);
        // let personalBest = await PersonalBests.findOne({
        //     where: {
        //         userId: user,
        //         exerciseId: exerciseId
        //     }
        // });
        // if(maxLift == 0){
        //     personalBest.destroy();
        // }
        // else{
        //     personalBest.personalBest = maxLift;
        //     personalBest.save();
        // }
        
        const exercises = await sequelize.query(`SELECT WorkoutExercises.id,WorkoutExercises.workoutId,workoutexercises.exerciseId,exercises.title,workoutexercises.weight, workoutexercises.repetitions from workoutexercises JOIN exercises on exercises.id =workoutexercises.exerciseId where projectdb.workoutexercises.workoutId = ${workoutId} ORDER BY workoutexercises.createdAt ASC`,
        {type: sequelize.QueryTypes.SELECT}
        );
        res.json(exercises);
    }
    else res.json("Cant find the exercise");
})

module.exports = router;