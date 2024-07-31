"use client";
import React from "react";
import CardList from "@/app/Components/DashboardComponents/CardList";
import SearchBar from "@/app/Components/DashboardComponents/searchBar";

export default function Dashboard({ searchTerm, setSearchTerm }) {
    return (
        <div className="max-w-full m-10">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <CardList searchTerm={searchTerm} />
        </div>
    );
}
