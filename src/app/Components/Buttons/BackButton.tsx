import React from 'react';

const BackButton = () => {
  const handleBackClick = () => {
    window.history.back(); // Regresar a la vista anterior
  };

  return (
    <button onClick={handleBackClick} className='mt-4 px-5 py-2 rounded-md bg-red-600/90 text-white hover:bg-red-700/90 focus:ring-4 focus:ring-red-300 transition-shadow shadow-md'>
      Regresar
    </button>
  );
};

export default BackButton;
