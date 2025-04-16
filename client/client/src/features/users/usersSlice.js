import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { usersAPI } from '../../api/usersAPI';
import { getErrorInfo } from '../../utils/errorUtils';

export const fetchAllUsers = createAsyncThunk(
    'usersAPI/fetchAllUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await usersAPI.getUsers();
            return response.data
        } catch (error) {
            console.error('API Error', error);
            return rejectWithValue(getErrorInfo(error));
        }
    }
)

const usersSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        loading: false,
        error: null,
        errorCode: null
    },

    reducers: {

    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUsers.pending, (state) => {
                state.error = null;
                state.errorCode = null;
                state.loading = true;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
                state.errorCode = action.payload.statusCode;
            })
    }
});

export default usersSlice.reducer;