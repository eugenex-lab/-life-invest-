"use client";

import React from "react";
import { Card, CardContent } from "../../ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../../ui/avatar"; // Import Avatar components

import { Line, LineChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../ui/chart";

interface TopGainersProps {
  name: string;
  ticker: string;
  price: string;
  change: number;
  positive: boolean;
  logoUrl: string; // New prop for the logo URL
  chartData: { close: number }[]; // Historical chart data
}

// const chartData = [
//   { desktop: 186 },
//   { desktop: 305 },
//   { desktop: 237 },
//   { desktop: 73 },
//   { desktop: 209 },
//   { desktop: 214 },
// ];
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const TopTickers: React.FC<TopGainersProps> = ({
  name,
  ticker,
  price,
  change,
  positive,
  logoUrl,
  chartData,
}) => {
  // Dynamically set tsearche stroke color based on the `positive` prop
  const chartStrokeColor = positive
    ? "var(--green)" // Green for gainers
    : "var(--destruct)"; // Red for losers

  return (
    <Card className="border-border2 border-2 transition-all duration-200 dark:hover:bg-black hover:bg-foreground">
      <CardContent className="text-right flex flex-row justify-between p-4">
        {/* Logo Section with Avatar */}
        <div className="flex items-center w-full">
          <Avatar className="w-12 h-12 mr-2 p-1.5 bg-secondary-foreground">
            <AvatarImage
              className="rounded-full"
              src={
                logoUrl && logoUrl.trim() !== "" // Check if logoUrl is not empty
                  ? logoUrl
                  : "https://img.freepik.com/free-vector/financial-chart-globe-background-forex-trading-stock-market_1017-44838.jpg?t=st=1737928801~exp=1737932401~hmac=6ce624353995c162ea41441a00d69802349bde7e075efc4189512d98091531d2&w=2000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
              alt={`${name} logo`}
              onError={(e) => {
                e.currentTarget.src =
                  "https://img.freepik.com/free-vector/financial-chart-globe-background-forex-trading-stock-market_1017-44838.jpg?t=st=1737928801~exp=1737932401~hmac=6ce624353995c162ea41441a00d69802349bde7e075efc4189512d98091531d2&w=2000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"; // Fallback image on error
              }}
            />
            <AvatarFallback>
              <AvatarImage
                src={
                  "https://img.freepik.com/free-vector/financial-chart-globe-background-forex-trading-stock-market_1017-44838.jpg?t=st=1737928801~exp=1737932401~hmac=6ce624353995c162ea41441a00d69802349bde7e075efc4189512d98091531d2&w=2000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                }
                alt={`${name} fallback`}
              />
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col justify-start items-start">
            <div className="text-lg font-semibold">{name}</div>
            <h4 className="text-sm text-gray-500">{ticker}</h4>
          </div>
        </div>

        {/* Chart Section */}
        <div className="hidden xl:flex justify-center items-center w-full relative">
          <ChartContainer
            config={chartConfig}
            className="w-48 h-48 flex absolute mx-auto inset-0 -top-2"
          >
            <LineChart
              className=""
              accessibilityLayer
              data={chartData.map((d) => ({ close: d.close }))}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent className="" />}
              />
              <Line
                dataKey="close"
                type="linear"
                strokeWidth={2}
                dot={false}
                stroke={chartStrokeColor} // Dynamic stroke color
                activeDot={{
                  r: 6,
                }}
              />
            </LineChart>
          </ChartContainer>
        </div>

        {/* Price and Change Section */}
        <div>
          <p className="text-lg font-bold">{price}</p>
          <span
            className={`flex items-center ${
              positive ? "text-green-500" : "text-red-500"
            }`}
          >
            {positive ? (
              <ArrowUp className="mr-1" size={16} />
            ) : (
              <ArrowDown className="mr-1" size={16} />
            )}
            {Math.abs(change)}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopTickers;
