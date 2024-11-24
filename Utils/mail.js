import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.PASS_MAIL,
        pass: process.env.PASS_KEY,
    }
});
const sendMail = async ({to, subject,text}) => {
    const mailOptions = {
        from: process.env.PASS_MAIL,
        to: to,
        subject: subject,
        text: text,
    };
    try {
        await transporter.sendMail(mailOptions);
        return { success: true, message: "Email sent successfully" };
    } catch (error) {
        return { success: false, message: "Failed to send email", error: error.message };
    }
};

export default sendMail;
