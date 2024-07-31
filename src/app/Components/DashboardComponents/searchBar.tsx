import React from "react";

export default function SearchBar({ searchTerm, setSearchTerm }) {
    return (
        <div className="mb-4">
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border rounded w-full"
            />
        </div>
    );
}
