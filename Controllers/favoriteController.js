import Favorite from "../Models/Favorite.js";
import Pet from "../Models/Pet.js";


export const addFavorite = async (req, res) => {
    const { petId } = req.body;
    const userId = req.user._id;
    try {
        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
        }
        const existingFavorite = await Favorite.findOne({ user:userId,pet:petId});
        if(existingFavorite){
            return res.status(400).json({message:"Pet already in favorites"});
        }
        const favorite = await Favorite.create({ user: userId, pet: petId });
        res.status(201).json({ message:"Pet added to favorites", favorite});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getFavorites = async (req, res) => {
    const userId = req.user._id;
    try {
        const favorites = await Favorite.find({ user: userId }).populate("pet");
        res.status(200).json( favorites );
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeFavorite = async (req,res ) =>{
    const userId = req.user._id;
    const {favoriteId } = req.params;

    try {
         const favorite = await Favorite.findOneAndDelete({_id:favoriteId, user:userId});
         if(!favorite){
            return res.status(404).json({ message: "Favorite not found"})
         }
         res.status(200).json({ message:"Favorite removed"})
    } catch (error) {
        res.status(500).json({ messaege : error.message})
    }
};