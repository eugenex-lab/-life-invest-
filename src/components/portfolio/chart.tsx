"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { chartData } from "@/lib/constant/sample";

const chartConfig = {
  stocks: {
    label: "Stocks",
    color: "#10B981", // Green for stocks
  },
  bonds: {
    label: "Bonds",
    color: "#3B82F6", // Blue for bonds
  },
  mutualFunds: {
    label: "Mutual Funds",
    color: "#8B5CF6", // Purple for mutual funds
  },
} satisfies ChartConfig;

export function ComponentChart() {
  const [timeRange, setTimeRange] = React.useState("12m");

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2025-01-01");
    let monthsToSubtract = 12;
    if (timeRange === "6m") {
      monthsToSubtract = 6;
    } else if (timeRange === "3m") {
      monthsToSubtract = 3;
    }
    const startDate = new Date(referenceDate);
    startDate.setMonth(startDate.getMonth() - monthsToSubtract);
    return date >= startDate;
  });

  return (
    <div>
      <div className="flex justify-between">
        <CardHeader>
          <CardTitle>
            {" "}
            <h2 className="text-xl font-bold ">
              {" "}
              <CardTitle>Investment Portfolio</CardTitle>
            </h2>
          </CardTitle>

          <CardDescription className="text-3xl font-bold text-accent-foreground">
            $270,980<span className="text-muted">.65 </span>
          </CardDescription>
          <CardDescription className=" flex items-start gap-1.5">
            <CardDescription className="text-sm">
              <div
                className={`inline-flex gap-2 self-end rounded p-1 ${"bg-green-100 text-green-600"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={"M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"}
                  />
                </svg>

                <span className="text-xs font-medium">21% </span>
              </div>
            </CardDescription>
            <span className="text-sm font-medium text-accent-foreground">
              +$39,117.67{" "}
            </span>
            in this year
          </CardDescription>
        </CardHeader>
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-2 sm:flex-row">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="w-[160px] rounded-lg sm:ml-auto"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 12 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="12m" className="rounded-lg">
                Last 12 months
              </SelectItem>
              <SelectItem value="6m" className="rounded-lg">
                Last 6 months
              </SelectItem>
              <SelectItem value="3m" className="rounded-lg">
                Last 3 months
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
      </div>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillStocks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillBonds" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMutualFunds" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="stocks"
              type="natural"
              fill="url(#fillStocks)"
              stroke="#10B981" // Explicit green for stocks
              stackId="a"
            />
            <Area
              dataKey="bonds"
              type="natural"
              fill="url(#fillBonds)"
              stroke="#3B82F6" // Explicit blue for bonds
              stackId="a"
            />
            <Area
              dataKey="mutualFunds"
              type="natural"
              fill="url(#fillMutualFunds)"
              stroke="#8B5CF6" // Explicit purple for mutual funds
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </div>
  );
}
