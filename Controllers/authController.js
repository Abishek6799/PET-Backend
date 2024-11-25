import User from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sendMail from "../Utils/mail.js";
import Foster from "../Models/Foster.js";
import Shelter from "../Models/Shelter.js";



dotenv.config();

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already registered" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role });
        if (role === "foster") {
            const fosterData = new Foster({
                name,
                address: "Address",
                phoneNumber: "1234567890",
                user: newUser._id,
            });
            const foster = await fosterData.save();
            newUser.fosterId = foster._id;
            newUser.role = "foster";
        } 
        if (role === "shelter") {
            const shelterData = new Shelter({
                name,
                address: "Address",
                phoneNumber: "1234567890",
                email,
                description: "Description",
                user: newUser._id,
            });
            const shelter = await shelterData.save();
            newUser.shelterId = shelter._id;
            newUser.role = "shelter";
        }
        await newUser.save();
        const emailSend = await sendMail(
            email,
            'Welcome to the Pet Adoption Platform',
            `Hello ${name},\n\nThank you for registering with us. We are glad to have you on board.\n\nBest regards,\nPet Adoption Platform.`
        )
        if (!emailSend) {
            return res.status(500).json({ message: "Failed to send email" });
        }   
        res.status(201).json({ message: "Registered Successfully", user:{
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            fosterId: newUser.fosterId || null,
        } });
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).populate("shelterId").populate("fosterId");
        if (!user) {
            return res.status(400).json({ message: "User Not Found" });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: "Invalid Password" });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        user.token = token;
        await user.save();
        
        if(user.role === "adopter"){
            return res.status(200).json({ message: "Login successfully",userId:user._id,  token: token, role: user.role });
        }else if (user.role === "shelter") {
            if(user.shelterId){
                return res.status(200).json({ message: "Login successfully",shelterId:user.shelterId._id, token: token, role: user.role });
            }else{
                return res.status(200).json({ message: "Shelter not found or shelterId is missing"}); 
            }
           
        }else if (user.role === "foster") {
            if(user.fosterId ){
                return res.status(200).json({ message: "Login successfully",fosterId:user.fosterId._id, userId:user._id, token: token, role: user.role });   
            }else{
                return res.status(200).json({ message: "Foster not found or fosterId is missing"});
            }
            
        }
        
        else{
            return res.status(200).json({ message: "Invalid user role"});
        }
        }
         catch (error) {
        res.status(500).json({ message: error.message});
    }
};  

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User Not Found" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        const resetPasswordLink = `https://imaginative-bublanina-967d54.netlify.app/reset-password/${user._id}/${token}`;
        const emailSend = await sendMail({
            to:user.email,
            subject:'Reset Password',
            text:`Hello ${user.name},\n\nYou requested a password reset. Please click the link below to reset your password:\n\n${resetPasswordLink}\n\nIf you did not request a password reset, please ignore this email.\n\nBest regards,\nPet Adoption Platform.`
    })
        if (!emailSend.success) {
            return res.status(500).json({ message: "Failed to send email" });
        }   
        res.status(200).json({ message: "Password Reset Link Email Sent Successfully" });
        
        } catch (error) {
            res.status(500).json({ message: error.message});  
}   
}; 

export const resetPassword = async (req, res) => {
    try {
        const { id, token } = req.params;
        const { password } = req.body;
       jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
           if (err) {
               return res.status(400).json({ message: "Invalid or Expired Token" });
           }
           const user = await User.findById(id);
           if (!user) {
               return res.status(400).json({ message: "User Not Found" });
           }
           const hashedPassword = await bcrypt.hash(password, 10);
           user.password = hashedPassword;
           await user.save();
           res.status(200).json({ message: "Password Reset Successfully" });
       });
    } catch (error) {
       res.status(500).json({
           message: error.message
       })
    }
};