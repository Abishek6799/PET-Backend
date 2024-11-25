import mongoose from "mongoose";


const fosterSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    shelter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shelter",
       
    },
    name:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    availability: {
        type: String,
        required: false,
        default: "available"
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    description:{
        type: String,
       
    },
    endDate: {
        type: Date,
        required: false
    },
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pet",
        
    },
    note: {
        type: String,
        required: false
    },
    status: {
      type: String,
      enum: ["active", "completed", "inactive","pending","rejected"],
      default: "pending"  
    },
    role:{
        type: String,
        enum: ["foster"],
        default: "foster"
    },
    token: {
        type: String,
        required: false
    }
});

const Foster = mongoose.model("Foster", fosterSchema);
export default Foster;

