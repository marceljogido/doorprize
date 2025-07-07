// components/ImportGuests.tsx
import React, { useState, useEffect } from 'react';
import { readExcel, Guest } from './excelReader';

const ImportGuests: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExcelFile = async () => {
      try {
        const response = await fetch('../template/guests.xlsx');
        if (!response.ok) {
          throw new Error('Failed to fetch the file');
        }
        const arrayBuffer = await response.arrayBuffer();
        const guestsData = await readExcel(arrayBuffer);
        setGuests(guestsData);
        setError(null);
      } catch (err) {
        setError('Error reading file');
        console.error(err);
      }
    };

    fetchExcelFile();
  }, []);

  return (
    <div>
      {error && <div>{error}</div>}
      <ul>
        {guests.map((guest, index) => (
          <li key={index}>
            {guest.name} - {guest.divisi} - {guest.npp}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ImportGuests;
