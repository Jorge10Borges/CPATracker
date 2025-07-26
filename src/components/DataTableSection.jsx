import React from "react";
import CardContainer from "./CardContainer";

const DataTableSection = ({
  title,
  toolbar,
  children,
  className = "",
}) => {
  return (
    <CardContainer className={`w-full ${className}`}>
      {title && (
        <h2 className="text-2xl font-bold mb-4 text-[#273958]">{title}</h2>
      )}
      {toolbar && (
        <div className="flex flex-wrap items-center gap-2 mb-4 bg-gray-100 p-3 rounded-lg border border-gray-200">
          {toolbar}
        </div>
      )}
      {children}
    </CardContainer>
  );
};

export default DataTableSection;
