import Appointment from "../Models/Appointment.js";
import Pet from "../Models/Pet.js";
import Shelter from "../Models/Shelter.js";
import sendMail from "../Utils/mail.js";

export const scheduleAppointment = async (req, res) => {
    const { petId } = req.params;
    const { shelterId } = req.params;
    const { appointmentDate, message} = req.body;
    const adopterId = req.user.id;

    try {
        const pet = await Pet.findById(petId);
        const shelter = await Shelter.findById(shelterId);
        if (!pet || !shelter) {
            return res.status(404).json({ message: "Pet or Shelter not found" });
        }

        if(!pet.status == "approved"){
            return res.status(400).json({ message: "Pet is not approved for adoption yet." });

        }

        const existingAppointment = await Appointment.findOne({
            adopter: adopterId,
            pet: petId,
            shelter: shelterId,
            status: { $in: ["pending", "confirmed"] }
        });
        if (existingAppointment) {
            return res.status(400).json({ message: "You have already scheduled an appointment for this pet" });
        }
        const appointment = new Appointment({
            adopter: adopterId,
            shelter: shelterId,
            pet: petId,
            PetName: pet.name,
            PetImage: pet.image,
            ShelterName: shelter.name,
            adopterName: req.user.name,
            appointmentDate: appointmentDate,
            message: message,
            status: "pending"
        });
        await appointment.save();
        res.status(200).json({ message: "Appointment scheduled successfully", appointment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const getAppointmentsForUser = async (req, res) => {
    
    const userId = req.user.id;
    try {
        const appointments = await Appointment.find({ adopter: userId }).populate('pet', 'name image');
        if (!appointments || appointments.length === 0) {
            return res.status(404).json({ message: 'No appointments found for this user' });
        }
        res.status(200).json(appointments);
    } catch (error) {
     
        res.status(500).json({ message: error.message });
    }
};

export const getAppointmentsForShelter = async (req, res) => {
    const { shelterId } = req.params;
    try {
        const appointments = await Appointment.find({ shelter: shelterId }).populate('pet', 'name image');
        if (!appointments || appointments.length === 0) {
            return res.status(404).json({ message: 'No appointments found for this shelter' });
        }
        res.status(200).json(appointments);
    } catch (error) {
    
        res.status(500).json({ message: error.message });
    }
};

export const getAppointmentsForPet = async (req, res) => {
    const { petId } = req.params;
    try {
        const appointments = await Appointment.find({ pet: petId });
        if (!appointments || appointments.length === 0) {
            return res.status(404).json({ message: 'No appointments found for this pet' });
        }
        res.status(200).json(appointments);
    } catch (error) {
        
        res.status(500).json({ message: error.message });
    }
}


export const updateAppointmentStatus = async (req, res) => {
    const {  status } = req.body;  
    const { id } = req.params;
    const userId = req.user.id;

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }  
    try {
        const appointment = await Appointment.findById(id).populate("adopter shelter pet");
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        if (userId.toString() !== appointment.adopter._id.toString()){
            if (req.shelter && req.shelter._id.toString() !== appointment.shelter._id.toString()) {
                console.error("Authorization failed:", { userId, appointment });
                return res.status(403).json({ message: "You do not have permission to update this appointment" });
            }
        
        }
        try {
            appointment.status = status;
        await appointment.save();
        } catch (dbError) {
            
            return res.status(500).json({ message: "Database error", error: dbError.message });
        }
        try {
            const mailResponse = await sendMail({
                to: appointment.adopter.email,
                subject: `Appointment ${status}`,
                text: `Hello ${appointment.adopter.name},\n\nYour appointment for ${appointment.PetName} has been ${status} on ${appointment.appointmentDate}.\n\nBest regards,\nPet Adoption Platform.`
            });
            if (!mailResponse) {
                return res.status(500).json({ message: "Failed to send email" });
            }
        } catch (emailError) {
           
            return res.status(500).json({ message: "Email sending error", error: emailError.message });
            
        }

        

        res.status(200).json({ message: "Appointment status updated", appointment });
    } catch (error) {
        
        res.status(500).json({ message: error.message });
    }
};

export const cancelAppointment = async (req, res) => {
    const { id } = req.params;
    try {
        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        await appointment.deleteOne();
        res.status(200).json({ message: "Appointment deleted " });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};