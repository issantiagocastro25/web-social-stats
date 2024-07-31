"use client";

import Dashboard from "@/app/Components/DashboardComponents/dashboard";
import { BarChartExampleWithGroups } from "@/app/Components/DashboardComponents/BarChartGraphic";
import React, { useState } from "react";

export default function DashboardPage() {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="dashboard p-6">
            <Dashboard searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <div className="mt-10">
                <BarChartExampleWithGroups />
            </div>
        </div>
    );
}
