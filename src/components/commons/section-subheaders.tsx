import React from "react";
import { Icon } from "@iconify/react";

interface TopStockEarnersProps {
  title?: string; // Optional prop to customize the title
  className?: string; // Optional prop to add custom styles
  icon?: string; // Optional prop for the icon
}

const SectionSubHeaders: React.FC<TopStockEarnersProps> = ({
  title = "Top Stock Earners",
  className = "",
  icon = "mdi:information-outline", // Default icon
}) => {
  return (
    <div className="flex flex-row  items-center gap-2 mb-6">
      <h2 className={`text-xl font-bold  ${className}`}>{title}</h2>
      <Icon icon={icon} className="w-6 h-6 text-border2" />
    </div>
  );
};

export default SectionSubHeaders;
