import mongoose from "mongoose";

const shelterSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    phoneNumber:{
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    description:{
        type: String,
    },
    pets:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pet"
    }],
    applications:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application"
    }],
    reviews:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }],
    role: {
        type: String,
        enum: ['shelter'],
        default: 'shelter'
    },
    token: {
        type: String,
        required: false
    }
});

const Shelter = mongoose.model('Shelter', shelterSchema);
export default Shelter;