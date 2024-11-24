import express from "express";
import { createPet, getAllPets, getPets, getPetById , updatePet, updatePetStatus, deletePet, getShelterPets, getFosteredPets } from "../Controllers/petController.js";
import upload from "../Config/Multer.js";
import { authMiddleware, roleMiddleware } from "../Middleware/authMiddleware.js";



const router = express.Router();

router.post("/create",authMiddleware, upload.fields([
    { name: "image", maxCount: 1 },
    { name: "videos", maxCount: 3 }]), createPet);
router.get("/get/:id",authMiddleware, getPetById);
router.get("/get",authMiddleware, getPets);
router.get("/fosterPets",authMiddleware, getFosteredPets);
router.get("/availablePets",authMiddleware, getAllPets);
router.get("/shelterPets",authMiddleware,roleMiddleware(["shelter"]), getShelterPets);
router.put("/update-status/:id", authMiddleware,roleMiddleware(["shelter"]) ,updatePetStatus);
router.put("/update/:id",authMiddleware,roleMiddleware(["shelter"]),upload.fields([
    { name: "image", maxCount: 1 },
    { name: "videos", maxCount: 3 }]), updatePet);
router.delete("/delete/:id",authMiddleware,roleMiddleware(["shelter"]), deletePet);   

export default router;  
