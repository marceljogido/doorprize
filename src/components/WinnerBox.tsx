import React from 'react';

interface WinnerBoxProps {
  name: string;
  divisi: string;
  npp?: string; // NPP dibuat optional karena tidak ditampilkan
}

const WinnerBox: React.FC<WinnerBoxProps> = ({ name, divisi }) => {
  return (
    <div className="p-4 border rounded shadow-sm bg-white text-center">
      <p className="text-xl font-bold mb-1">{name}</p>
      <p className="text-gray-700 mb-1">{divisi}</p>
      {/* NPP disembunyikan dari tampilan pemenang */}
    </div>
  );
};

export default WinnerBox;
