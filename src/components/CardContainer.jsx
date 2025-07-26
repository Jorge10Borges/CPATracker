import React from "react";

const CardContainer = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-xl shadow p-6 max-w-8xl mx-auto my-0 border border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

export default CardContainer;
