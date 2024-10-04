import AdminPanel from '@/app/Components/Admin/AdminPanel'
import React from 'react'

export default function page() {
  return (
    <>
        <div className="bg-[#f6f3fa] min-h-screen">
          <div className="container mx-auto p-4">
            <AdminPanel />
          </div>
        </div>
    </>
  )
}
