const mongoose = require('mongoose');  

// Updated schema to match our form fields
const feedbackSchema = new mongoose.Schema({  
    name: { 
        type: String, 
        required: true 
    },  
    email: { 
        type: String, 
        required: true, 
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
    },
    category: {
        type: String,
        required: true,
        enum: ['suggestion', 'complaint', 'question', 'praise']
    },
    message: { 
        type: String, 
        required: true 
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});  

// Add a method to format the feedback data for display
feedbackSchema.methods.format = function() {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        category: this.category,
        message: this.message,
        rating: this.rating,
        createdAt: this.createdAt
    };
};

// Static method to find feedback by category
feedbackSchema.statics.findByCategory = function(category) {
    return this.find({ category: category });
};

// Static method to find feedback by minimum rating
feedbackSchema.statics.findByMinRating = function(rating) {
    return this.find({ rating: { $gte: rating } });
};

// Create the model
const Feedback = mongoose.model('feedback', feedbackSchema);  

module.exports = Feedback;