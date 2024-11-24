import mongoose from "mongoose";


const appointmentSchema = new mongoose.Schema({
    adopter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    shelter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shelter",
        required: true
    },
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pet",
        required: true
    },
    PetName: {
        type: String,
    },
    ShelterName: {
        type: String,
    },
    PetImage: {
        type: String,
    },
    appointmentDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    message: {
        type: String,
    }
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;