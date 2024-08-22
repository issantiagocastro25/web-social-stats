import React from 'react'
import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";

function LoadingLogin() {
  return (
    <>  
        <div role="status" className="animate-pulse">
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <Card className="w-full max-w-sm p-4 shadow-lg rounded-lg bg-gray-200/15">
                    <div className="flex flex-col gap-4">
                    <div className="relative flex items-stretch justify-center h-7 bg-gray-300 mb-2.5 mx-auto"></div>
                        <div className='mb-5'>
                            <div className='relative flex items-stretch justify-center p-2 mb-4 w-full h-10 bg-gray-300 rounded-lg'></div>
                            <div className='relative flex items-stretch justify-center p-2 w-full h-10 bg-gray-300 rounded-lg'></div>
                        </div>
                        <div className='relative flex items-stretch justify-center p-2 w-full h-10 bg-gray-300 rounded'></div>
                    </div>
                </Card>
            </div>
        </div>
    </>
  )
}

export default LoadingLogin
