import React from 'react'
import ResetPassword from '@/app/Components/AuthComponents/resertPass'

export default function page({ params }: { params: { uid: string; token: string } }) {
  return (
    <>
        <div className="bg-[#f6f3fa]">
            <div className="container mx-auto p-4 flex items-center justify-center h-screen">
                <div className="max-w-md w-full">
                    <ResetPassword uid={params.uid} token={params.token}/>
                </div>
            </div>
        </div>
    </>
  )
}
