const express = require('express');
const router = express.Router();
const { Exercises, PersonalBests } = require('../models');

router.get("/", async (req,res)=>{
    let exerciseList = await Exercises.findAll(
        {
            raw: true,
        }
    );
    for(let i = 0; i < exerciseList.length; i++){
        const pb = await PersonalBests.findOne({
            where : {
                exerciseId : exerciseList[i].id
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