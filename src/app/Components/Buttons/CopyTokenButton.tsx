import { useState } from "react";

const TokenCopyComponent = ({ token }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
        const baseUrl = window.location.origin;
        const fullUrl = `${baseUrl}/payment?token=${token}`;
        await navigator.clipboard.writeText(fullUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Vuelve al estado original después de 2 segundos
    } catch (error) {
        console.error("Error al copiar el token", error);
    }
  };

  return (
    <div className="w-full max-w-[16rem]">
      <div className="relative">
        <input
          id="token-copy-button"
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 truncate block w-full p-2.5"
          value={token}
          disabled
          readOnly
        />
        <button
          onClick={handleCopy}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:bg-gray-100 rounded-lg p-2"
        >
          {isCopied ? (
            <svg
              className="w-4 h-4 text-green-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 16 12"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5.917 5.724 10.5 15 1.5"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 20"
            >
              <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
            </svg>
          )}
        </button>
      </div>
      {isCopied && (
        <p className="text-sm text-green-500 mt-1">¡Token copiado al portapapeles!</p>
      )}
    </div>
  );
};

export default TokenCopyComponent;
