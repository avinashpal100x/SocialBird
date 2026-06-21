import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { setStories} from "../redux/storySlice.js"


const useGetAllStories = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const res = await axios.get("https://socialbird-hi0p.onrender.com/api/v1/story/getstories", { withCredentials: true }
                );
                if (res.data.success) {
                    dispatch(setStories(res.data.stories))
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchStories()
    }, [dispatch])
}

export default useGetAllStories