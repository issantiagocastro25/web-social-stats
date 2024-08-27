import React from 'react'
import FormYouTube from '@/app/Components/Admin/FormYouTube'

export default function page() {
  return (
    <>
        <div className="bg-[#f6f3fa]">
            <div className="container mx-auto p-4 flex items-center justify-center h-screen">
                <div className="max-w-md w-full">
                    <FormYouTube />
                </div>
            </div>
        </div>
    </>
  )
}
