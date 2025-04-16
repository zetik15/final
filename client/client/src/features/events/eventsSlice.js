import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { events } from '../../api/eventsAPI';
import { getErrorInfo } from '../../utils/errorUtils';

export const fetchEvents = createAsyncThunk(
    'events/fetchEvents',
    async (_, { rejectWithValue }) => {
        try {
            const response = await events.getAll();
            return response.data;
        } catch (error) {
            console.error('API Error', error);
            return rejectWithValue(getErrorInfo(error));
        }
    }
)

export const fetchEventById = createAsyncThunk(
    'events/fetchEventById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await events.getById(id);
            return response.data;
        } catch (error) {
            console.error('API Error', error);
            return rejectWithValue(getErrorInfo(error));
        }
    }
)

export const createEvent = createAsyncThunk(
    'events/createEvent',
    async (eventData, { rejectWithValue }) => {
        try {
            const response = await events.create(eventData);
            return response.data;
        } catch (error) {
            console.error('API Error', error);
            return rejectWithValue(getErrorInfo(error));
        }
    }
)

export const updateEventThunk = createAsyncThunk(
    'events/updateEventThunk',
    async ({ id, eventData }, { rejectWithValue }) => {
        try {
            const response = await events.update(id, eventData);
            return response.data;
        } catch (error) {
            console.error('API Error', error);
            return rejectWithValue(getErrorInfo(error));
        }
    }
)

export const deleteEvent = createAsyncThunk(
    'events/deleteEvent',
    async (id, { rejectWithValue }) => {
        try {
            const response = await events.delete(id);
            return response.data;
        } catch (error) {
            console.error('API Error', error);
            return rejectWithValue(getErrorInfo(error));
        }
    }
)

export const joinEvent = createAsyncThunk(
    'events/joinEvent',
    async ({ eventId, userId }, { rejectWithValue }) => {
        try {
            const response = await events.join(eventId, userId);
            return response.data;
        } catch (error) {
            console.error('API Error', error);
            return rejectWithValue(getErrorInfo(error));
        }
    }
)

export const leaveEvent = createAsyncThunk(
    'events/leaveEvent',
    async ({ eventId, userId }, { rejectWithValue }) => {
        try {
            const response = await events.leave(eventId, userId);
            return response.data;
        } catch (error) {
            console.error('API Error', error);
            return rejectWithValue(getErrorInfo(error));
        }
    }
)

const eventsSlice = createSlice({
    name: 'events',
    initialState: {
        events: [],
        currentEvent: null,
        loading: false,
        error: null,
        errorCode: null
    },
    reducers: {
        setLoading: (state) => {
            state.error = null;
            state.errorCode = null;
            state.loading = true;
        },
        setEvents: (state, action) => {
            state.loading = false;
            state.events = action.payload;
        },
        setCurrentEvent: (state, action) => {
            state.loading = false;
            state.currentEvent = action.payload;
        },
        addEvent: (state, action) => {
            state.events = action.payload;
        },
        updateEvent: (state, action) => {
            const index = state.events.findIndex(event => event.id === action.payload.id);
            if (index !== -1) {
                state.events[index] = action.payload
            } else {
                state.error = 'Мероприятие не найдено';
                state.errorCode = 404;
                state.loading = false;
            }

            if (state.currentEvent && state.currentEvent.id === action.payload.id) {
                state.currentEvent = action.payload;
            }
        },
        removeEvent: (state, action) => {
            state.events = state.events.filter(event => event.id !== action.payload.id);

            if (state.currentEvent && state.currentEvent.id === action.payload.id) {
                state.currentEvent = null;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEvents.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.errorCode = null;
            })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.events = action.payload;
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
                state.errorCode = action.payload.statusCode
            })


            .addCase(fetchEventById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.errorCode = null;
            })
            .addCase(fetchEventById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentEvent = action.payload;
            })
            .addCase(fetchEventById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
                state.errorCode = action.payload.statusCode
            })


            .addCase(createEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.errorCode = null;
            })
            .addCase(createEvent.fulfilled, (state, action) => {
                state.loading = false;
                state.events.push(action.payload);
            })
            .addCase(createEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
                state.errorCode = action.payload.statusCode
            })


            .addCase(updateEventThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.errorCode = null;
            })
            .addCase(updateEventThunk.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.events.findIndex(event => event.id === action.payload.id)

                if (index !== -1) {
                    state.events[index] = action.payload;
                }
            })
            .addCase(updateEventThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
                state.errorCode = action.payload.statusCode
            })


            .addCase(deleteEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.errorCode = null;
            })
            .addCase(deleteEvent.fulfilled, (state, action) => {
                state.loading = false;
                state.events = state.events.filter(event => event.id !== action.meta.arg);
                
                if (state.currentEvent && state.currentEvent.id === action.meta.arg) {
                    state.currentEvent = null;
                }
            })
            .addCase(deleteEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
                state.errorCode = action.payload.statusCode
            })


            .addCase(joinEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.errorCode = null;
            })
            .addCase(joinEvent.fulfilled, (state, action) => {
                state.loading = false;
                
                if (action.payload) {
                    state.currentEvent = action.payload;

                    const index = state.events.findIndex(event => event.id === action.payload.id);
                    if (index !== -1) {
                        state.events[index] = action.payload;
                    }
                }
            })
            .addCase(joinEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
                state.errorCode = action.payload.statusCode
            })


            .addCase(leaveEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.errorCode = null;
            })
            .addCase(leaveEvent.fulfilled, (state, action) => {
                state.loading = false;
                
                if (action.payload) {
                    const index = state.events.findIndex(event => event.id === action.payload.id);
                    if (index !== -1) {
                        state.events[index] = action.payload;
                    }
                    
                    if (state.currentEvent && state.currentEvent.id === action.payload.id) {
                        state.currentEvent = null;
                    }
                }
            })
            .addCase(leaveEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
                state.errorCode = action.payload.statusCode
            })
    }
});

export const { setLoading, setEvents, setCurrentEvent, addEvent, updateEvent, removeEvent } = eventsSlice.actions;

export default eventsSlice.reducer;
