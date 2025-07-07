import React from 'react';

interface WinnerBoxProps {
  name: string;
  divisi: string;
  npp: string;
}

const WinnerBox: React.FC<WinnerBoxProps> = ({ name, divisi, npp }) => {
  return (
    <div className="p-4 border rounded shadow-sm bg-white text-center">
      <p className="text-xl font-bold mb-1">{name}</p>
      <p className="text-gray-700 mb-1">{divisi}</p>
      <p className="text-gray-500">{npp}</p>
    </div>
  );
};

export default WinnerBox;
