import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConfig from "./Database/dbConfig.js";
import authRouter from "./Routers/authRouters.js";
import { errorMiddleware } from "./Middleware/errorMiddleware.js";
import petRouter from "./Routers/petRouters.js";
import shelterRouter from "./Routers/shelterRouters.js";
import fosterRouter from "./Routers/fosterRouters.js";
import applicationRouter from "./Routers/applicationRouters.js";
import reviewRouter from "./Routers/reviewRouters.js";
import messageRouter from "./Routers/messageRouters.js";
import appointmentRouter from "./Routers/appointmentRouters.js";
import favoriteRoutes from "./Routers/favoriteRouters.js"


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());   

dbConfig();

app.get("/", (req, res) => {
    res.send("Welcome to Pet Adoption Backend");
})
 
app.use("/api/auth", authRouter);
app.use("/api/pet", petRouter);
app.use("/api/shelter", shelterRouter);
app.use("/api/foster", fosterRouter);
app.use("/api/application", applicationRouter);
app.use("/api/review", reviewRouter);
app.use("/api/message", messageRouter);
app.use("/api/appointment", appointmentRouter);
app.use("/api/favorites" , favoriteRoutes);
app.use(errorMiddleware);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});