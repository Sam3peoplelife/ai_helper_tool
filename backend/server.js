const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');

// connect to express app
const app = express();

// connect to MongoDB
const dbURI = process.env.MONGO_URI;
mongoose.connect(dbURI).then(() => {
    app.listen(3001, () => {
        console.log("server is connected and connected to MongoDB");
    });
}).catch((error) => {
    console.log("Unable to connect to server or MongoDB", error);
});

// middleware
app.use(bodyParser.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// routes
app.use('/', userRoutes);
