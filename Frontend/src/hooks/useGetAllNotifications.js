import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { setNotifications } from '../redux/notificationSlice.js'


const useGetAllNotifications = ({ userId }) => {

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllNotifications = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/v1/notification/getnotifications/${userId}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setNotifications(res?.data?.notifications))
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllNotifications();
    }, [userId, dispatch])
}

export default useGetAllNotifications