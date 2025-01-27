// services/stockApi.ts

const FINNHUB_API_KEY = "cub71j1r01qsc2sl1sjgcub71j1r01qsc2sl1sk0";
const FINNHUB_API_KEY_2 = "cdnv89aad3i5o5okm9l0cdnv89aad3i5o5okm9lg";
const FINNHUB_API_KEY_3 = "tomos95104@kurbieh.com";
const FINNHUB_API_KEY_4 = "cuaimt9r01qof06ikrr0cuaimt9r01qof06ikrrg";

const FINNHUB_BASE_URL = "https://finnhub.io/api/v1/quote";
const FINNHUB_PROFILE_URL = "https://finnhub.io/api/v1/stock/profile2";

const ALPHA_BASE_URL = "https://www.alphavantage.co/query";
const ALPHA_API_KEY = "1YRHMCK6WFU5VHFC";
const ALPHA_API_KEY_2 = "J7F1UZ71FSXA8FYL";
const ALPHA_API_KEY_3 = "5DCWJC1IF9XA03R6";
const ALPHA_API_KEY_4 = "C8ZVL9ECM1XJB2BI";

const ALPHA_API_KEY_5 = "V84ULFERR202Z1NE";

// Define the type for stock data
export interface StockData {
  ticker: string;
  current: number;
  change: number;
  percentChange: number;
  isProfit: boolean;
}

// Define the type for stock profile data
export interface StockProfile {
  ticker: string; // Stock ticker symbol
  name: string; // Name of the company
  sector: string; // Sector the company belongs to
  marketCap: number; // Market capitalization
  shareOutstanding: number; // Number of shares outstanding
  country: string; // Country the company is based in
  exchange: string; // Exchange the stock is traded on
  industry: string; // Industry the company belongs to
  logo: string; // Logo URL of the company
}

export const fetchStockData = async (
  tickers: string[]
): Promise<StockData[]> => {
  try {
    const data = await Promise.all(
      tickers.map(async (ticker) => {
        const response = await fetch(
          `${FINNHUB_BASE_URL}?symbol=${ticker}&token=${FINNHUB_API_KEY_4}`
        );
        const result = await response.json();
        console.log(`API Response for ${ticker}:`, result); // Log the response

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
): Promise<{ gainers: StockData[]; losers: StockData[]; all: StockData[] }> => {
  try {
    const data = await Promise.all(
      tickers.map(async (ticker) => {
        const response = await fetch(
          `${FINNHUB_BASE_URL}?symbol=${ticker}&token=${FINNHUB_API_KEY_2}`
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

    return { gainers, losers, all: data };
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

export const fetchStockProfile = async (
  symbol: string
): Promise<StockProfile> => {
  try {
    const response = await fetch(
      `${FINNHUB_PROFILE_URL}?symbol=${symbol}&token=${FINNHUB_API_KEY}`
    );
    const result = await response.json();

    if (result) {
      return {
        ticker: result.ticker || symbol,
        name: result.name || "Unknown",
        sector: result.finnhubIndustry || "Unknown",
        marketCap: result.marketCapitalization || 0,
        shareOutstanding: result.shareOutstanding || 0,
        country: result.country || "Unknown",
        exchange: result.exchange || "Unknown",
        industry: result.finnhubIndustry || "Unknown",
        logo: result.logo || "",
      };
    } else {
      throw new Error("Invalid response from Finnhub API");
    }
  } catch (error) {
    console.error("Error fetching stock profile data:", error);
    throw error;
  }
};
