import React from 'react'
import FormYouTube from '@/app/Components/Admin/FormYouTube'
import YouTubeBulkUpload from '@/app/Components/Admin/YouTubeBulkUpload'

export default function page() {
  return (
    <>
        <div className="bg-[#f6f3fa] h-screen">
            <div className="container mx-auto p-4 flex items-center justify-center">
                <div className="max-w-5xl w-full">
                    <YouTubeBulkUpload />
                </div>
            </div>
        </div>
    </>
  )
}
