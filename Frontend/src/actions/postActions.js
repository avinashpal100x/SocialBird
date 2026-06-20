import axios from "axios";
import { toast } from "sonner";
import { setUserProfile, setAuthUser } from '../redux/authSlice.js'


export const followOrUnfollow = async ({userId, dispatch, userProfile, user}) => {
    
    try {
        const res = await axios.post(
            `http://localhost:5000/api/v1/user/followorunfollow/${userId}`,
            {},
            { withCredentials: true }
        );

        if (res.data.success) {
            if (res.data.action === "followed") {
                dispatch(
                    setUserProfile({
                        ...userProfile,
                        followers: [...(userProfile?.followers || []), user._id]
                    })
                );

                dispatch(
                    setAuthUser({
                        ...user,
                        following: [...(user?.following || []), userProfile._id]
                    })
                );
            }
            else {
                dispatch(
                    setUserProfile({
                        ...userProfile,
                        followers: userProfile?.followers?.filter(
                            (id) => id.toString() !== user._id.toString()
                        )
                    })
                );

                dispatch(
                    setAuthUser({
                        ...user,
                        following: user?.following?.filter(
                            (id) =>
                                id.toString() !== userProfile?._id?.toString()
                        )
                    })
                );
            }

            toast.success(res.data.message);
        }
    } catch (error) {
        toast.error(
            error?.response?.data?.message || "Something went wrong"
        );
    }
};