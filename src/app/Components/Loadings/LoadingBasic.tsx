import React from 'react'

function LoadingBasic() {
  return (
    <>  
        <div role="status" className="animate-pulse">
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[640px] mb-2.5 mx-auto"></div>
            <div className="h-2.5 mx-auto bg-gray-300 rounded-full dark:bg-gray-700 mb-2.5 max-w-[540px]"></div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[640px] mb-2.5 mx-auto"></div>
            <div className="h-2.5 mx-auto bg-gray-300 rounded-full dark:bg-gray-700 mb-2.5 max-w-[540px]"></div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[640px] mb-2.5 mx-auto"></div>
            <div className="h-2.5 mx-auto bg-gray-300 rounded-full dark:bg-gray-700 mb-2.5 max-w-[540px]"></div>
            <span className="sr-only">Loading...</span>
        </div>
    </>
  )
}

export default LoadingBasic
