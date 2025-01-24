"use client";
import React, { useState } from "react";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarBody,
  SidebarBottom,
  SidebarLink,
} from "../ui/sidebar";
import { Icon } from "@iconify/react";
import ThemeToggle from "./theme-toggle";

export function SidebarLayout() {
  const links = [
    {
      label: "Dashboard",
      href: "/",
      icon: (
        <Icon
          icon="cuida:dashboard-outline"
          className="  h-6 w-6 flex-shrink-0"
        />
      ),
    },
    {
      label: "Portfolio",
      href: "/portfolio",
      icon: (
        <Icon
          icon="bytesize:portfolio"
          className="  h-6 w-6 flex-shrink-0"
        />
      ),
    },
  ];
  const [open, setOpen] = useState(true);
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1  mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "" // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden pt-6">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2 justify-center ml-0.5 space-y-3">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 justify-start  w-full items-start">
            <ThemeToggle />
            <SidebarBottom
              link={{
                label: "Eugene O",
                href: "#",
                icon: (
                  <Image
                    src="https://res.cloudinary.com/deuhwohof/image/upload/v1701971812/axmryn8p5va8i2x7tqes.jpg"
                    className="h-7 w-7  rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard />
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20 pl-1"
    >
      {/* <Icon
        icon="meteocons:pollen-grass-fill"
        className="h-14 w-20 flex-shrink-0 absolute -left-6 space-x-1"
      />{" "} */}
      <Image
        src="https://res.cloudinary.com/deuhwohof/image/upload/v1737727343/life-invest/LiveInvestLogo_ax7jcl.svg"
        alt="LiveInvest Logo"
        width={25} // specify the width
        height={25} // specify the height
        className=" "
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className=" text-black dark:text-white whitespace-pre font-medium "
      >
        Life Invest
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20 justify-center "
    >
      <Image
        src="https://res.cloudinary.com/deuhwohof/image/upload/v1737727343/life-invest/LiveInvestLogo_ax7jcl.svg"
        alt="LiveInvest Logo"
        width={25} // specify the width
        height={25} // specify the height
        className=""
      />
    </Link>
  );
};

// Dummy dashboard component with content
const Dashboard = () => {
  return (
    <div className="flex flex-1">
      <div className="p-2 md:p-10 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
        <div className="flex gap-2 flex-1">
          {[...new Array(2)].map((_, index) => (
            <div
              key={`second-array-${index}`} // Use the index as a unique identifier
              className="h-full w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"
            ></div>
          ))}
        </div>

        <div className="flex gap-2 flex-1">
          {[...new Array(2)].map((_, index) => (
            <div
              key={`second-array-${index}`} // Use the index as a unique identifier
              className="h-full w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};
