// services/stockApi.ts

const API_KEY = "cuaimt9r01qof06ikrr0cuaimt9r01qof06ikrrg";

const API_KEY_2 = "cdnv89aad3i5o5okm9l0cdnv89aad3i5o5okm9lg";
const BASE_URL = "https://finnhub.io/api/v1/quote";

const ALPHA_BASE_URL = "https://www.alphavantage.co/query";
const ALPHA_API_KEY = "1YRHMCK6WFU5VHFC";
const ALPHA_API_KEY_3 = "J7F1UZ71FSXA8FYL";
const ALPHA_API_KEY_2 = "C8ZVL9ECM1XJB2BI";

const ALPHA_API_KEY_5 = "V84ULFERR202Z1NE";

// Define the type for stock data
export interface StockData {
  ticker: string;
  current: number;
  change: number;
  percentChange: number;
  isProfit: boolean;
}

export const fetchStockData = async (
  tickers: string[]
): Promise<StockData[]> => {
  try {
    const data = await Promise.all(
      tickers.map(async (ticker) => {
        const response = await fetch(
          `${BASE_URL}?symbol=${ticker}&token=${API_KEY}`
        );
        const result = await response.json();
        return {
          ticker,
          current: result.c, // Current price
          change: result.d, // Change
          percentChange: result.dp, // Percent change
          isProfit: result.d >= 0, // Positive or negative change
        };
      })
    );
    return data;
  } catch (error) {
    console.error("Error fetching stock data:", error);
    throw error; // Rethrow the error for handling in the component
  }
};

export const fetchTopGainersAndLosers = async (
  tickers: string[]
): Promise<{ gainers: StockData[]; losers: StockData[] }> => {
  try {
    const data = await Promise.all(
      tickers.map(async (ticker) => {
        const response = await fetch(
          `${BASE_URL}?symbol=${ticker}&token=${API_KEY_2}`
        );
        const result = await response.json();
        return {
          ticker,
          current: result.c, // Current price
          change: result.d, // Change
          percentChange: result.dp, // Percent change
          isProfit: result.d >= 0, // Positive or negative change
        };
      })
    );

    // Filter gainers and losers
    const gainers = data
      .filter((stock) => stock.isProfit)
      .sort((a, b) => b.percentChange - a.percentChange) // Sort by percent change descending
      .slice(0, 5); // Take the top 5 gainers

    const losers = data
      .filter((stock) => !stock.isProfit)
      .sort((a, b) => a.percentChange - b.percentChange) // Sort by percent change ascending
      .slice(0, 5); // Take the top 5 losers

    return { gainers, losers };
  } catch (error) {
    console.error("Error fetching stock data:", error);
    throw error;
  }
};

export const fetchHistoricalData = async (
  symbol: string
): Promise<{ date: string; close: number }[]> => {
  try {
    const response = await fetch(
      `${ALPHA_BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_API_KEY_2}`
    );
    const result = await response.json();

    if (result["Time Series (Daily)"]) {
      const timeSeries = result["Time Series (Daily)"];
      return Object.entries(timeSeries).map(([date, values]: any) => ({
        date,
        close: parseFloat(values["4. close"]),
      }));
    } else {
      throw new Error("Invalid response from Alpha Vantage");
    }
  } catch (error) {
    console.error("Error fetching historical data:", error);
    throw error; // Rethrow the error for handling in the component
  }
};
