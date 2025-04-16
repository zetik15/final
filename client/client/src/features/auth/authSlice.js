import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authAPI } from '../../api/authAPI';
import { events } from '../../api/eventsAPI';import { getErrorInfo } from '../../utils/errorUtils';
import { set, remove } from '../../utils/localStorage';

export const signin = createAsyncThunk(
    'authAPI/signin',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authAPI.login(credentials);
            set('token', response.data.token);
            set('userId', response.data.id);
            set('userEmail', credentials.email);
            set('userPassword', credentials.password);
            return response.data
        } catch (error) {
            console.error('API Error', error);
            return rejectWithValue(getErrorInfo(error));
        }
    }
)

export const registerUser = createAsyncThunk(
    'authAPI/registerUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await authAPI.register(userData);
            set('token', response.data.token);
            set('userId', response.data.id);
            set('userEmail', userData.email);
            set('userPassword', userData.password);
            return response.data
        } catch (error) {
            console.error('API Error', error);
            return rejectWithValue(getErrorInfo(error));
        }
    }
)

export const getCurrentUser = createAsyncThunk(
    'authAPI/getCurrentUser',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await authAPI.getCurrentUser(userId);
            return response.data
        } catch (error) {
            console.error('API Error', error);
            return rejectWithValue(getErrorInfo(error));
        }
    }
)

export const signout = createAsyncThunk(
    'authAPI/signout',
    async (_, { rejectWithValue }) => {
        try {
            await authAPI.logout();
            
            remove('token');
            remove('userId');
            remove('userEmail');
            remove('userPassword');
            
            return { success: true };
        } catch (error) {
            console.error('API Error', error);
            remove('token');
            remove('userId');
            remove('userEmail');
            remove('userPassword');
            return rejectWithValue(getErrorInfo(error));
        }
    }
)

export const deleteAccount = createAsyncThunk(
    'authAPI/deleteAccount',
    async (userId, { rejectWithValue }) => {
        try {
            // Сначала удаляем все мероприятия пользователя
            await events.deleteUserEvents(userId);
            
            // Затем удаляем самого пользователя
            await authAPI.deleteUser(userId);
            
            // Очищаем локальное хранилище
            remove('token');
            remove('userId');
            remove('userEmail');
            remove('userPassword');
            
            return { success: true };
        } catch (error) {
            console.error('API Error', error);
            return rejectWithValue(getErrorInfo(error));
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        errorCode: null
    },
    reducers: {
        login: (state) => {
            state.error = null;
            state.errorCode = null;
            state.loading = true;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload
        },
        loginFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        logout: () => {
            return {
                user: null,
                isAuthenticated: false,
                loading: false,
                error: null
            };
        },
        clearError: (state) => {
            state.error = null;
            state.errorCode = null;
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(signin.pending, (state) => {
                state.error = null;
                state.errorCode = null;
                state.loading = true;
            })
            .addCase(signin.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(signin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
                state.errorCode = action.payload.statusCode;
                state.isAuthenticated = false;
            })


            .addCase(registerUser.pending, (state) => {
                state.error = null;
                state.errorCode = null;
                state.loading = true;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
                state.errorCode = action.payload.statusCode;
                state.isAuthenticated = false;
            })


            .addCase(getCurrentUser.pending, (state) => {
                state.error = null;
                state.errorCode = null;
                state.loading = true;
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(getCurrentUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
                state.errorCode = action.payload.statusCode;
                state.isAuthenticated = false;
            })


            .addCase(signout.pending, (state) => {
                state.error = null;
                state.errorCode = null;
                state.loading = true;
            })
            .addCase(signout.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(signout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
                state.errorCode = action.payload.statusCode;
                state.isAuthenticated = false;
            })


            .addCase(deleteAccount.pending, (state) => {
                state.error = null;
                state.errorCode = null;
                state.loading = true;
            })
            .addCase(deleteAccount.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(deleteAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
                state.errorCode = action.payload.statusCode;
            })
    }
});

export const { login, loginSuccess, loginFailure, logout, clearError } = authSlice.actions;

export default authSlice.reducer;