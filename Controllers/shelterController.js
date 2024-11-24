import User from "../Models/User.js";
import Shelter from "../Models/Shelter.js";





export const createShelter = async (req, res) => {
    try {
        const { name, address, phoneNumber, email, description, userId } = req.body;
       

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const existingShelter = await Shelter.findOne({ email });
        if (existingShelter) {
            return res.status(400).json({ message: "User already has a shelter" });
        }

        const shelter = new Shelter({ name, address, phoneNumber, email, description, user: userId });
        await shelter.save();

        user.role = "shelter";
        user.shelterId = shelter._id;
        await user.save();

        res.status(201).json({ message: "Shelter created successfully", shelter });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllShelters = async (req, res) => {
    try {
        const shelters = await Shelter.find().populate("pets applications reviews");
        res.status(200).json(shelters);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getShelterById = async (req, res) => {
    const { id } = req.params;
    try {
        const shelter = await Shelter.findById(id).populate("pets applications reviews");
        if (!shelter) {
            return res.status(404).json({ message: "Shelter not found" });
        }
        res.status(200).json(shelter);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateShelter = async (req, res) => {
    const { id } = req.params;
    const { name, address, phoneNumber, email, description } = req.body;
    try {
        const shelter = await Shelter.findById(id);
        if (!shelter) {
            return res.status(404).json({ message: "Shelter not found" });
        }
        shelter.name = name || shelter.name;
        shelter.address = address || shelter.address;
        shelter.phoneNumber = phoneNumber || shelter.phoneNumber;
        shelter.email = email || shelter.email;
        shelter.description = description || shelter.description;
        await shelter.save();
        res.status(200).json({ message: "Shelter updated successfully", shelter });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteShelter = async (req, res) => {
    const { id } = req.params;
    try {
        const shelter = await Shelter.findByIdAndDelete(id);
        if (!shelter) {
            return res.status(404).json({ message: "Shelter not found" });
        }
        res.status(200).json({ message: "Shelter deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};