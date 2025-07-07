import React from 'react';
import { GuestProvider } from './context/GuestContext';
import Routes from './routes/routes';

const App: React.FC = () => {
  return (
    <GuestProvider>
      <Routes />
    </GuestProvider>
  );
};

export default App;
