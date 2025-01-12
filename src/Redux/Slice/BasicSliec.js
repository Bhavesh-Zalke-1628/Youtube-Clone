

const API_KEY = "AIzaSyC3Z5oDU7ZPv8R-sw3aKs_pLNBSIpEXs7M";

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// const API_KEY = 'YOUR_YOUTUBE_API_KEY'; // Replace with your YouTube API key

// Fetch random videos from the YouTube API
export const fetchRandomVideos = createAsyncThunk('basic/fetchRandomVideos', async (pageToken = '') => {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
            part: 'snippet',
            maxResults: 12,
            pageToken: pageToken,
            type: 'video',
            key: API_KEY,
        },
    });
    return response.data;
});

// Fetch channel data based on channelId
export const getChanelData = createAsyncThunk('basic/getChanelData', async (channelId) => {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
        params: {
            part: 'snippet',
            id: channelId,
            key: API_KEY,
        },
    });
    return { channelId, data: response.data.items[0] }; // Returning both channelId and data
});

// Create a Redux slice for the basic state
const basicSlice = createSlice({
    name: 'basic',
    initialState: {
        videos: [],
        status: 'idle',
        error: null,
        pageToken: null,
        channelData: {},
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRandomVideos.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRandomVideos.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.videos = action.payload.items;
                state.pageToken = action.payload.nextPageToken;
            })
            .addCase(fetchRandomVideos.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(getChanelData.fulfilled, (state, action) => {
                state.channelData[action.payload.channelId] = action.payload.data; // Storing the channel data
            })
            .addCase(getChanelData.rejected, (state, action) => {
                state.error = action.error.message;
            });
    },
});

export default basicSlice.reducer;
