"use client";

import React from "react";

import { ArrowUp, ArrowDown } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Icon } from "@iconify/react";

// Props for a single row in the table
interface TopGainersProps {
  name: string;
  ticker: string;
  price: string;
  change: number;
  positive: boolean;
  logoUrl: string;
  marketCap: string;
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
}) => {
  return (
    <TableRow>
      {/* Logo and Name */}
      <TableCell className="flex items-center space-x-3">
        <Avatar className="w-12 h-12 bg-secondary-foreground p-1.5">
          <AvatarImage
            src={logoUrl || ""}
            className="rounded-3xl"
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

      {/* Actions */}
      <TableCell className="">
        <div className="flex space-x-2 justify-center">
          <Popover>
            <PopoverTrigger>
              {" "}
              <Icon icon="fe:elipsis-h" className="w-6 h-6" />
            </PopoverTrigger>
            <PopoverContent className="flex justify-center gap-2">
              {" "}
              <Button
                variant="mute"
                size="sm"
                className="w-24 h-8"
                radius={"full"}
              >
                Buy More
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="w-24 h-8"
                radius={"full"}
              >
                Sell
              </Button>
              <Button size="sm" className="w-24 h-8 " radius={"full"}>
                View{" "}
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </TableCell>
    </TableRow>
  );
};

// Main table component
const PortfolioTickersTable: React.FC<{
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
                />
              ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default PortfolioTickersTable;
