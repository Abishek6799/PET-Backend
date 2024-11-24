import mongoose from "mongoose";


const applicationSchema = new mongoose.Schema({
    Pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pet",
        required: true
    },
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    
    Shelter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shelter",
        required: true
    },
    petName: {
        type: String,
    },
    shelterName: {
        type: String,
    },
    adopterName: {
        type: String,
        required: true
    },
    adopterEmail: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    petImage: {
        type: String,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    message: {
        type: String,
    },
    dateApplied: {
        type: Date,
        default: Date.now
    }
});

const Application = mongoose.model("Application", applicationSchema);
export default Application;


    