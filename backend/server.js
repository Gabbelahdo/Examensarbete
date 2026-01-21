const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoutes = require('./routes/auth');
const articlesRoutes = require('./routes/articles');
const signupRoutes = require('./routes/signup');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/articles', articlesRoutes);
app.use('/signup', signupRoutes);

app.get('/', (req, res) => {
    res.send('PT Thaiboxing API körs!');
});

const Port = process.env.Port || 5000;
app.listen(Port, () => console.log(`Server running on port ${PORT}`));