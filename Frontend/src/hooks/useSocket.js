import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getSocket, connectSocket } from '../socket/socket'
import { addMessages, setOnlineUsers } from '../redux/chatSlice.js'


export const useSocket = (userId) => {

    const dispatch = useDispatch();

    useEffect(() => {

        if (!userId) return;

        const socket = connectSocket(userId);

        socket.on("get_online_users", (users) => {
            dispatch(setOnlineUsers(users));
        });

        socket.on("receive_message", (message) => {
            dispatch(addMessages(message));
        });

        return () => {
            socket.off("get_online_users");
            socket.off("receive_message");
        };

    }, [userId, dispatch]);

}