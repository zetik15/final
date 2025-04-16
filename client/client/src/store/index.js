import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../features/auth/authSlice';
import eventsSlice from '../features/events/eventsSlice';
import usersSlice from '../features/users/usersSlice';

const store = configureStore({
    reducer: {
        auth: authSlice,
        events: eventsSlice,
        usersData: usersSlice
    },
    devTools: true,
})

export default store;
