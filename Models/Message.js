import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "senderType",
        required: true
    },
    senderType:{
        type:String,
        required: true,
        enum:["User","Shelter","Foster"]
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "receiverType",
        required: true  
    },
    receiverType:{
        type:String,
        required: true,
        enum:["User","Shelter","Foster"]
    },
    pet:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pet",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Message = mongoose.model("Message", messageSchema);

export default Message;