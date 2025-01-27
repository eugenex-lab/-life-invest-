import { Card, CardContent } from "@/components/ui/card";
import { ComponentChart } from "./chart";

export function TotalInvestment() {
  return (
    <Card className="w-full ">
      <CardContent className="space-y-4 px-0 pb-0">
        <ComponentChart />
      </CardContent>
    </Card>
  );
}
