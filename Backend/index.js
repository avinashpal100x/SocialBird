import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http'
import dotenv from 'dotenv';
dotenv.config();

import databaseConnect from './config/database.js'
import authRouter from './routes/authRoute.js'
import userRouter from './routes/userRoute.js'
import postRouter from './routes/postRoute.js'
import commentRouter from './routes/commentRoute.js'
import messageRouter from './routes/messageRoute.js'
import notificationRouter from './routes/notificationRoute.js'
import storyRouter from './routes/storyRoute.js'

import path from 'path'
const __dirname = path.resolve();


import { initializeSocket } from './socket/socket.js'


const PORT = process.env.PORT || 4000;

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.URL,
    credentials: true
}));


// api calling
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/post", postRouter)
app.use("/api/v1/comment", commentRouter)
app.use("/api/v1/message", messageRouter)
app.use("/api/v1/notification", notificationRouter)
app.use("/api/v1/story", storyRouter)


app.use(express.static(path.join(__dirname, "/Frontend/dist")));
app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, 'Frontend', 'dist', 'index.html'));
});


// server
databaseConnect()
    .then(() => {

        const server = http.createServer(app)
        initializeSocket(server)

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Database connection failed:', error.message);
    });