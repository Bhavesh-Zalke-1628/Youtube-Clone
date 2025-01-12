import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Create an asynchronous thunk to fetch search results from the YouTube API
export const searchVideos = createAsyncThunk(
    'search/searchVideos',
    async (query) => {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${query}&type=video&key=YOUR_YOUTUBE_API_KEY`);
        const data = await response.json();
        return data.items;
    }
);

const searchSlice = createSlice({
    name: 'search',
    initialState: {
        query: '',
        results: [],
        status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
        error: null,
    },
    reducers: {
        setQuery: (state, action) => {
            state.query = action.payload; // Set the search query
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchVideos.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(searchVideos.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.results = action.payload;
            })
            .addCase(searchVideos.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { setQuery } = searchSlice.actions;

export default searchSlice.reducer;
