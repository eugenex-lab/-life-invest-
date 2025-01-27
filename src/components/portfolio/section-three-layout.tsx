"use client";

import {
  fetchStockProfile,
  fetchTopGainersAndLosers,
  StockData,
} from "@/app/service/api-service";
import PortfoiloListSection, { tickers } from "./portfolio-list-section";
import TopGainersSkeleton from "@/components/dashboard/section-trends-news/top-tickers-skeleton";
import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import BestTickers from "./best-tickers";

const SectionTheeLayout = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const [gainers, setGainers] = useState<StockData[]>([]);
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
            const { gainers } = JSON.parse(cachedData);
            setGainers(gainers);
            setLoading(false);
            return;
          }
        }

        // If no valid cache, fetch new data
        const { gainers, losers } = await fetchTopGainersAndLosers(tickers);
        setGainers(gainers);

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
        const { timestamp } = JSON.parse(cachedData);
        if (currentTime - timestamp < 3600000) {
          // 1 hour in milliseconds
          setLoading(false);
          return;
        }
      }

      try {
        // Fetch both gainers and losers
        const { gainers, losers } = await fetchTopGainersAndLosers(tickers);
        const combinedStocks = [...gainers, ...losers]; // Combine gainers and losers
        // console.log("Combined Stocks for Historical Data:", combinedStocks);

        setGainers(gainers);

        // Fetch historical data for all combined stocks

        // Cache combined data and historical data
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            timestamp: currentTime,
            stocks: combinedStocks,
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
            // console.log("Using cached stock profiles");
            setProfiles(JSON.parse(cachedData));
            return;
          }
        }

        // Fetch new profiles if no valid cache
        const combinedStocks = [...gainers];
        // console.log("Fetching profiles for stocks:", combinedStocks);

        const profilePromises = combinedStocks.map(async (stock) => {
          const profile = await fetchStockProfile(stock.ticker);
          // console.log(`Fetched Profile for ${stock.ticker}:`, profile);
          return { [stock.ticker]: { name: profile.name, logo: profile.logo } };
        });

        const profileResults = await Promise.all(profilePromises);
        const profileMap = Object.assign({}, ...profileResults);

        // Save profiles to state and cache
        setProfiles(profileMap);
        localStorage.setItem(cacheKey, JSON.stringify(profileMap));
        localStorage.setItem(cacheTimestampKey, Date.now().toString());

        // console.log("Profile Map:", profileMap);
      } catch (error) {
        console.error("Error fetching stock profiles:", error);
      }
    };

    if (gainers.length) fetchProfiles();
  }, [gainers]);

  return (
    <div className="flex gap-4 pt-4 flex-wrap lg:flex-nowrap">
      {/* Top Tokens Section */}

      <PortfoiloListSection />

      <Card className=" w-[700px]  p-4">
        <div className="flex justify-between items-center w-full pb-4 pt-1 flex-wrap gap-4">
          <h2 className="text-xl font-bold">Watch List</h2>
        </div>
        <div className="overflow-y-scroll space-y-1 lg:max-h-[26rem]">
          {loading ? (
            <TopGainersSkeleton items={3} />
          ) : (
            gainers.map((stock, index) => (
              <BestTickers
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
              />
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default SectionTheeLayout;
