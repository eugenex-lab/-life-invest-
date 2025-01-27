"use client";

import React from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

// Props for a single row in the table
interface TopGainersProps {
  name: string;
  ticker: string;
  price: string;
  change: number;
  positive: boolean;
  logoUrl: string;
  marketCap: string;
  sector: string;
}

// Row component for a single stock
const MarketTickersRow: React.FC<TopGainersProps> = ({
  name,
  ticker,
  price,
  change,
  positive,
  logoUrl,
  marketCap,
  sector,
}) => {
  return (
    <TableRow>
      {/* Logo and Name */}
      <TableCell className="flex items-center space-x-3">
        <Avatar className="w-10 h-10 bg-secondary-foreground">
          <AvatarImage
            src={logoUrl || ""}
            alt={`${name} logo`}
            onError={(e) => {
              e.currentTarget.src =
                "https://img.freepik.com/free-vector/financial-chart-globe-background-forex-trading-stock-market_1017-44838.jpg";
            }}
          />
          <AvatarFallback>{ticker.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="text-lg font-semibold">{name}</div>
          <h4 className="text-sm text-muted-foreground">{ticker}</h4>
        </div>
      </TableCell>

      {/* Market Cap */}
      <TableCell>
        <div className="text-sm text-muted-foreground">Market Cap</div>
        <div className="font-medium">{marketCap}</div>
      </TableCell>

      {/* Price */}
      <TableCell>
        <div className="text-sm text-muted-foreground">Price</div>
        <div className="font-medium">{price}</div>
      </TableCell>

      {/* Change */}
      <TableCell>
        <div className="text-sm text-muted-foreground">Change</div>
        <div
          className={`flex items-center ${
            positive ? "text-green-500" : "text-red-500"
          }`}
        >
          {positive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          <span className="ml-1">{Math.abs(change)}%</span>
        </div>
      </TableCell>

      {/* Sector */}
      <TableCell>
        <div className="text-sm text-muted-foreground">Sector</div>
        <div className="font-medium">{sector}</div>
      </TableCell>

      {/* Actions */}
      <TableCell>
        <div className="flex space-x-2 justify-center">
          <Button variant="mute" size="sm" className="w-24 h-8" radius={"full"}>
            + Wishlist
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-24 h-9 hover:bg-primary"
            radius={"full"}
          >
            View
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

// Main table component
const MarketTickersTable: React.FC<{
  stocks: any[];
  profiles: Record<string, any>;
  loading: boolean;
}> = ({ stocks, profiles, loading }) => {
  return (
    <ScrollArea className="rounded-lg max-h-96 overflow-y-auto">
      <Table className="w-full text-left">
        <TableBody>
          {loading
            ? Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={6}>
                    <Skeleton className="h-10 w-full" />
                  </TableCell>
                </TableRow>
              ))
            : stocks.map((stock, index) => (
                <MarketTickersRow
                  key={index}
                  name={stock.ticker}
                  ticker={profiles[stock.ticker]?.name || stock.ticker}
                  logoUrl={
                    profiles[stock.ticker]?.logo ||
                    "https://img.freepik.com/free-vector/financial-chart-globe-background-forex-trading-stock-market_1017-44838.jpg"
                  }
                  price={`$${
                    stock.current !== undefined && stock.current !== null
                      ? stock.current.toFixed(2)
                      : "N/A"
                  }`}
                  change={stock.percentChange}
                  positive={stock.isProfit}
                  marketCap={profiles[stock.ticker]?.marketCap || "N/A"}
                  sector={profiles[stock.ticker]?.sector || "N/A"}
                />
              ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default MarketTickersTable;
