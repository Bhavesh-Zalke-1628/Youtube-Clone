import React, { useState } from "react";
import SearchBar from '../Component/SearchComponent';

const Layout = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [query, setQuery] = useState("");

    const handleSearch = (query) => {
        setQuery(query); // Pass the query to filter the videos or data
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false); // Close the menu when the close button is clicked
    };

    return (
        <div>
            {/* Navbar Section */}
            <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
                <div className="flex items-center">
                    <button
                        onClick={toggleMenu}
                        className="lg:hidden block p-2 text-white"
                    >
                        ☰
                    </button>
                    <span className="text-lg font-bold">Video App</span>
                </div>

                {/* Search bar - visible only on large screens */}
                <div className="hidden lg:block">
                    <SearchBar onSearch={handleSearch} />
                </div>
            </nav>

            {/* Sidebar menu - visible only on mobile */}
            <div
                className={`lg:hidden fixed top-0 left-0 w-64 h-full bg-gray-800 text-white transition-all ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex justify-between p-4 border-b border-gray-700">
                    <span className="text-lg font-bold">Menu</span>
                    <button
                        onClick={closeMenu}
                        className="text-white p-2"
                    >
                        ✖
                    </button>
                </div>
                <ul className="mt-8">
                    <li className="p-4 border-b border-gray-700">Home</li>
                    <li className="p-4 border-b border-gray-700">Trending</li>
                    <li className="p-4 border-b border-gray-700">Subscriptions</li>
                    {/* Add more menu items as needed */}
                </ul>
            </div>

            <main className="mt-6">{children}</main>
        </div>
    );
};

export default Layout;
