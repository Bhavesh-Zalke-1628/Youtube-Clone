import { configureStore } from "@reduxjs/toolkit";
import BasicSliec from "../Slice/BasicSliec";

const store = configureStore({
    reducer: {
        basic: BasicSliec
    },
    devTools: true
})


export default store;