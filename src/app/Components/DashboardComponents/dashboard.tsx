"use client";

import React from "react";
import CardList from "@/app/Components/DashboardComponents/CardList";
import SearchBar from "@/app/Components/DashboardComponents/searchBar";

interface DashboardProps {
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const Dashboard: React.FC<DashboardProps> = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="max-w-full m-10">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <CardList searchTerm={searchTerm} />
        </div>
    );
};

export default Dashboard;
