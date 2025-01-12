// src/Redux/Slice/VideoSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Set up the API key and YouTube endpoint
const API_KEY = 'AIzaSyC3Z5oDU7ZPv8R-sw3aKs_pLNBSIpEXs7M';

// Thunk to fetch video details
export const fetchVideoDetails = createAsyncThunk(
    'video/fetchVideoDetails',
    async (videoId) => {
        const response = await axios.get(
            `https://www.googleapis.com/youtube/v3/videos`, {
            params: {
                part: 'snippet,contentDetails,statistics',
                id: videoId,
                key: API_KEY,
            },
        }
        );

        console.log(response.data.items)
        return response.data.items[0];  // Return video data
    }
);

// Initial state for video data
const initialState = {
    videoDetails: null,
    status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
    error: null,
};

// Create slice
const videoSlice = createSlice({
    name: 'video',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVideoDetails.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchVideoDetails.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.videoDetails = action.payload;
            })
            .addCase(fetchVideoDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

// Export the reducer
export default videoSlice.reducer;
