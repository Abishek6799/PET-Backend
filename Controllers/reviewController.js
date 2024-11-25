import Review from "../Models/Review.js";
import Pet from "../Models/Pet.js";
import Shelter from "../Models/Shelter.js";
import sendMail from "../Utils/mail.js";

export const createPetReview = async (req, res) => {
    const { petId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    try {
        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
        }

        const exists = await Review.findOne({ user: userId, pet: petId, });
        if (exists) {
            return res.status(400).json({ message: "You have already reviewed this pet" });
        }

        const review = new Review({
            user: userId,
            pet: petId,
            userName: req.user.name,
            rating,
            comment,
            
        });

        await review.save();
       
        const shelter = await Shelter.findById(pet.shelter);
        if(!shelter) {    
            return res.status(404).json({ message: "Shelter not found" });
        }
       
       
        const mailResponse = await sendMail({
            to: shelter.email,
            subject: `New Review for Pet ${pet.name}`,
            text: `Hello ${shelter.name},\n\nYou have received a new review for ${pet.name} from a ${req.user.name}.\nRating: ${rating}. \nComment: ${comment}\n\nBest regards,\nPet Adoption Platform.`
        })
         
        if (!mailResponse) {
            return res.status(500).json({ message: "Failed to send email",error: mailResponse.error });
        }

        res.status(201).json({ message: "Review submitted successfully", review });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createShelterReview = async (req, res) => {
    
    
    const { shelterId, rating, comment } = req.body;
    const userId = req.user._id;

    try {
        const shelter = await Shelter.findById(shelterId);
        if (!shelter) {
            return res.status(404).json({ message: "Shelter not found" });
        }

        const exsist = await Review.findOne({ user: userId, shelter: shelterId});
        if (exsist) {
            return res.status(400).json({ message: "You have already reviewed this shelter" });
        }

        const review = new Review({
            user: userId,
          
            shelter: shelterId,
            rating,
            comment,
        });

        await review.save();

        const mailResponse = await sendMail({
            to: shelter.email,
            subject: `New Review from ${req.user.name}`,
            text: `Hello ${shelter.name},\n\nYou have received a new review from ${req.user.name}.\nRating: ${rating}. \nComment: ${comment}\n\nBest regards,\nPet Adoption Platform.`
        })

        if (!mailResponse) {
            return res.status(500).json({ message: "Failed to send email" });
        }

        res.status(201).json({ message: "Review submitted successfully", review });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllPetReviews = async (req, res) => {
    const petId = req.params.petId;

    try {
        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
        }

        const reviews = await Review.find({ pet: petId  }).populate("user","name");
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllShelterReviews = async (req, res) => {
    const shelterId = req.params.shelterId;
    const petId = req.params.petId;

    try {
        const shelter = await Shelter.findById(shelterId);
        if (!shelter) {
            return res.status(404).json({ message: "Shelter not found" });
        }

        const reviews = await Review.find({ shelter: shelterId,pet:petId }).populate("user","name");
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteReview = async (req, res) => {
    const { reviewId } = req.params;
    try {
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        if ( review.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "You are not authorized to delete this review" });
        }
        await review.deleteOne();
        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};