import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    petname: {
        type: String,
        required: false
    },
    age: {
        type: String,
        required: true
    },
    breed: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    gender: {
        type: String,
        required: false,
        enum: ['Male', 'Female','Unknown']
    },
    medicalHistory: {
        type: String,
        required: false
    },
    image:{
        type: String,
        required: false
    },
    video: {
        type: [String],
        required: false
    },
    shelter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shelter',
        required: true
    },
    adopter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        
    },
    foster: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Foster'
    },
    status: {
        type: String,
        enum: ['available', 'adopted', 'fostered'],
        default: 'available',
        required: true
    }
});

const Pet = mongoose.model('Pet', petSchema);
export default Pet; 
