"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface NewsCardProps {
  title: string;
  imageUrl: string;
  source: string;
  url: string;
}

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  imageUrl,
  source,
  url,
}) => {
  return (
    <Card className="border-border2 border-2 transition-all duration-200 bg-background hover:bg-foreground">
      <CardContent className="p-4 flex flex-col space-y-3">
        {/* Image */}
        <a href={url} target="_blank" rel="noopener noreferrer">
          <Image
            src={imageUrl}
            width={400}
            height={400}
            alt={title}
            className="w-full h-40 object-cover rounded-lg"
            onError={
              (e) =>
                (e.currentTarget.src =
                  "https://via.placeholder.com/150?text=No+Image") // Fallback image
            }
          />
        </a>

        {/* Title and Source */}
        <div className="flex flex-col justify-between flex-grow lg:h-[165px]">
          {/* Title */}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-semibold text-blue-600 hover:underline mb-2"
          >
            {title}
          </a>

          {/* Source */}
          <div className="text-sm text-gray-500 mt-auto">{source}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
