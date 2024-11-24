import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    userName: {
        type: String,
    },
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pet",
        required: false
    },
    petName: {
        type: String,
    },
    shelter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shelter",
        required: false
    },
    shelterName: {
        type: String,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        minlength: 5
    },
    dateReviewed: {
        type: Date,
        default: Date.now
    }
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;