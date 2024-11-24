import express from "express";
import { createShelter, getAllShelters, getShelterById, updateShelter, deleteShelter } from "../Controllers/shelterController.js";

const router = express.Router();

router.post("/create", createShelter);
router.get("/get/:id", getShelterById);
router.get("/getall", getAllShelters);
router.put("/update/:id", updateShelter);
router.delete("/delete/:id", deleteShelter);

export default router;