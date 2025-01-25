import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Button } from "../ui/button";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    // Initialize theme from localStorage or default to "dark"
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "dark";
    }
    return "dark"; // Default theme for SSR
  });

  useEffect(() => {
    // Apply the theme to the document when the component mounts
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <Button
      onClick={toggleTheme}
      variant={"link"}
      className={
        theme === "dark"
          ? "border-muted-foreground pl-[7px]"
          : "border-muted-foreground pl-[7px]"
      }
    >
      <Icon
        icon={theme === "dark" ? "fa6-solid:moon" : "iconamoon:mode-light-bold"}
        width="50"
        height="50"
        className={theme === "dark" ? "text-white" : "text-muted-foreground"}
      />
    </Button>
  );
};

export default ThemeToggle;
