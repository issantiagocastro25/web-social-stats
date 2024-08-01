"use client";

import Register from "@/app/Components/AuthComponents/register";

export default function RegisterPage() {
    return (
        <>
            <div className="bg-[#f6f3fa]">
                <div className="container mx-auto p-4 flex items-center justify-center h-screen">
                    <div className="max-w-md w-full">
                        <Register></Register>
                    </div>
                </div>
            </div>
        </>
    )
}