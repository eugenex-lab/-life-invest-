// components/SkeletonCard.tsx

import React from "react";

const SkeletonCard: React.FC = () => {
  return (
    <div className="flex-shrink-0 w-80 flex flex-col justify-between shadow-md rounded-xl p-0 border-0 mx-1 animate-pulse bg-foreground">
      <div className="flex justify-between w-full flex-row items-center p-4">
        <div className="h-6 w-24 bg-gray-300 rounded"></div>
        <div className="h-6 w-16 bg-gray-300 rounded"></div>
      </div>
      <div className="p-4">
        <div className="h-8 w-32 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 w-24 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
