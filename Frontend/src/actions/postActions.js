import axios from "axios";
import { toast } from "sonner";
import { setPosts } from '../redux/postSlice.js'


export const deletePost = async ({ postId, posts, dispatch }) => {
    try {
        const res = await axios.delete(`https://socialbird-hi0p.onrender.com/api/v1/post/delete/${postId}`, { withCredentials: true });
        if (res.data.success) {
            const updatedPosts = posts.filter((postItem) => postItem?._id !== postId);
            dispatch(setPosts(updatedPosts))
            toast.success(res.data.message)
        }
    }
    catch (error) {
        toast.error(
            error?.response?.data?.message || "Something went wrong"
        );
    }
}

export const likeDislike = async ({
    postId,
    liked,
    setLiked,
    countLikes,
    setCountLikes,
    posts,
    user,
    dispatch}) => {

    try {
        const action = liked ? "dislike" : "like"
        const res = await axios.get(`https://socialbird-hi0p.onrender.com/api/v1/post/${postId}/${action}`, { withCredentials: true })

        if (res.data.success) {
            const updatedLikes = liked ? countLikes - 1 : countLikes + 1
            setCountLikes(updatedLikes)
            setLiked(!liked);

            // updated liked posts
            const updatedLikedPost = posts.map((p) =>
                p._id === postId
                    ? {
                        ...p,
                        likes: liked
                            ? p.likes.filter((id) => id !== user._id)
                            : [...p.likes, user._id]
                    }
                    : p
            );

            dispatch(setPosts(updatedLikedPost));
            toast.success(res.data.message)
        }
    }
    catch (error) {
        toast.error(
            error?.response?.data?.message || "Something went wrong"
        );
    }
}
