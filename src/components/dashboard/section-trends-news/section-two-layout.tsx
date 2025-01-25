"use client";

import SectionSubHeaders from "@/components/commons/section-subheaders";
import { Card, CardContent } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
import TopGainers from "./top-gainer";
import { useEffect, useState } from "react";
import {
  fetchHistoricalData,
  fetchTopGainers,
  StockData,
} from "@/app/service/api-service";
import TopGainersSkeleton from "./top-gainer-skeleton";
// import CustomScroller from "react-custom-scroller";
const tickers = [
  "AAPL", // Apple
  "MSFT", // Microsoft
  "GOOGL", // Alphabet (Google)
  "AMZN", // Amazon
  "NVDA", // NVIDIA
  "META", // Meta Platforms (Facebook)
  "TSLA", // Tesla
  "GOOG", // Alphabet Class C
  "SHOP", // Shopify
  "COST", // Costco
  "NFLX", // Netflix
  "PEP", // PepsiCo
  "ADBE", // Adobe
  "CSCO", // Cisco
  "ABBV", // AbbVie
  "CRM", // Salesforce
  "UBER", // Uber
  "AMD", // Advanced Micro Devices
  "INTC", // Intel
  "JNJ", // Johnson & Johnson
];

const SectionTwoLayout = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [historicalData, setHistoricalData] = useState<
    Record<string, { date: string; close: number }[]>
  >({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cachedData = localStorage.getItem("topGainers");
        const cachedTimestamp = localStorage.getItem("topGainersTimestamp");

        // Check if cached data exists and is still valid (within 1 hour)
        if (cachedData && cachedTimestamp) {
          const isCacheValid =
            Date.now() - parseInt(cachedTimestamp, 10) < 60 * 60 * 1000; // 1 hour
          if (isCacheValid) {
            setStocks(JSON.parse(cachedData));
            setLoading(false);
            return;
          }
        }

        // If no valid cache, fetch new data
        const gainers = await fetchTopGainers(tickers); // Fetch top gainers
        setStocks(gainers);

        // Cache the data and timestamp
        localStorage.setItem("topGainers", JSON.stringify(gainers));
        localStorage.setItem("topGainersTimestamp", Date.now().toString());
      } catch (error) {
        console.error("Error fetching top gainers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchDataHistorical = async () => {
      const cacheKey = "stocksData";
      const cachedData = localStorage.getItem(cacheKey);
      const currentTime = Date.now();

      if (cachedData) {
        const { timestamp, stocks, historicalData } = JSON.parse(cachedData);
        if (currentTime - timestamp < 3600000) {
          // 1 hour in milliseconds
          setStocks(stocks);
          setHistoricalData(historicalData);
          setLoading(false);
          return;
        }
      }

      try {
        const gainers = await fetchTopGainers(tickers);
        setStocks(gainers);

        const historicalPromises = gainers.map(async (stock) => {
          const data = await fetchHistoricalData(stock.ticker);
          return { [stock.ticker]: data.slice(0, 10) };
        });

        const historicalResults = await Promise.all(historicalPromises);
        const historicalMap = Object.assign({}, ...historicalResults);
        setHistoricalData(historicalMap);

        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            timestamp: currentTime,
            stocks: gainers,
            historicalData: historicalMap,
          })
        );
      } catch (error) {
        console.error("Error fetching top gainers or historical data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataHistorical();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
      {/* Top Tokens Section */}

      <Card className="p-6">
        <SectionSubHeaders title="Top Gainers" />
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
                  name={stock.ticker} // Replace with company name if available
                  ticker={stock.ticker}
                  price={`$${
                    stock.current !== undefined && stock.current !== null
                      ? stock.current.toFixed(2)
                      : "N/A"
                  }`}
                  change={stock.percentChange}
                  positive={stock.isProfit}
                  chartData={historicalData[stock.ticker] || []} // Pass historical data
                />
              ))
            )}
          </div>
        </div>
      </Card>

      {/* Greed Index Section */}
      <div>
        <h2 className="text-xl font-bold mb-4">Greed Index</h2>
        <Card className="flex flex-col items-center justify-center h-full ">
          <CardContent className="flex flex-col items-center">
            <div className="text-4xl font-bold text-green-500">82</div>
            <p className="text-lg text-gray-600">Greed</p>
            {/* <Progress value={82} className="w-full mt-4" /> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SectionTwoLayout;
