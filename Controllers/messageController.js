import Message from "../Models/Message.js";
import Pet from "../Models/Pet.js";
import Shelter from "../Models/Shelter.js";
import User from "../Models/User.js";
import Foster from "../Models/Foster.js";


export const sendMessage = async (req, res) => {
    const { petId } = req.params;
    const { content, receiverId, receiverType, senderId, senderType  } = req.body;

    
    if (!petId || !content || !receiverId || !receiverType) {
        console.error("Invalid request payload:", req.body);
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
        }
         
        let sender;
        
        if (senderType === "User") {
            sender = await User.findById(senderId).select("name");
        } else if (senderType === "Shelter") {
            sender = await Shelter.findById(senderId).select("name");
        } else if (senderType === "Foster") {
            sender = await Foster.findById(senderId).select("name");
        }

        if (!sender) {
            return res.status(404).json({ message: "Sender not found" });
        }

        let receiver;
      
        if (receiverType === "User") {
            receiver = await User.findById(receiverId).select("name");
        } else if (receiverType === "Shelter") {
            receiver = await Shelter.findById(receiverId).select("name");
        } else if (receiverType === "Foster") {
            receiver = await Foster.findById(receiverId).select("name");
        }

        if (!receiver) {
            return res.status(404).json({ message: "Receiver not found" });
        }

   
        const message = new Message({
            sender: sender,
            senderType,
            receiver: receiver._id,
            receiverType,
            pet: pet._id,
            content: content,
            timestamp: new Date(),
        });

        await message.save();

        
        const populatedMessage = await Message.findById(message._id)
            .populate('sender','name') 
            .populate('receiver','name') 
            .populate('pet', 'name breed');  

        return res.status(200).json({ message: "Message sent successfully", message: populatedMessage });

    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: error.message });
    }
};


export const getMessagesForPet = async (req, res) => {
    const { petId } = req.params;
    try {
        const messages = await Message.find({ pet: petId })
        .populate("sender", "name email role")
        .populate("receiver", "name email role")
        .populate("pet", "name breed")
        .sort({ timestamp: -1 });

        if (!messages || messages.length === 0) {
            return res.status(404).json({ message: "No messages found for this pet" });
        }

        res.status(200).json({ messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: error.message });
    }   
};

        
export const getMessagesForShelter = async (req, res) => {
    const { shelterId } = req.params;
    try {
        const messages = await Message.find({
            $or: [
                { receiver: shelterId, receiverType: "Shelter" },
                { sender: shelterId, senderType: "Shelter" }
            ]
        })
        .populate("sender", "name email role")
        .populate("receiver", "name email role")
        .populate("pet", "name breed" )
        .sort({ timestamp: -1 });   

        if(!messages || messages.length == 0 ){
            return res.status(404).json({ message: "No messages found for this shelter" });
        }
        res.status(200).json({ messages });
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};


export const getMessagesForFoster = async (req, res) => {
    const { fosterId } = req.params;
    try {
        const messages = await Message.find({ receiver:fosterId,receiverType:"Foster"}).populate("sender", "name email role")    
        .populate("receiver", "name email role")
        .populate("pet", "name breed" )
        .sort({ timestamp: -1 });   

        if(!messages || messages.length == 0 ){
            return res.status(404).json({ message: "No messages found for this foster" });
        }
        res.status(200).json({ messages });
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};