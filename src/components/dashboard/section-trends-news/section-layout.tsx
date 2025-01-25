import { Card, CardHeader, CardContent } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
import { ArrowUp, ArrowDown } from "lucide-react";

const CryptoDashboard = () => {
  const tokens = [
    {
      name: "Ripple",
      ticker: "XRP",
      price: "$0.4831",
      change: 26.66,
      positive: true,
    },
    {
      name: "Ethereum",
      ticker: "ETH",
      price: "$2,968.31",
      change: 15.66,
      positive: true,
    },
    {
      name: "Solana",
      ticker: "SOL",
      price: "$132.38",
      change: -5.66,
      positive: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Top Tokens Section */}
      <div>
        <h2 className="text-xl font-bold mb-4">Top Tokens</h2>
        <div className="space-y-4">
          {tokens.map((token, index) => (
            <Card key={index}>
              <CardHeader className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="text-lg font-semibold">{token.name}</div>
                  <span className="text-sm text-gray-500">{token.ticker}</span>
                </div>
                <span
                  className={`flex items-center ${
                    token.positive ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {token.positive ? (
                    <ArrowUp className="mr-1" size={16} />
                  ) : (
                    <ArrowDown className="mr-1" size={16} />
                  )}
                  {Math.abs(token.change)}%
                </span>
              </CardHeader>
              <CardContent className="text-right">
                <p className="text-lg font-bold">{token.price}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Greed Index Section */}
      <div>
        <h2 className="text-xl font-bold mb-4">Greed Index</h2>
        <Card className="flex flex-col items-center justify-center h-full">
          <CardContent className="flex flex-col items-center">
            <div className="text-4xl font-bold text-green-500">82</div>
            <p className="text-lg text-gray-600">Greed</p>
            {/* <Progress value={82} className="w-full mt-4" /> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CryptoDashboard;
