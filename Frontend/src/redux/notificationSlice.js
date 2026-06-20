import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        notifications: [],
    },
    reducers: {
        setNotifications: (state, action) => {
            state.notifications = action.payload;
        },

        addNotifications: (state, action) => {
            console.log("Before:", state.notifications.length);

            state.notifications.unshift(action.payload);

            console.log("After:", state.notifications.length);
        },

        markAllAsRead: (state) => {
            state.notifications = state.notifications.map(notification => ({
                ...notification,
                isRead: true
            }));
        },

    }
});

export const { setNotifications, addNotifications, markAllAsRead } = notificationSlice.actions;

export default notificationSlice.reducer;