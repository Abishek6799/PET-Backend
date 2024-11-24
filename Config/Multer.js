import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "pet",
        format: async (req, file) => {
            const allowedFormats = ['jpg', 'png', 'jpeg', 'mp4', 'gif', 'avi'];
            const ext = file.mimetype.split("/")[1];
            if (allowedFormats.includes(ext)) {
                return ext;
            }
            throw new Error("Invalid file type. Only JPEG, PNG, MP4, GIF, and AVI files are allowed.");
        },
        transformation: [{ width: 800, height: 800, crop: "limit" }],
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/jpg',
            'video/mp4',
            'image/gif', 
            'video/avi', 
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true); 
        } else {
            cb(new Error("Invalid file type. Only JPEG, PNG, MP4, GIF, and AVI files are allowed."), false); 
        }
    },
});

export default upload;
