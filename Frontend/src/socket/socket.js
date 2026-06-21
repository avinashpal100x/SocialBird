import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (userId) => {
    if (!userId) return null;

    // Already connected
    if (socket?.connected) {
        return socket;
    }

    socket = io("https://socialbird-hi0p.onrender.com", {
        query: { userId },
        withCredentials: true,
    });

    return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};