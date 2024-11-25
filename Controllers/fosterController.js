import Foster from "../Models/Foster.js";
import Pet from "../Models/Pet.js";
import Shelter from "../Models/Shelter.js";
import sendMail from "../Utils/mail.js";


export const createFosterPet = async (req, res) => {
    const { petId } = req.params;
    const {shelterId} = req.params;
    try {
        const { name, address, phoneNumber,location,email, availability, startDate,description, endDate } = req.body;
        const userId = req.user._id;
        if(!petId || !shelterId || !name || !address ||!email || !location || !phoneNumber || !description){
            return res.status(400).json({ message: "All fields are required" });
        }
        const pet = await Pet.findById(petId);
        if(!pet){
            return res.status(404).json({ message: "Pet not found" });
        }
        const shelter = await Shelter.findById(shelterId);
        if(!shelter){
            return res.status(404).json({ message: "Shelter not found" });
        }

        if (pet.status === "adopted") {
            return res.status(400).json({ message: "Pet is already adopted and cannot be fostered" });
        }

        if (pet.status === "fostered") {
            return res.status(400).json({ message: "Pet is already in foster care" });
        }

        const existingFoster = await Foster.findOne({ pet: petId,shelter:shelterId,user:userId });
        if (existingFoster) {
            return res.status(400).json({ message: "You have already fostered this pet. Check in profile page" });
        }
        

        const newFosterProfile =  new Foster({
            pet: petId,
            user: userId,
            shelter: shelterId,
            name,
            address,
            email,
            location,
            phoneNumber,
            availability: availability || "available",
            description,
            startDate: startDate || Date.now(),
            endDate,
            status: "pending",
        });
        await newFosterProfile.save();

     
        pet.foster = req.user._id;
        await pet.save();

        const mailResponse = await sendMail({
            to: shelter.email,
            subject: `New Foster Application: ${pet.name}`,
            text: `
        Hello ${shelter.name},
        \n\nA new foster application has been submitted for ${pet.name} (${pet.breed}).
        \n\nDetails:
        \nName: ${name}
        \nAddress: ${address}
        \nContact: ${phoneNumber}
        \nLocation: ${location}
        \nEmail: ${email}
        \nDescription: ${description}
        \nAvailability: ${availability}
        \nStart Date: ${startDate ? startDate : "To be determined"}
        \nEnd Date: ${endDate ? endDate : "To be determined"}
        \n\nFoster Parent: ${req.user.name}
        \n\nPlease review the application and respond to it as soon as possible.
        \n\nBest regards,
        \nPet Adoption Platform.`
        });
        if (!mailResponse) {
           
            return res.status(500).json({ message: "Failed to send email" });
        }
        res.status(201).json({ message: "Foster profile created successfully", fosterProfile: newFosterProfile});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getFosteredPets = async (req, res) => {
    try {
        const userId = req.user.id;
        const fosters = await Foster.find({ user: userId,pet: { $exists: true } }).populate("pet").populate("shelter","name");
        if(fosters.length === 0){
            return res.status(404).json({ message: "No fosters pet found" });
        }
        res.status(200).json({message: "Fosters found successfully", fosters });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllFosteredPetsForShelter = async (req, res) => {
    const {shelterId} = req.params;
    try {
        const fosters = await Foster.find({shelter:shelterId}).populate("pet","name image status").populate("user","name email");
        if(fosters.length === 0){
            return res.status(404).json({ message: "No fosters pet found" });
        }
        res.status(200).json({message: "Fosters found successfully", fosters });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateFosterStatus = async (req, res) => {
    const { id } = req.params;

    try {
       
        const foster = await Foster.findById(id)
            .populate("user", "_id name") 
            .populate("pet", "_id name status")
            .populate("shelter", "_id name");


        if (!foster) {
            return res.status(404).json({ message: "Foster record not found" });
        }
       
        foster.status = req.body.status ?? foster.status; 
        foster.endDate = req.body.endDate ?? foster.endDate;
        foster.note = req.body.note ?? foster.note;

     
        await foster.save();

     
        res.status(200).json({
            message: "Foster status updated successfully",
            foster,
        });
    } catch (error) {
        console.error("Error updating foster status:", error); 
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const deleteFoster = async (req, res) => {
    const { fosterId } = req.params;
    const userId = req.user._id;
    try {
        const foster = await Foster.findByIdAndDelete(fosterId);
        if(!foster){
            return res.status(404).json({ message: "Foster not found" });
        }
        if(foster.user.toString() !== userId.toString()){
            return res.status(403).json({ message: "Access denied" });
            
        }
        
        res.status(200).json({ message: "Foster deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}