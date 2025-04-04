const express = require('express');  
const mongoose = require('mongoose');  
const bodyParser = require('body-parser');  
const path = require('path');
// Fix the path to the feedback model - make sure it matches your file structure
const Feedback = require('./total/feedback');  

const app = express();  
const PORT = 7400;  

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/coderone_feedback')  
    .then(() => console.log('MongoDB connected successfully'))  
    .catch(err => console.error('MongoDB connection error:', err));   

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));  
// Make sure this line is in your server.js file
app.use(express.static(path.join(__dirname, 'total')));

// Set view engine to handle HTML files
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'total'));

// Home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'total', 'index.html'));
});

// Feedback submission route
app.post('/submit-feedback', async (req, res) => {  
    console.log('Received feedback:', req.body);  
     
    if (!req.body.message) {  
        return res.status(400).json({
            success: false,
            message: 'Message is required'
        });   
    }  

    try {
        const feedback = new Feedback({  
            name: req.body.name || 'Anonymous',  
            email: req.body.email,
            category: req.body.category,
            message: req.body.message,
            rating: parseInt(req.body.rating)
        });  

        await feedback.save();
        
        // If it's an AJAX request, return JSON
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.status(201).json({
                success: true,
                message: 'Feedback submitted successfully',
                data: feedback
            });
        }
        
        // Otherwise redirect to a thank you page
        res.redirect('/thank-you.html');
    } catch (err) {  
        console.error('Error saving feedback:', err);
        
        // If it's an AJAX request, return JSON error
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.status(500).json({
                success: false,
                message: 'There was an error saving your feedback.',
                error: err.message
            });
        }
        
        res.status(500).send('There was an error saving your feedback.');  
    }
});

// API route to get all feedback
app.get('/api/feedback', async (req, res) => {
    try {
        const feedbackList = await Feedback.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: feedbackList.length,
            data: feedbackList
        });
    } catch (err) {
        console.error('Error fetching feedback:', err);
        res.status(500).json({
            success: false,
            message: 'Error fetching feedback',
            error: err.message
        });
    }
});

// Create a simple thank you page route
app.get('/thank-you.html', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Thank You</title>
            <link rel="stylesheet" href="/css/styles.css">
            <style>
                .thank-you {
                    text-align: center;
                    padding: 50px 20px;
                    max-width: 600px;
                    margin: 0 auto;
                }
                .thank-you h1 {
                    color: #4a6fa5;
                    margin-bottom: 20px;
                }
                .thank-you p {
                    margin-bottom: 30px;
                }
            </style>
        </head>
        <body>
            <div class="thank-you">
                <h1>Thank You!</h1>
                <p>Your feedback has been submitted successfully. We appreciate your input!</p>
                <a href="/" class="btn">Return Home</a>
            </div>
        </body>
        </html>
    `);
});

// Start the server
app.listen(PORT, () => {  
    console.log(`Server is running on http://localhost:${PORT}`);  
});
