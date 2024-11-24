import express from "express";
import { submitApplication, getApplicationForUser,updateApplicationStatus, getApplicationForShelter, getApplicationsByPet, deleteApplicationfromUser } from "../Controllers/applicationController.js";
import { authMiddleware, roleMiddleware } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/submit/:petId/:shelterId", authMiddleware, submitApplication);
router.get("/pet/:petId", authMiddleware, getApplicationsByPet);
router.get("/user", authMiddleware, getApplicationForUser);
router.get("/shelter/:shelterId", authMiddleware,roleMiddleware(["shelter"]), getApplicationForShelter);
router.put("/update/:applicationId", authMiddleware,roleMiddleware(["shelter"]), updateApplicationStatus);
router.delete("/delete/:applicationId", authMiddleware, roleMiddleware(["user","adopter"]), deleteApplicationfromUser);

export default router;