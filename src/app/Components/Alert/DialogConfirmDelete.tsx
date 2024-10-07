import React, { useState } from 'react';

const DeleteConfirmation = ({ onDelete, itemName = 'registro' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    onDelete();
    setIsOpen(false);
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
      >
        Eliminar
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">¿Estás seguro?</h3>
            <p className="mb-4">
              Esta acción no se puede deshacer. Esto eliminará permanentemente el {itemName}.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteConfirmation;