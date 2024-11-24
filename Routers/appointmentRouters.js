import express from "express";
import { scheduleAppointment, getAppointmentsForUser,updateAppointmentStatus, cancelAppointment, getAppointmentsForPet } from "../Controllers/appointmentController.js";
import { authMiddleware, roleMiddleware } from "../Middleware/authMiddleware.js";


const router = express.Router();

router.post("/schedule/:petId/:shelterId", authMiddleware, scheduleAppointment);
router.get("/user", authMiddleware, getAppointmentsForUser);
router.get("/pet/:petId", authMiddleware,roleMiddleware(["shelter"]), getAppointmentsForPet);
router.put("/update/:id", authMiddleware,roleMiddleware(["shelter"]), updateAppointmentStatus);
router.delete("/delete/:id", authMiddleware, cancelAppointment);

export default router;