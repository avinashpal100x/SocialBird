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
            state.notifications.unshift(action.payload);
        },

        markAllAsRead: (state) => {
            state.notifications = state.notifications.map(notification => ({
                ...notification,
                isRead: true
            }));
        }
    }
});

export const { setNotifications, addNotifications, markAllAsRead } = notificationSlice.actions;

export default notificationSlice.reducer;