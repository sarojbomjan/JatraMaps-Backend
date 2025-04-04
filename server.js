const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { userRouter } = require("./routes/userRoutes");
const { eventRouter } = require("./routes/eventsRoutes");

dotenv.config();
console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY); 
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// mount user routes
app.use("/users", userRouter);
app.use("/events", eventRouter);
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Test route
app.get('/api/test', (req, res) => {
    try {
        res.status(200).json({message: "JatraMaps is your ultimate guide to discovering and experiencing the vibrant Jatras of Nepal."});
    } catch(error) {
        res.status(400).json({message: "Error Occured: Please refresh"});
    }
});

// database connection and server start
app.listen(process.env.port, async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL).then(() => 
        console.log(`Connected to Database`)
        ); 
        console.log(`Connected to Port ${process.env.port}`);
    } catch(error) {
        console.log(`error: ${error}`);
    }
});