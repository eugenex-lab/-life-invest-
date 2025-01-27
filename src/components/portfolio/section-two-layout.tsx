"use client";

import { BalanceSpread } from "./balance-spread";
import { TotalInvestment } from "./total-investment";

const SectionTwoLayout = () => {
  return (
    <div className="flex gap-4 pt-4 flex-wrap lg:flex-nowrap">
      {/* Top Tokens Section */}

      <BalanceSpread />
      <TotalInvestment />
    </div>
  );
};

export default SectionTwoLayout;
