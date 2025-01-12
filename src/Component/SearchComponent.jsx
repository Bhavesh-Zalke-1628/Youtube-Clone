import React, { useState } from "react";
import { FaSearch } from "react-icons/fa"; // Importing a search icon from react-icons
import { useDispatch } from "react-redux";
import { setQuery, searchVideos } from '../Redux/Slice/SearchSlice' // Importing actions from the slice

const SearchBar = () => {
    const [input, setInput] = useState("");
    const dispatch = useDispatch();

    const handleSearch = () => {
        if (input.trim()) {
            dispatch(setQuery(input)); // Store the search query in the Redux state
            dispatch(searchVideos(input)); // Fetch search results
        }
    };

    return (
        <div className="flex items-center w-full max-w-4xl mx-auto bg-gray-100 rounded-full shadow-lg px-4 py-2 border border-gray-300 hover:shadow-xl transition-shadow duration-300">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Search for videos..."
                className="flex-grow bg-transparent text-gray-700 placeholder-gray-500 outline-none px-3 py-2 rounded-l-full focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
            <button
                onClick={handleSearch}
                className="flex items-center justify-center bg-red-500 text-white w-12 h-12 rounded-full hover:bg-red-600 transition-colors duration-300"
            >
                <FaSearch size={20} />
            </button>
        </div>
    );
};

export default SearchBar;
