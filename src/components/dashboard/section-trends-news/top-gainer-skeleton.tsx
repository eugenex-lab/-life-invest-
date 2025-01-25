import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface TopGainersSkeletonProps {
  items?: number;
}

const TopGainersSkeleton: React.FC<TopGainersSkeletonProps> = ({
  items = 5,
}) => {
  return (
    <div className="space-y-4">
      {[...Array(items)].map((_, index) => (
        <Card key={index} className="p-6 border-2">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" /> {/* Logo */}
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" /> {/* Ticker/Name */}
              <Skeleton className="h-4 w-1/2" /> {/* Price/Change */}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TopGainersSkeleton;
