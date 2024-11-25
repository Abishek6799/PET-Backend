import express from "express";
import { getFosteredPets,getAllFosteredPetsForShelter, updateFosterStatus,  createFosterPet, deleteFoster } from "../Controllers/fosterController.js";
import { authMiddleware, roleMiddleware } from "../Middleware/authMiddleware.js";



const router = express.Router();


router.post("/fosterpet/:petId/:shelterId", authMiddleware, createFosterPet);
router.get("/get", authMiddleware, getFosteredPets);
router.get("/all/:shelterId", authMiddleware,roleMiddleware(["shelter"]), getAllFosteredPetsForShelter);
router.put("/update/:id",authMiddleware,  updateFosterStatus);
router.delete("/delete/:id",authMiddleware, roleMiddleware(["foster"]), deleteFoster);

export default router;

