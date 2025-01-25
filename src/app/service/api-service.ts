// services/stockApi.ts

const API_KEY = "cdnv89aad3i5o5okm9l0cdnv89aad3i5o5okm9lg";
const BASE_URL = "https://finnhub.io/api/v1/quote";

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
