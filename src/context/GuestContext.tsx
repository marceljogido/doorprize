import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { readExcel, Guest } from '../utils/excelReader';

interface GuestContextProps {
  guests: Guest[];
  setGuests: React.Dispatch<React.SetStateAction<Guest[]>>;
  fetchGuests: () => void;
  removeGuest: (guestName: string) => void;
  loadGuestsFromLocalStorage: () => void;
}

const GuestContext = createContext<GuestContextProps | undefined>(undefined);

export const GuestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchGuests = async () => {
    try {
      const response = await fetch('/template/doorprize-excel-template.xlsx');
      if (!response.ok) {
        throw new Error('Failed to fetch the file');
      }
      const arrayBuffer = await response.arrayBuffer();
      const guestsData = readExcel(arrayBuffer);
      setGuests(guestsData);
      localStorage.setItem('guests', JSON.stringify(guestsData));
      setError(null);
    } catch (err) {
      setError('Error reading file');
      console.error(err);
    }
  };

  const removeGuest = (guestName: string) => {
    setGuests((prevGuests) => {
      const updatedGuests = prevGuests.filter((guest) => guest.name !== guestName);
      localStorage.setItem('guests', JSON.stringify(updatedGuests));
      return updatedGuests;
    });
  };

  const loadGuestsFromLocalStorage = () => {
    const savedGuests = localStorage.getItem('guests');
    if (savedGuests) {
      setGuests(JSON.parse(savedGuests));
    } else {
      fetchGuests();
    }
  };

  useEffect(() => {
    loadGuestsFromLocalStorage();
  }, []);

  return (
    <GuestContext.Provider value={{ guests, setGuests, fetchGuests, removeGuest, loadGuestsFromLocalStorage }}>
      {children}
    </GuestContext.Provider>
  );
};

export const useGuests = (): GuestContextProps => {
  const context = useContext(GuestContext);
  if (!context) {
    throw new Error('useGuests must be used within a GuestProvider');
  }
  return context;
};
