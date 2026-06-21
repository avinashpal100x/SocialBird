import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { setMessages } from '../redux/chatSlice.js'


const useGetMessage = ({ userId }) => {

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUserMessage = async () => {
            try {
                const res = await axios.get(`https://socialbird-hi0p.onrender.com/api/v1/message/get/userId`,
                    { withCredentials: true }
                )
                if (res.data.success) {
                    dispatch(setMessages(res?.data?.messages))
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchUserMessage();
    }, [userId])
}

export default useGetMessage