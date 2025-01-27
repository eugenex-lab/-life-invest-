import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export function BalanceSpread() {
  return (
    <Card className="w-full  lg:w-[45%]">
      <CardHeader>
        <CardTitle>
          {" "}
          <h2 className="text-xl font-bold ">Total Assets</h2>
        </CardTitle>

        <CardDescription className="text-3xl font-bold text-accent-foreground">
          $325,980<span className="text-muted">.65 </span>
        </CardDescription>
        <CardDescription className=" flex items-center gap-1.5">
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

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <span className="text-sm font-medium">Distribution</span>

          <div className="flex flex-row gap-2 w-full">
            <div className="h-3 bg-accent w-[65%] rounded-[2px]" />
            <div className="h-3 bg-[#3B82F6] w-[25%] rounded-[2px]" />
            <div className="h-3 w-[10%] bg-purple-500 rounded-[2px]" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="border-b-2 pb-2">
            <div className="flex justify-between items-center">
              <div className="flex flex-row gap-3 items-center">
                <div className="rounded-full w-3 h-3 bg-accent"></div>
                <div className="flex flex-col ">
                  <span className="text-sm font-medium">Stocks</span>
                  <span className="text-sm font-medium text-muted">65%</span>
                </div>
              </div>

              <span className="text-sm font-medium">$211,887.42</span>
            </div>
          </div>
          <div className=" border-b-2 pb-2">
            <div className="flex justify-between items-center">
              <div className="flex flex-row gap-3 items-center">
                <div className="rounded-full w-3 h-3 bg-[#3B82F6]"></div>
                <div className="flex flex-col ">
                  <span className="text-sm font-medium">Bonds</span>
                  <span className="text-sm font-medium text-muted">25%</span>
                </div>
              </div>

              <span className="text-sm font-medium">$211,887.42</span>
            </div>
          </div>
          <div className=" pb-2">
            <div className="flex justify-between items-center">
              <div className="flex flex-row gap-3 items-center">
                <div className="rounded-full w-3 h-3 bg-purple-500"></div>
                <div className="flex flex-col ">
                  <span className="text-sm font-medium">Mutual Funds</span>
                  <span className="text-sm font-medium text-muted">65%</span>
                </div>
              </div>

              <span className="text-sm font-medium">$81,495.16</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
