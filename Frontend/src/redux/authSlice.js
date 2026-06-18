import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        suggestedUsers: [],
        userProfile: null,
        selectedChatUser: null
    },
    reducers: {
        // actions
        setAuthUser: (state, action) => { state.user = action.payload },
        setSuggestedUsers: (state, action) => { state.suggestedUsers = action.payload },
        setUserProfile: (state, action) => { state.userProfile = action.payload },
        setSelectedChatUser: (state, action) => { state.selectedChatUser = action.payload }
    }
})

export const { setAuthUser, setSuggestedUsers, setUserProfile, setSelectedChatUser } = authSlice.actions;

export default authSlice.reducer;