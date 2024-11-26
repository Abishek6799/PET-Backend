import express from "express";
import { addFavorite, getFavorites, removeFavorite } from "../Controllers/favoriteController.js";
import { authMiddleware } from "../Middleware/authMiddleware.js"

const router = express.Router();

router.post("/add/", authMiddleware , addFavorite);
router.get("/get",authMiddleware,getFavorites);
router.delete("/delete/:favoriteId", authMiddleware, removeFavorite);
export default router;