import Application from "../Models/Application.js";
import Pet from "../Models/Pet.js";
import Shelter from "../Models/Shelter.js";
import User from "../Models/User.js";
import sendMail from "../Utils/mail.js";


export const submitApplication = async (req, res) => {
    const { petId } = req.params;
    const { shelterId } = req.params;
    const {adopterName,adopterEmail,phoneNumber,address,location,message} = req.body;


    if(!petId || !shelterId || !adopterName || !adopterEmail || !phoneNumber || !address || !location || !message){
        return res.status(400).json({ message: "All fields are required" });
    }
    const userId = req.user.id;

    try {
        const pet = await Pet.findById(petId);
        const shelter = await Shelter.findById(shelterId);
        if (!pet || !shelter || !shelter.email) {
            return res.status(404).json({ message: "Pet or Shelter not found" });
        }
        
        const existingApplication = await Application.findOne({
            User: userId,
            Pet: petId,
            Shelter: shelterId,
            
        });

        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this pet" });
        }

        const application = new Application({
            User: userId,
            Pet: petId,
            Shelter:shelterId,
            petName: pet.name,
            petImage: pet.image,
            shelterName: shelter.name,
            adopterName: adopterName,
            adopterEmail: adopterEmail,
            phoneNumber: phoneNumber,
            address: address,
            location: location,
            message: message
        });

        await application.save();

        const mailResponse = await sendMail({

            to:shelter.email,
            subject:`New Adoption Application for ${pet.name}`,
            text:`Hello ${shelter.name},\n\nYou have received a new adoption application for ${pet.name} from ${adopterName}. Please review the application and take appropriate action.\n\nBest regards,\nPet Adoption Platform.`   
       

        }
            
        );

        if (!mailResponse) {
            return res.status(500).json({ message: "Failed to send email" });
        }
        res.status(201).json({ message: "Application submitted successfully", application });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getApplicationsByPet = async (req, res) => {
    const petId = req.params.petId;
    try {
        const applications = await Application.find({ Pet: petId}).populate("User","name").populate("Shelter","name").populate("Pet","name");
        if(applications.length === 0){
            return res.status(404).json({ message: "No applications found for this pet", applications });
        }
        res.status(200).json({message: "Applications found successfully", applications });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
 
export const updateApplicationStatus = async (req, res) => {
    const { applicationId } = req.params;
    const { status, message } = req.body;
    const shelterId = req.user.shelterId;

    try {
        const application = await Application.findById(applicationId).populate("Pet").populate("User","email name").populate("Pet.shelter");
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }
       
        if(!application.Pet || !application.Pet.shelter){
            return res.status(404).json({ message: "Pet or Pet shelterId is missing" });
        }
        
        if(application.Pet.shelter.toString() !== shelterId.toString()){
            return res.status(401).json({ message: "You are not authorized to update this application" });
        }
        
        application.status = status || application.status;
        application.message = message || application.message;

        await application.save();
        const user = await User.findById(application.User);
        const mailResponse = await sendMail({
            to: user.email,
            subject: `Your Adoption Application for Pet ${application.Pet.name}`,
            text: `Hello ${user.name},\n\nYour adoption application for Pet "${application.Pet.name}" has been ${status}. ${message ? `Message from Shelter: ${message}` : ""}\n\nBest regards,\nPet Adoption Platform.`
        })

        if (!mailResponse) {
            return res.status(500).json({ message: "Failed to send email" });
        }

        res.status(200).json({ message: "Application status updated successfully", application });
    } catch (error) {
       
        res.status(500).json({ message: error.message });
    }
};

export const getApplicationForUser = async (req, res) => {
    const userId = req.user._id;
    try {
        const applications = await Application.find({ User: userId });
        if (applications.length === 0) {
            return res.status(404).json({ message: "No applications found for this user" });
        }
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getApplicationForShelter = async (req, res) => {
    const{ shelterId } = req.params;
   
    try {
        const applications = await Application.find({ Shelter: shelterId, }).populate("User","name email").populate("Pet","name image shelter");
        if (!applications.length) {
            return res.status(404).json({ message: "No applications found for this shelter" });
        }
        res.status(200).json(applications);
    } catch (error) {
       
        res.status(500).json({ message: error.message });
    }
}


export const deleteApplicationfromUser = async (req, res) => {
    const { applicationId } = req.params;
    const userId = req.user._id;
    try {
        const application = await Application.findByIdAndDelete(applicationId);
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }
        if (application.User.toString() !== userId.toString()) {
           
            return res.status(401).json({ message: "You are not authorized to delete this application" });
        }
        res.status(200).json({ message: "Application deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

