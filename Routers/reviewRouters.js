import express from "express";
import { createPetReview, createShelterReview, deleteReview, getAllPetReviews, getAllShelterReviews} from "../Controllers/reviewController.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/pet/:petId", authMiddleware, createPetReview);
router.post("/shelter/:petId", authMiddleware, createShelterReview);
router.get("/pet/:petId",authMiddleware, getAllPetReviews);
router.get("/shelter/:shelterId/",authMiddleware, getAllShelterReviews);
router.delete("/delete/:reviewId", authMiddleware, deleteReview);

export default router;