import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { setUserProfile } from '../redux/authSlice.js'


const useGetUserProfile = ({ userId }) => {

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await axios.get(`https://socialbird-hi0p.onrender.com/api/v1/user/profile/${userId}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setUserProfile(res?.data?.user))
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchUserProfile();
    }, [userId])
}

export default useGetUserProfile