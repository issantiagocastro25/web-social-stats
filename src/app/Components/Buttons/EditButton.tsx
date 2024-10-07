import React from 'react';

const EditButton = ({ onClick, text = 'Editar' }) => {
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2"
    >
      {text}
    </button>
  );
};

export default EditButton;