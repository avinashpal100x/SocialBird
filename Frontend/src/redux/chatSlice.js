import { createSlice } from '@reduxjs/toolkit'

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        messages: [],
        onlineUsers: [],
    },
    reducers: {
        setMessages: (state, action) => {
            state.messages = action.payload;
        },

        addMessages: (state, action) => {
            state.messages.push(action.payload);
        },

        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        }
    }
});


export const { setMessages, addMessages, setOnlineUsers } = chatSlice.actions;

export default chatSlice.reducer;