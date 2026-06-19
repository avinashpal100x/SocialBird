import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { connectSocket } from '../socket/socket'
import { addMessages, setOnlineUsers } from '../redux/chatSlice.js'
import { addNotifications ,setNotifications} from '../redux/notificationSlice.js'
import { setPosts } from '../redux/postSlice.js'
import store from '../redux/store.js'



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

        socket.on("newNotification", (notification) => {
            dispatch(addNotifications(notification));
        });

        socket.on("notificationDeleted", ({ notificationId }) => {
            const updatedNotifications = store.getState().notification.notifications.filter(
                notification => notification._id !== notificationId
            );
            dispatch(setNotifications(updatedNotifications));
        });

        socket.on("postLiked", ({ postId, likes }) => {
            const updatedPosts = store.getState().post.posts.map(post =>
                post._id === postId ? { ...post, likes } : post
            );
            dispatch(setPosts(updatedPosts));
        });

        socket.on("postDisliked", ({ postId, likes }) => {
            const updatedPosts = store.getState().post.posts.map(post =>
                post._id === postId ? { ...post, likes } : post
            );
            dispatch(setPosts(updatedPosts));
        });

        socket.on("newComment", ({ postId, comment }) => {
            const updatedPosts = store.getState().post.posts.map(post =>
                post._id === postId ? { ...post, comments: [comment, ...post.comments] } : post
            );
            dispatch(setPosts(updatedPosts));
        });



        return () => {
            socket.off("get_online_users");
            socket.off("receive_message");
            socket.off("newNotification");
            socket.off("notificationDeleted");
            socket.off("postLiked");
            socket.off("postDisliked");
            socket.off("newComment");
        };

    }, [userId, dispatch]);

}