import React, { createContext, useContext, useState } from "react";

const DateRangeContext = createContext();

export function DateRangeProvider({ children }) {
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  return (
    <DateRangeContext.Provider value={{ dateRange, setDateRange }}>
      {children}
    </DateRangeContext.Provider>
  );
}

export function useDateRange() {
  return useContext(DateRangeContext);
}
