import { configureStore } from "@reduxjs/toolkit";
import BasicSliec from "../Slice/BasicSliec";
import VideoSlice from "../Slice/VideoSlice";
import searchSlice from '../Slice/SearchSlice'
const store = configureStore({
    reducer: {
        basic: BasicSliec,
        video: VideoSlice,
        search: searchSlice
    },
    devTools: true
})


export default store;