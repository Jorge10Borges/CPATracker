import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { DateRangeProvider } from './context/DateRangeContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DateRangeProvider>
      <App />
    </DateRangeProvider>
  </StrictMode>
);
