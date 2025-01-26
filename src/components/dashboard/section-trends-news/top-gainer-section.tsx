"use client";

import React, { useEffect, useState } from "react";
import TopGainers from "./top-gainer";
import TopGainersSkeleton from "./top-gainer-skeleton";
import {
  fetchHistoricalData,
  fetchTopGainersAndLosers,
  StockData,
} from "@/app/service/api-service";

const tickers = [
  "PEP",
  "ADBE",
  "CSCO",
  "ABBV",
  "CRM",
  "UBER",
  "AMD",
  "INTC",
  "JNJ",
  "AAPL",
  "MSFT",
  "GOOGL",
  "AMZN",
  "NVDA",
  "META",
  "TSLA",
  "GOOG",
  "SHOP",
  "COST",
  "NFLX",
];

const TopGainersSection: React.FC = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [historicalData, setHistoricalData] = useState<
    Record<string, { date: string; close: number }[]>
  >({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gainers = await fetchTopGainersAndLosers(tickers);
        setStocks(gainers);

        const historicalPromises = gainers.map(async (stock) => {
          const data = await fetchHistoricalData(stock.ticker);
          return { [stock.ticker]: data.slice(0, 10) };
        });

        const historicalResults = await Promise.all(historicalPromises);
        const historicalMap = Object.assign({}, ...historicalResults);
        setHistoricalData(historicalMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-h-80 overflow-y-scroll">
      <div className="space-y-1">
        {loading ? (
          <TopGainersSkeleton items={3} />
        ) : (
          stocks.map((stock, index) => (
            <TopGainers
              key={index}
              logoUrl={
                stock.ticker
                  ? `https://logo.clearbit.com/${stock.ticker.toLowerCase()}.com`
                  : "https://img.freepik.com/premium-photo/stock-market-trading-numbers-investment-money-stocks-grow-profit-financial-profits_55997-2343.jpg?w=2000"
              }
              name={stock.ticker}
              ticker={stock.ticker}
              price={`$${
                stock.current !== undefined && stock.current !== null
                  ? stock.current.toFixed(2)
                  : "N/A"
              }`}
              change={stock.percentChange}
              positive={stock.isProfit}
              chartData={historicalData[stock.ticker] || []}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TopGainersSection;
