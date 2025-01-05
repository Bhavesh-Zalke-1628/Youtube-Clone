

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    video: [],
    status: "idle",
    error: null,
};

const API_KEY = 'AIzaSyC3Z5oDU7ZPv8R-sw3aKs_pLNBSIpEXs7M';


export const fetchTrendingVideos = createAsyncThunk(
    "basic/fetchTrendingVideos",
    async () => {
        try {
            const response = await axios.get(
                `https://www.googleapis.com/youtube/v3/videos`,
                {
                    params: {
                        part: 'snippet,contentDetails,statistics',
                        chart: 'mostPopular',
                        maxResults: 20,
                        key: API_KEY,
                        regionCode: "IN",
                        location: '19.7515,75.7139', // Coordinates for Maharashtra (approximate)
                        locationRadius: '100km',
                    },
                }
            );
            return response?.data?.items;
        } catch (error) {
            throw new Error("Something went wrong while fetching the videos");
        }
    }
);

const fetchChannelData = async (channelId) => {

    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
            params: {
                part: 'snippet,contentDetails,statistics', // You can modify this to fetch other details
                id: channelId, // Provide the channelId here
                key: API_KEY
            }
        });

        console.log(response.data);
        return response.data.items[0]; // Channel data will be inside the 'items' array
    } catch (error) {
        console.error('Error fetching channel data:', error);
        throw error;
    }
};


export const fetchChannelThumbnail = async (channelId) => {
    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
            params: {
                part: 'snippet',  // Get the snippet part which contains the channel details
                id: channelId,    // Pass the channelId
                key: API_KEY
            }
        });

        console.log(response.data)

        // Extract channel thumbnail
        const channelThumbnail = response.data.items[0]?.snippet?.thumbnails?.default?.url;
        return channelThumbnail; // Return the thumbnail URL
    } catch (error) {
        console.error('Error fetching channel thumbnail:', error);
        throw error;
    }
};


// Usage example

const fetchVideoDetails = async (videoId) => {
    try {
        const response = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
            params: {
                part: "snippet,contentDetails,statistics", // Metadata, details, and statistics
                id: videoId, // ID of the video
                key: API_KEY,
            },
        });
        console.log(response.data.items[0]); // Logs the video details
        return response.data.items[0];
    } catch (error) {
        console.error("Error fetching video details:", error);
    }
};


const basicSlice = createSlice({
    name: "basic",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTrendingVideos.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchTrendingVideos.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.video = action.payload;
            })
            .addCase(fetchTrendingVideos.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    },
});


export default basicSlice.reducer;
