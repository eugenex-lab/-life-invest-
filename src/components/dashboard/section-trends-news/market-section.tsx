"use client";

import { useState } from "react";
import { Card } from "../../ui/card";
import TopTickersSkeleton from "./top-tickers-skeleton";
import {
  fetchStockData,
  fetchStockProfile,
  StockData,
} from "@/app/service/api-service";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { tickers } from "@/lib/constant/marquedata";
import MarketTickersTable from "./market-tickers";

// Utility to fetch stock and profile data
const fetchStockBySymbol = async (symbol: string) => {
  try {
    const stockData = await fetchStockData([symbol]);
    const stockProfile = await fetchStockProfile(symbol);

    // Check for "Unknown" values in profile data
    if (
      !stockProfile.name ||
      stockProfile.name === "Unknown" ||
      !stockProfile.sector ||
      stockProfile.sector === "Unknown"
    ) {
      throw new Error("Invalid stock profile with unknown values.");
    }

    return {
      stock: stockData[0],
      profile: {
        [symbol]: {
          name: stockProfile.name,
          logo: stockProfile.logo,
          marketCap: `$${stockProfile.marketCap.toLocaleString()}`,
          sector: stockProfile.sector,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching stock data by symbol:", error);
    throw new Error("Could not fetch stock data for the entered symbol.");
  }
};

const MarketSection = () => {
  // State for search query, dynamically fetched stocks, and profiles
  const [search, setSearch] = useState("");
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [isDefault, setIsDefault] = useState(true); // Tracks whether to show default data
  const [searchError, setSearchError] = useState(false); // Tracks whether the search resulted in no results

  // Default stocks and profiles
  const [defaultStocks, setDefaultStocks] = useState<StockData[]>([]);
  const [defaultProfiles, setDefaultProfiles] = useState<Record<string, any>>(
    {}
  );

  // Fetch default stock data on mount
  useState(() => {
    const fetchDefaults = async () => {
      setLoading(true);
      try {
        const stockData = await fetchStockData(tickers);
        const profileData = await Promise.all(
          tickers.map((ticker) => fetchStockProfile(ticker))
        );

        const profiles = profileData.reduce((acc, profile) => {
          acc[profile.ticker] = {
            name: profile.name,
            logo: profile.logo,
            marketCap: `$${profile.marketCap.toLocaleString()}`,
            sector: profile.sector,
          };
          return acc;
        }, {});

        setDefaultStocks(stockData);
        setDefaultProfiles(profiles);
      } catch (error) {
        console.error("Error fetching default stocks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDefaults();
  }, []);

  // Handle search functionality
  const handleSearch = async () => {
    if (!search.trim()) return; // Prevent empty searches

    setLoading(true);
    setSearchError(false); // Reset error state before searching
    try {
      const symbol = search.toUpperCase();

      if (tickers.includes(symbol)) {
        const filteredStocks = defaultStocks.filter((stock) =>
          stock.ticker.toLowerCase().includes(search.toLowerCase())
        );

        setStocks(filteredStocks);
        setProfiles(defaultProfiles);

        if (filteredStocks.length === 0) {
          setSearchError(true); // No match found
        }
      } else {
        const { stock, profile } = await fetchStockBySymbol(symbol);

        if (stock && Object.keys(profile).length > 0) {
          setStocks([stock]);
          setProfiles(profile);
        } else {
          setSearchError(true); // No valid stock or profile found
        }
      }

      setIsDefault(false); // Switch to non-default view
    } catch (error) {
      console.error("Search failed:", error);
      setSearchError(true); // Handle failed search
      setStocks([]);
      setProfiles({});
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  // Reset to default stocks
  const handleReset = () => {
    setSearch("");
    setStocks([]);
    setProfiles({});
    setIsDefault(true);
    setSearchError(false); // Clear error state
  };

  // Stocks and profiles to display
  const stocksToDisplay = isDefault ? defaultStocks : stocks;
  const profilesToDisplay = isDefault ? defaultProfiles : profiles;

  return (
    <div className="flex w-full">
      <Card className="p-6 w-full">
        <div>
          {/* Header Section */}
          <div className="flex justify-between items-center w-full pb-4 pt-1 flex-wrap gap-4">
            <h2 className="text-xl font-bold">Markets</h2>
            <div className="flex items-center space-x-2 wrap">
              <Input
                placeholder="Search Stock by Ticker..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm rounded-xl pr-10"
              />
              <Button
                size={"lg"}
                onClick={handleSearch}
                variant="default"
                disabled={loading || !search.trim()}
              >
                Search
              </Button>
              <Button
                className="hidden md:block"
                size={"lg"}
                onClick={handleReset}
                variant="outline"
                disabled={loading}
              >
                Reset
              </Button>
            </div>
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
              <MarketTickersTable
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

export default MarketSection;
