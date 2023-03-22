const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../models');
const { Users, Workouts, WorkoutExercises } = require('../models');
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middleware/authMiddleware');



router.get("/profile", validateToken, async(req,res)=>{
    const id = req.user.id;
    const totalExercises = await WorkoutExercises.findAll({where:{
        userId: id
    }});
    const completedWorkouts = await Workouts.findAll({where: {
        username : req.user.username,
        status: 1 
    }});
    const user = await Users.findAll({where: {
        id : id
    }});

    if(user) {
        res.json({user:user,completedWorkouts:completedWorkouts.length,totalExercises:totalExercises.length});
    }

});

//Add user to db
router.post('/register', async (req, res) => {
    const {username, password} = req.body;
    const dupUser =  await Users.findOne({ where : { username: username }})
    if(dupUser){
        console.log(dupUser);
        return res.json("0");
    }
    bcrypt.hash(password, 10).then((hash) =>{
        Users.create({
            username : username,
            password : hash, 
        });
        return res.json("1");
    });
});
router.post('/login', async (req, res)=> {
    const { username, password } = req.body;
    const user = await Users.findOne({where:{username: username}});

    //Check if user exists in the db.
    if(!user) return res.json({error: "User does not exist."});

    //Check the user password
    bcrypt.compare(password, user.password).then((match)=>{
        if(!match) res.json({error:"Invalid username or password."});

        else {
            const accessToken = sign({username: user.username, id: user.id}, "importantsecret");
            res.json(accessToken);
        }
        
    })
})
router.get('/auth',validateToken,(req,res)=>{
    res.json(req.user)
})

module.exports = router;