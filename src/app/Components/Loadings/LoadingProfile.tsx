import React from 'react'
import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";


function LoadingProfile() {
  return (
    <>  
        <div role="status" className="animate-pulse min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-7xl">
                {/* Sección 1 */}
                <div className="p-4 mb-6 my-4 shadow-lg rounded-lg bg-gray-200/15">
                    <div className="flex flex-col gap-4">
                        <div className="relative h-7 bg-gray-300 mb-2.5 rounded w-3/4"></div>
                        <div className="mb-5">
                            <div className="relative h-5 bg-gray-300 rounded-lg mb-4 w-full"></div>
                            <div className="relative h-5 bg-gray-300 rounded-lg w-full"></div>
                        </div>
                    </div>
                </div>

                {/* Sección 2 */}
                <div className="p-4 my-4 shadow-lg rounded-lg bg-gray-200/15">
                    <div className="flex flex-col gap-4">
                        <div className="relative h-7 bg-gray-300 mb-2.5 rounded w-3/4"></div>
                        <div className="mb-5">
                            <div className="relative h-5 bg-gray-300 rounded-lg mb-4 w-full"></div>
                            <div className="relative h-10 bg-gray-300 rounded-lg mb-4 w-full"></div>
                            <div className="relative h-10 bg-gray-300 rounded-lg w-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default LoadingProfile
