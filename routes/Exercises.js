const express = require("express");
const router = express.Router();
const { Exercises, PersonalBests, Users, sequelize } = require("../models");
const { validateToken } = require("../middleware/authMiddleware");

router.get("/personalbests", async (req, res) => {
  try {
    const bestLifts = await sequelize.query(
      "SELECT users.username, Exercises.title as exercise, personalBests.personalBest as weight FROM personalBests JOIN ( SELECT exerciseId, MAX(personalbests.personalBest) AS maxWeight FROM personalBests GROUP BY exerciseId) AS pb_max ON personalBests.exerciseId = pb_max.exerciseId AND personalBests.personalbest = pb_max.maxWeight JOIN users ON personalBests.userId = users.Id JOIN exercises ON personalBests.exerciseId = exercises.Id",
      { type: sequelize.QueryTypes.SELECT }
    );
    // Rest of the code
  } catch (error) {
    console.error(error);
  }

  if (bestLifts) {
    res.json(bestLifts);
  } else {
    res.json("Failed to get info");
  }
});

router.get("/", validateToken, async (req, res) => {
  const id = req.user.id;
  let exerciseList = await Exercises.findAll({
    raw: true,
  });
  for (let i = 0; i < exerciseList.length; i++) {
    const pb = await PersonalBests.findOne({
      where: {
        exerciseId: exerciseList[i].id,
        userId: id,
      },
    });
    if (pb) {
      exerciseList[i]["personalBest"] = pb.personalBest;
    } else {
      exerciseList[i]["personalBest"] = "No data provided";
    }
  }
  const user = await Users.findAll({
    where: {
      id: id,
    },
  });
  res.json({ exerciseList: exerciseList, user: user[0].isAdmin });
});

router.get("/byId/:id", async (req, res) => {
  const id = req.params.id;
  const exercise = await Exercises.findByPk(id);
  res.json(exercise);
});

router.post("/", async (req, res) => {
  const exercise = req.body;
  const dupe = await Exercises.findOne({ where: { title: req.body.title } });
  if (!dupe) {
    await Exercises.create(exercise);
    res.json(exercise);
  } else {
    res.send("Duplicate");
  }
});

module.exports = router;
