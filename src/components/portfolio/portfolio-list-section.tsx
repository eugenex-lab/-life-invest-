"use client";

import { useEffect, useState } from "react";

import {
  fetchStockData,
  fetchStockProfile,
  StockData,
} from "@/app/service/api-service";

import { Card } from "../ui/card";
import PortfolioTickersTable from "./market-tickers";
import TopTickersSkeleton from "../dashboard/section-trends-news/top-tickers-skeleton";

export const tickers = [
  "XOM", // ExxonMobil
  "TSLA", // Microsoft
  "AMZN", // Amazon
  "TSM", // Taiwan Semiconductor
  "UNH", // UnitedHealth Group
];

type StockProfile = {
  name: string;
  logo: string;
  marketCap: string;
  sector: string;
};

type Profiles = Record<string, StockProfile>;

// Utility to fetch stock and profile data

const PortfoiloListSection = () => {
  // State for search query, dynamically fetched stocks, and profiles
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [stocks, setStocks] = useState<StockData[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isDefault, setIsDefault] = useState(true); // Tracks whether to show default data
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchError, setSearchError] = useState(false); // Tracks whether the search resulted in no results

  // Default stocks and profiles
  const [defaultStocks, setDefaultStocks] = useState<StockData[]>([]);
  const [defaultProfiles, setDefaultProfiles] = useState<Record<string, any>>(
    {}
  );

  // Fetch default stock data on mount
  useEffect(() => {
    const fetchDefaults = async () => {
      setLoading(true);
      try {
        const stockData = await fetchStockData(tickers);
        const profileData = await Promise.all(
          tickers.map((ticker) => fetchStockProfile(ticker))
        );

        // Ensure TypeScript knows `acc` is of type `Profiles`
        const profiles = profileData.reduce<Profiles>((acc, profile) => {
          acc[profile.ticker] = {
            name: profile.name,
            logo: profile.logo,
            marketCap: `$${profile.marketCap.toLocaleString()}`,
            sector: profile.sector,
          };
          return acc;
        }, {}); // Initialize `acc` as an empty object of type `Profiles`

        setDefaultStocks(stockData);
        setDefaultProfiles(profiles); // `profiles` is now correctly typed
      } catch (error) {
        console.error("Error fetching default stocks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDefaults();
  }, []); // Run only once on mount

  // Handle search functionality

  // Stocks and profiles to display
  const stocksToDisplay = isDefault ? defaultStocks : stocks;
  const profilesToDisplay = isDefault ? defaultProfiles : profiles;

  return (
    <div className="flex w-full">
      <Card className="p-6 w-full">
        <div>
          {/* Header Section */}
          <div className="flex justify-between items-center w-full pb-4 pt-1 flex-wrap gap-4">
            <h2 className="text-xl font-bold">My Portfolio</h2>
          </div>

          {/* Table, Loading Skeleton, or Empty Message */}
          <div className="space-y-1 lg:max-h-96 overflow-y-scroll min-h-[100px]">
            {loading ? (
              <TopTickersSkeleton items={5} />
            ) : searchError ? (
              <div className="text-center text-mute mt-4">
                No stocks found for the entered symbol. Please try a valid
                ticker symbol.
              </div>
            ) : stocksToDisplay.length > 0 ? (
              <PortfolioTickersTable
                stocks={stocksToDisplay}
                profiles={profilesToDisplay}
                loading={loading}
              />
            ) : (
              <div className="text-center text-muted-foreground mt-4">
                No data to display.
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PortfoiloListSection;
