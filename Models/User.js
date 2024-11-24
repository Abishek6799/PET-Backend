import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum:['adopter','shelter', 'foster'],
        default: 'adopter',
        required: true
    },
    shelterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shelter",
    },
    fosterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Foster",
    },
    token: {
        type: String,
        required: false
    }

});

userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);
export default User;