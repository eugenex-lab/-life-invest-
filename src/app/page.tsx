import MarqueeList from "@/components/commons/marque-list";
import MarketSection from "@/components/dashboard/section-trends-news/market-section";
import SectionTwoLayout from "@/components/dashboard/section-trends-news/section-two-layout";

export default function Home() {
  return (
    <div className=" w-full space-y-6">
      <div className="w-full overflow-hidden h-34">
        <MarqueeList />
      </div>

      <div>
        <h1 className="text-5xl font-extrabold text-gray-800 dark:text-white">
          Dashboard
        </h1>
        <p className=" text-gray-600 dark:text-gray-300">
          Experience a new way to manage your investments
        </p>
      </div>

      <SectionTwoLayout />

      <MarketSection />
    </div>
  );
}
