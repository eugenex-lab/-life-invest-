import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonCard: React.FC = () => {
  return (
    <div className="w-80 animate-pulse">
      <div className="p-4 flex justify-between items-center">
        {/* Skeleton placeholders */}
        <Skeleton className="h-6 w-24 rounded" />
        <Skeleton className="h-6 w-16 rounded" />
      </div>
      <div className="p-4">
        {/* Skeleton placeholders */}
        <Skeleton className="h-8 w-32 rounded mb-2" />
        <Skeleton className="h-4 w-24 rounded" />
      </div>
    </div>
  );
};

export default SkeletonCard;
