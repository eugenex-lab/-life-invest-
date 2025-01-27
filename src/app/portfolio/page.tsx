// app/portfolio/page.tsx
import React from "react";
import MarqueeList from "@/components/commons/marque-list";
import SectionTwoLayout from "@/components/portfolio/section-two-layout";

const PortfolioPage = () => (
  <div className=" w-full space-y-6">
    <div className="w-full overflow-hidden h-34">
      <MarqueeList />
    </div>

    <div>
      <h1 className="text-5xl font-extrabold text-gray-800 dark:text-white">
        Portfolio
      </h1>
      <p className=" text-gray-600 dark:text-gray-300">
        Track your wins, and own your financial glow-up. 💹{" "}
      </p>
    </div>

    <SectionTwoLayout />
  </div>
);

export default PortfolioPage;
