import React from 'react'

export default function TableUsers() {
  return (
    <>
        <div className='content'>
            <div className='container-table shadow-md sm:rounded-lg'>

                <table className='table-auto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                    <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                        <tr>
                            <th className='px-6 py-3'>Id</th>
                            <th className='px-6 py-3'>Nombre</th>
                            <th className='px-6 py-3'>Identificación</th>
                            <th className='px-6 py-3'>Organización</th>
                            <th className='px-6 py-3'>Rol</th>
                            <th className='px-6 py-3'>Estado</th>
                            <th className='px-6 py-3'>Email</th>
                            <th className='px-6 py-3'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700'>
                            <td className="px-6 py-4">
                                Silver
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </>
  )
}
