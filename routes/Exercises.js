const express = require('express');
const router = express.Router();
const { Exercises, PersonalBests, sequelize } = require('../models');
const { validateToken } = require('../middleware/authMiddleware');


router.get("/personalbests", async (req, res)=>{
    const bestLifts = await sequelize.query('SELECT users.username, exercises.title as exercise, personalBests.personalBest as weight FROM personalBests JOIN ( SELECT exerciseId, MAX(personalbests.personalBest) AS maxWeight FROM personalBests GROUP BY exerciseId) AS pb_max ON personalBests.exerciseId = pb_max.exerciseId AND personalBests.personalbest = pb_max.maxWeight JOIN users ON personalBests.userId = users.Id JOIN exercises ON personalBests.exerciseId = exercises.Id',
    {type: sequelize.QueryTypes.SELECT});
    if(bestLifts) {
        res.json(bestLifts);
    }
    else {
        res.json("Failed to get info");
    }
});


router.get("/", validateToken ,async (req,res)=>{
    const user = req.user.id;
    let exerciseList = await Exercises.findAll(
        {
            raw: true,
        }
    );
    for(let i = 0; i < exerciseList.length; i++){
        const pb = await PersonalBests.findOne({
            where : {
                exerciseId : exerciseList[i].id,
                userId: user
            }
        });
        if(pb){
            exerciseList[i]["personalBest"] = pb.personalBest;
        }
        else{
            exerciseList[i]["personalBest"] = "No data provided";
        }
    }
    res.json(exerciseList);
});

router.get("/byId/:id", async(req,res)=>{
    const id = req.params.id;
    const exercise = await Exercises.findByPk(id);
    res.json(exercise);
});

router.post("/", async (req, res)=>{
    const exercise = req.body;
    const dupe = await Exercises.findOne({where:{title: req.body.title }})
    if(!dupe){
        await Exercises.create(exercise);
        res.json(exercise);
    }
    else{
        res.send('Duplicate');
    }
});


module.exports = router;