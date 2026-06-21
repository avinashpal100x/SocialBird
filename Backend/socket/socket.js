import { Server } from 'socket.io'
import { SOCKET_EVENTS } from './socketEvents.js'

let io;

// userId => socketId
const userSocketMap = new Map();

// receiver socketId
export const getReceiverSocketId = (userId) => {
    return userSocketMap.get(userId);
}

// get online users
export const getOnlineUsers = () => {
    return [...userSocketMap.keys()]
}

// io can be accessible to any file
export const getIO = () => {
    return io;
}

// main function
export const initializeSocket = (server) => {

    // socket server creation
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        }
    })

    // connection event
    io.on(SOCKET_EVENTS.CONNECTION, (socket) => {

        console.log("User Connected", socket.id);

        const userId = socket.handshake.query.userId;
        if (userId) {
            userSocketMap.set(userId, socket.id)
        }

        // broadcast online users
        io.emit(SOCKET_EVENTS.GET_ONLINE_USERS, getOnlineUsers());

        // disconnect listener
        socket.on(SOCKET_EVENTS.DISCONNECT, () => {

            // remove user
            userSocketMap.delete(userId)

            io.emit(SOCKET_EVENTS.GET_ONLINE_USERS, getOnlineUsers());
        })
    })
    return io;
}