const express = require('express');
const app = express();
const cors = require('cors');
var path = require('path');
app.use(express.json());
app.use(cors());

const db = require('./models');

//Port number for Backend server
const port = 3003;

app.use("/public", express.static(path.join(__dirname, 'public')));

//Routers
const exerciseRouter = require('./routes/Exercises');
app.use("/exercises", exerciseRouter);
const workoutRouter = require('./routes/Workouts');
app.use("/workouts", workoutRouter);
const userRouter = require('./routes/Users');
app.use("/users", userRouter);

db.sequelize.sync().then(()=> {
    app.listen(port,() => {
        console.log('Server running on PORT:'+ port);
    });
});



