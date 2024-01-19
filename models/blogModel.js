//!mdg to generate sample model 
const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    numViews:{
        type: Number,
        default: 0
    },
    IsLiked:{
        Type: Boolean,
        default: false
    },
    IsDisliked: {
        type: Boolean,
        default: false
    },
    likes: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    dislikes: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    image: {
        type: String,
        default: "https://images.unsplash.com/photo-1698619952010-3bc850cbcb3b?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    author: {
        type: String,
        default: "Admin"
    }        
    
},{
    toJSON: { virtuals: true},
    toObject: {
        virtuals: true,
    },
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);