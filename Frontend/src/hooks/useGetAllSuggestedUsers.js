import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { setSuggestedUsers } from '@/redux/authSlice.js'


const useGetAllSuggestedUsers = () => {

    const dispatch = useDispatch();

    useEffect(() => {

        const fetchAllSuggestedUsers = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/v1/user/suggestions", { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSuggestedUsers(res.data.users))
                }
            }
            catch (error) {
                console.log(error);
            }
        };
        fetchAllSuggestedUsers();
    }, [dispatch]);

}

export default useGetAllSuggestedUsers;