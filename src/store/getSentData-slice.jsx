import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getSentData = createAsyncThunk('data/getSentData', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`https://mail-box-client-7-default-rtdb.firebaseio.com/.json`);
        if (!response.data || Object.keys(response.data).length === 0) {
            return rejectWithValue('No data found');
        }
        return response.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

const initialState = {
    sentItems: [],
    status: 'idle',
    error: null,
    count: 0,
};

const getSentDataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSentData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getSentData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.sentItems = [action.payload];
                state.count = action.payload.length;
            })
            .addCase(getSentData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { reset } = getSentDataSlice.actions;
export default getSentDataSlice.reducer;
