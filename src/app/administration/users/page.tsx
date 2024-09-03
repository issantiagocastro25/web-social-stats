import TableUsers from '@/app/Components/Admin/TableUsers'
import React from 'react'

export default function page() {
  return (
    <>
        <div className="bg-[#f6f3fa] h-screen">
            <div className="container mx-auto p-4 flex items-center justify-center">
                <div className="max-w-6xl w-full pt-10">
                    <TableUsers />
                </div>
            </div>
        </div>
    </>
  )
}
