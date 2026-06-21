import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { setPosts } from '@/redux/postSlice.js'


const useGetAllPosts = () => {

    const dispatch = useDispatch();

    useEffect(() => {

        const fetchAllPosts = async () => {
            try {
                const res = await axios.get("https://socialbird-hi0p.onrender.com/api/v1/post/getallposts", { withCredentials: true }
                );
                if (res.data.success) {
                    dispatch(setPosts(res.data.posts))
                }
            }
            catch (error) {
                console.log(error);
            }
        };

        fetchAllPosts();

    }, [dispatch]);

}

export default useGetAllPosts;