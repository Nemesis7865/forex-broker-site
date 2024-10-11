const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose')

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/forexBroker', { useNewParser: true, useUnifiedTopology: true })
.then(() => console.log('mongoDB connected'))
.catch(err => console.error('mongoDB connection error', err))


//User schema and model
const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
})

const User = mongoose.model('User', userSchema)

//Serve the registration page
app.get('register', async (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
})

//Handle registration form submission
app.post('/register', async (req, res) => {
    const {username, password} = req.body;
    const newUser = new User({username, password})

    try {
        await newUser.save();
        res.send(`Registration Successful or user: ${username}`);
    } catch (error) {
        if (error.code === 11000) {
            res.send('Username already exists.')
        } else {
            res.status(500).send('Error registering user.');
        }
    } 
})



// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Serve the registration page
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

// Handle registration form submission
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    // Here you would typically handle the registration logic, like saving the user to a database
    console.log(`Username: ${username}, Password: ${password}`);
    res.send(`Registration successful for user: ${username}`);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
