import React from 'react';
import { Navbar } from 'flowbite-react';

function LoadingNavbar() {
  return (
    <>
      <Navbar fluid className="bg-white shadow-md">
        <Navbar.Brand href="/">
          <div className="animate-pulse bg-gray-300/45 h-8 sm:h-10 w-36 rounded"></div> {/* Placeholder for the logo */}
        </Navbar.Brand>
        <div className="flex md:order-2 items-center">
          <div className='animate-plus bg-gray-300/45 h-8 sm:h-10 w-28 rounded'></div>
        </div>
      </Navbar>
    </>
  );
}

export default LoadingNavbar;
