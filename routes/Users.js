const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../models');
const { Users } = require('../models');
const {sign} = require('jsonwebtoken');



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

module.exports = router;