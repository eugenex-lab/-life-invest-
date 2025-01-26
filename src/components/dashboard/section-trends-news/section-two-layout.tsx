"use client";

import SectionSubHeaders from "@/components/commons/section-subheaders";
import { Card, CardContent } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
import TopGainers from "./top-gainer";
import { useEffect, useState } from "react";
import {
  fetchHistoricalData,
  fetchTopGainersAndLosers,
  StockData,
} from "@/app/service/api-service";
import TopGainersSkeleton from "./top-gainer-skeleton";
// import CustomScroller from "react-custom-scroller";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewsCard from "./news-card";
const tickers = [
  "AAPL", // Apple
  "MSFT", // Microsoft
  "GOOGL", // Alphabet (Google)
  "AMZN", // Amazon
  "META", // Meta Platforms (Facebook)
  "GOOG", // Alphabet Class C
  "SHOP", // Shopify
  "COST", // Costco
  "PEP", // PepsiCo
  "ADBE", // Adobe
  "CSCO", // Cisco
  "ABBV", // AbbVie
  "CRM", // Salesforce
  "UBER", // Uber
  "JNJ", // Johnson & Johnson
  "ORCL", // Oracle (replaces Netflix)
  "NVCR", // NovoCure (replaces Tesla)
  "AMD", // Advanced Micro Devices
  "BMY", // Bristol Myers Squibb (replaces Intel)
  "QCOM", // Qualcomm (replaces NVIDIA)
];

const newsData = [
  {
    title: "Apple Hits New All-Time High Amid Market Rally",
    imageUrl:
      "https://images.unsplash.com/photo-1627882278815-b5fca2d24ae5?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    source: "MarketWatch",
    url: "https://www.marketwatch.com/",
  },
  {
    title: "Tesla Faces Headwinds After Earnings Miss",
    imageUrl:
      "https://images.unsplash.com/photo-1617704548623-340376564e68?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    source: "CNBC",
    url: "https://www.cnbc.com/",
  },
  {
    title: "Amazon's Growth Strategy: Focus on Cloud and AI",
    imageUrl:
      "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    source: "The Verge",
    url: "https://www.theverge.com/",
  },
];

const SectionTwoLayout = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [historicalData, setHistoricalData] = useState<
    Record<string, { date: string; close: number }[]>
  >({});
  const [gainers, setGainers] = useState<StockData[]>([]);
  const [losers, setLosers] = useState<StockData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cachedData = localStorage.getItem("topGainersAndLoser");
        const cachedTimestamp = localStorage.getItem(
          "topGainersAndLosersTimestamp"
        );

        // Check if cached data exists and is valid (within 1 hour)
        if (cachedData && cachedTimestamp) {
          const isCacheValid =
            Date.now() - parseInt(cachedTimestamp, 10) < 60 * 60 * 1000; // 1 hour
          if (isCacheValid) {
            const { gainers, losers } = JSON.parse(cachedData);
            setGainers(gainers);
            setLosers(losers);
            setLoading(false);
            return;
          }
        }

        // If no valid cache, fetch new data
        const { gainers, losers } = await fetchTopGainersAndLosers(tickers);
        setGainers(gainers);
        setLosers(losers);

        // Cache the data and timestamp
        localStorage.setItem(
          "topGainersAndLoser",
          JSON.stringify({ gainers, losers })
        );
        localStorage.setItem(
          "topGainersAndLosersTimestamp",
          Date.now().toString()
        );
      } catch (error) {
        console.error("Error fetching gainers and losers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchDataHistorical = async () => {
      const cacheKey = "stocksDa";
      const cachedData = localStorage.getItem(cacheKey);
      const currentTime = Date.now();

      if (cachedData) {
        const { timestamp, stocks, historicalData } = JSON.parse(cachedData);
        if (currentTime - timestamp < 3600000) {
          // 1 hour in milliseconds
          setStocks(stocks); // Combined list of gainers and losers
          setHistoricalData(historicalData);
          setLoading(false);
          return;
        }
      }

      try {
        // Fetch both gainers and losers
        const { gainers, losers } = await fetchTopGainersAndLosers(tickers);
        const combinedStocks = [...gainers, ...losers]; // Combine gainers and losers
        console.log("Combined Stocks for Historical Data:", combinedStocks);

        setStocks(combinedStocks);
        setGainers(gainers);
        setLosers(losers);

        // Fetch historical data for all combined stocks
        const historicalPromises = combinedStocks.map(async (stock) => {
          const data = await fetchHistoricalData(stock.ticker);
          return { [stock.ticker]: data.slice(0, 10) }; // Limit to the last 10 records
        });

        const historicalResults = await Promise.all(historicalPromises);
        const historicalMap = Object.assign({}, ...historicalResults); // Combine historical data for all stocks
        setHistoricalData(historicalMap);

        // Cache combined data and historical data
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            timestamp: currentTime,
            stocks: combinedStocks,
            historicalData: historicalMap,
          })
        );
      } catch (error) {
        console.error(
          "Error fetching gainers, losers, or historical data:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDataHistorical();
  }, []);

  console.log("Historical Data:", historicalData);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
      {/* Top Tokens Section */}
      <Card className="p-6">
        <Tabs defaultValue="top-gainers" className="">
          <TabsList className="bg-transparent gap-2">
            <TabsTrigger
              className={"relative px-4 py-2 w-30"}
              style={{
                transformStyle: "preserve-3d",
              }}
              value="top-gainers"
            >
              Top Gainers{" "}
            </TabsTrigger>
            <TabsTrigger
              value="top-losers"
              className="data-[state=active]:text-destructive w-30 py-2"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              Top Losers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="top-gainers" className="pt-3">
            <div className="lg:max-h-80 overflow-y-scroll">
              <div className="space-y-1">
                {loading ? (
                  <TopGainersSkeleton items={3} />
                ) : (
                  gainers.map((stock, index) => (
                    <TopGainers
                      key={index}
                      logoUrl={
                        stock.ticker
                          ? `https://logo.clearbit.com/${stock.ticker.toLowerCase()}.com`
                          : "https://images.unsplash.com/photo-1726502102472-2108ef2a5cae?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
          </TabsContent>

          <TabsContent value="top-losers" className="">
            <div className="lg:max-h-80 overflow-y-scroll">
              <div className="space-y-1">
                {loading ? (
                  <TopGainersSkeleton items={3} />
                ) : (
                  losers.map((stock, index) => (
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
                      chartData={historicalData[stock.ticker] || []} // Use historical data for this stock
                    />
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>{" "}
      </Card>

      <Card className="p-6 ">
        <h2 className="text-xl font-bold mb-4">Latest News</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          {newsData.map((news, index) => (
            <NewsCard
              key={index}
              title={news.title}
              imageUrl={news.imageUrl}
              source={news.source}
              url={news.url}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SectionTwoLayout;
