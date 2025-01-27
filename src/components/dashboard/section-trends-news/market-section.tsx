"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import TopTickersSkeleton from "./top-tickers-skeleton";
import { useQuery } from "@tanstack/react-query";
import {
  fetchStockData,
  fetchStockProfile,
  StockData,
} from "@/app/service/api-service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { tickers } from "@/lib/constant/marquedata";
import MarketTickersTable from "./market-tickers";

// Fetch all stock data
const useStockData = () => {
  return useQuery<StockData[]>({
    queryKey: ["stocks"],
    queryFn: () => fetchStockData(tickers),
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Fetch profiles for stocks
const useStockProfiles = (stocks: StockData[]) => {
  return useQuery<
    Record<
      string,
      { name: string; logo: string; marketCap: string; sector: string }
    >
  >({
    queryKey: ["profiles", stocks.map((stock) => stock.ticker)],
    queryFn: async () => {
      const profilePromises = stocks.map((stock) =>
        fetchStockProfile(stock.ticker).then((profile) => ({
          [stock.ticker]: {
            name: profile.name,
            logo: profile.logo,
            marketCap: `$${profile.marketCap.toLocaleString()}`, // Format Market Cap
            sector: profile.sector,
          },
        }))
      );
      const profileResults = await Promise.all(profilePromises);
      return Object.assign({}, ...profileResults);
    },
    enabled: stocks.length > 0,
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

const MarketSection = () => {
  // State to manage the search query
  const [search, setSearch] = useState("");

  // Fetch stock data
  const { data: stocks = [], isLoading: stocksLoading } = useStockData();

  // Fetch profiles for stocks
  const { data: profiles = {}, isLoading: profilesLoading } =
    useStockProfiles(stocks);

  const loading = stocksLoading || profilesLoading;

  // Filter stocks based on search query
  const filteredStocks = search
    ? stocks.filter((stock) =>
        stock.ticker.toLowerCase().includes(search.toLowerCase())
      )
    : stocks;

  return (
    <div className="flex w-full">
      <Card className="p-6 w-full">
        <div>
          {/* Header Section */}
          <div className="flex justify-between items-center w-full pb-4 pt-1">
            <h2 className="text-xl font-bold">Markets</h2>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search stock by ticker..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm rounded-xl pr-10"
              />
              <Button
                onClick={() => setSearch("")}
                variant="outline"
                disabled={!search}
              >
                Clear
              </Button>
            </div>
          </div>

          {/* Table or Loading Skeleton */}
          <div className="space-y-1 lg:max-h-96 overflow-y-scroll">
            {loading ? (
              <TopTickersSkeleton items={10} />
            ) : (
              <MarketTickersTable
                stocks={filteredStocks}
                profiles={profiles}
                loading={loading}
              />
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MarketSection;
