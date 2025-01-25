"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import Marquee from "react-fast-marquee";
import { fetchStockData } from "@/app/service/api-service";
import { handleError } from "@/app/service/err-handler";
import SkeletonCard from "./skeleton-marque";

type StockData = {
  ticker: string;
  isProfit: boolean;
  current: number;
  percentChange: number;
};

const tickers = [
  "AAPL",
  "MSFT",
  "GOOGL",
  "AMZN",
  "TSLA",
  "NVDA",
  "META",
  "NFLX",
  "AMD",
  "INTC",
];

const MarqueeStockList: React.FC = () => {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [error, setError] = useState<string | null>(null); // State to hold error messages
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    const getStockData = async () => {
      try {
        const data = await fetchStockData(tickers);
        setStockData(data);
        setError(null);
      } catch (error) {
        const errorMessage = handleError(error);
        setError(errorMessage);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    getStockData();
  }, []);
  return (
    <div className="min-h-[100px]">
      {" "}
      {/* Set a minimum height */}
      {loading ? (
        <Marquee speed={50} gradient={false} className="flex gap-6 rounded-xl">
          {Array.from({ length: 10 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </Marquee>
      ) : (
        <Marquee speed={50} gradient={false} className="flex gap-6 rounded-xl">
          {error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
            stockData.map((item) => (
              <Card
                key={item.ticker} // Use a unique key based on ticker
                className="flex-shrink-0 w-80 flex flex-col justify-between shadow-md rounded-xl p-0 border-0 mx-1"
              >
                <CardHeader className="flex justify-between w-full flex-row items-center">
                  <CardTitle className="text-lg font-semibold">
                    {item.ticker}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    <div
                      className={`inline-flex gap-2 self-end rounded p-1 ${
                        item.isProfit
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d={
                            item.isProfit
                              ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                              : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                          }
                        />
                      </svg>

                      <span className="text-xs font-medium">
                        {item.isProfit ? "Profit" : "Loss"}
                      </span>
                    </div>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-x-2">
                  <span className="text-2xl font-medium">
                    {item.current !== undefined && item.current !== null
                      ? `$${item.current.toFixed(2)}`
                      : "N/A"}
                  </span>
                  <span className="text-xs text-gray-500">
                    Change: (
                    {item.percentChange !== undefined &&
                    item.percentChange !== null
                      ? `${item.percentChange.toFixed(2)}%`
                      : "N/A"}
                    )
                  </span>
                </CardContent>
              </Card>
            ))
          )}
        </Marquee>
      )}
    </div>
  );
};

export default MarqueeStockList;
