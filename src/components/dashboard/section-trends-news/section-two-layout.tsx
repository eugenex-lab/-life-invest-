"use client";

import { Card } from "../../ui/card";
// import { Progress } from "@/components/ui/progress";
import TopTickers from "./top-tickers";
import { useEffect, useState } from "react";
import {
  fetchHistoricalData,
  fetchTopGainersAndLosers,
  StockData,
  fetchStockProfile,
} from "@/app/service/api-service";
import TopGainersSkeleton from "./top-tickers-skeleton";
// import CustomScroller from "react-custom-scroller";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import NewsCard from "./news-card";
import { newsData, tickers } from "@/lib/constant/marquedata";

const SectionTwoLayout = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [historicalData, setHistoricalData] = useState<
    Record<string, { date: string; close: number }[]>
  >({});
  const [gainers, setGainers] = useState<StockData[]>([]);
  const [losers, setLosers] = useState<StockData[]>([]);
  const [profiles, setProfiles] = useState<
    Record<string, { name: string; logo: string }>
  >({});

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

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const cacheKey = "stockProfiles";
        const cacheTimestampKey = "stockProfilesTimestamp";
        const cachedData = localStorage.getItem(cacheKey);
        const cachedTimestamp = localStorage.getItem(cacheTimestampKey);

        // Check if cache exists and is less than 30 minutes old
        if (cachedData && cachedTimestamp) {
          const isCacheValid =
            Date.now() - parseInt(cachedTimestamp, 10) < 30 * 60 * 1000; // 30 minutes
          if (isCacheValid) {
            console.log("Using cached stock profiles");
            setProfiles(JSON.parse(cachedData));
            return;
          }
        }

        // Fetch new profiles if no valid cache
        const combinedStocks = [...gainers, ...losers];
        console.log("Fetching profiles for stocks:", combinedStocks);

        const profilePromises = combinedStocks.map(async (stock) => {
          const profile = await fetchStockProfile(stock.ticker);
          console.log(`Fetched Profile for ${stock.ticker}:`, profile);
          return { [stock.ticker]: { name: profile.name, logo: profile.logo } };
        });

        const profileResults = await Promise.all(profilePromises);
        const profileMap = Object.assign({}, ...profileResults);

        // Save profiles to state and cache
        setProfiles(profileMap);
        localStorage.setItem(cacheKey, JSON.stringify(profileMap));
        localStorage.setItem(cacheTimestampKey, Date.now().toString());

        console.log("Profile Map:", profileMap);
      } catch (error) {
        console.error("Error fetching stock profiles:", error);
      }
    };

    if (gainers.length || losers.length) fetchProfiles();
  }, [gainers, losers]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
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
                    <TopTickers
                      key={index}
                      logoUrl={
                        profiles[stock.ticker]?.logo ||
                        "https://img.freepik.com/free-vector/financial-chart-globe-background-forex-trading-stock-market_1017-44838.jpg?t=st=1737928801~exp=1737932401~hmac=6ce624353995c162ea41441a00d69802349bde7e075efc4189512d98091531d2&w=2000"
                      }
                      ticker={profiles[stock.ticker]?.name || stock.ticker}
                      name={stock.ticker}
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

          <TabsContent value="top-losers">
            <div className="lg:max-h-[26rem]  overflow-y-scroll space-y-1">
              {loading ? (
                <TopGainersSkeleton items={3} />
              ) : (
                losers.map((stock, index) => (
                  <TopTickers
                    key={index}
                    logoUrl={
                      profiles[stock.ticker]?.logo ||
                      "https://img.freepik.com/free-vector/financial-chart-globe-background-forex-trading-stock-market_1017-44838.jpg?t=st=1737928801~exp=1737932401~hmac=6ce624353995c162ea41441a00d69802349bde7e075efc4189512d98091531d2&w=2000"
                    }
                    ticker={profiles[stock.ticker]?.name || stock.ticker}
                    name={stock.ticker}
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
