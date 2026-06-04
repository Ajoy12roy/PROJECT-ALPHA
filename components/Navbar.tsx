"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Rocket, Globe, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // হাইড্রেশন মিসম্যাচ এড়ানোর জন্য
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Mercury", path: "/planet/mercury" },
    { name: "Venus", path: "/planet/venus" },
    { name: "Earth", path: "/planet/earth" },
    { name: "Mars", path: "/planet/mars" },
    { name: "Jupiter", path: "/planet/jupiter" },
    { name: "Saturn", path: "/planet/saturn" },
    { name: "Uranus", path: "/planet/uranus" },
    { name: "Neptune", path: "/planet/neptune" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-between px-8 backdrop-blur-md bg-white/70 dark:bg-[#020617]/80 border-b border-slate-200 dark:border-white/10 transition-all duration-300">
      
      {/* Left Section: Logo & Brand */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-950/50 border border-cyan-500/30 group-hover:shadow-[0_0_15px_#00E5FF] transition-all duration-300">
          <Rocket className="w-5 h-5 text-cyan-600 dark:text-[#00E5FF] group-hover:-translate-y-1 transition-transform duration-300" />
        </div>
        <span className="text-xl font-bold tracking-widest text-slate-900 dark:text-white uppercase font-sans">
          ALPHA
        </span>
      </Link>

      {/* Center Section: Navigation Links */}
      <nav className="hidden md:flex items-center gap-2 lg:gap-6">
        {navLinks.map((link) => {
          const isActive = pathname === link.path;

          return (
            <Link
              key={link.name}
              href={link.path}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "bg-cyan-100 dark:bg-cyan-950/40 text-cyan-700 dark:text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                  : "text-slate-600 dark:text-[#A1A1AA] hover:text-cyan-600 dark:hover:text-[#00E5FF] hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Right Section: Explore & Theme Toggle */}
      <div className="flex items-center gap-6">
        <button className="flex items-center gap-2 group">
          <Globe className="w-5 h-5 text-slate-600 dark:text-[#A1A1AA] group-hover:text-cyan-600 dark:group-hover:text-[#00E5FF] transition-colors duration-300" />
          <span className="text-sm font-medium text-slate-600 dark:text-[#A1A1AA] group-hover:text-cyan-600 dark:group-hover:text-[#00E5FF] transition-colors duration-300">
            Explore
          </span>
        </button>

        {/* Theme Toggle Button */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 transition-colors duration-300"
            aria-label="Toggle Dark Mode"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700" />
            )}
          </button>
        )}
      </div>
    </header>
  );
}