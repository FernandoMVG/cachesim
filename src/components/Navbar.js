// Navbar.js
import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between">
                <div className="flex space-x-4">
                    <NavLink to="/direct" className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">Direct Mapped</NavLink>
                    <NavLink to="/fully" className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">Fully Associative</NavLink>
                    <NavLink to="/set-associative" className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">Set Associative</NavLink>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

