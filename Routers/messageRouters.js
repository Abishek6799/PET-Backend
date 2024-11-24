import express from "express";
import { sendMessage, getMessagesForPet, getMessagesForShelter, getMessagesForFoster } from "../Controllers/messageController.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/create/:petId", authMiddleware, sendMessage);
router.get("/pet/:petId", authMiddleware, getMessagesForPet);
router.get("/shelter/:shelterId", authMiddleware,getMessagesForShelter);
router.get("/foster/:fosterId", authMiddleware, getMessagesForFoster);

export default router;