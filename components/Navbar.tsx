"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Rocket, Globe, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// রকেটের কণাগুলোর জন্য ইন্টারফেস
interface RocketParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  type: 'flame' | 'smoke';
  colorSeed: number;
}

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // অ্যানিমেশনের জন্য Ref
  const rocketCanvasRef = useRef<HTMLCanvasElement>(null);

  // হাইড্রেশন মিসম্যাচ এড়ানোর জন্য
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // 🚀 ফ্লোটিং অ্যানিমেশন (ডায়াগনাল: ওপর-ডান দিকে)
  useGSAP(() => {
    gsap.to(".navbar-rocket", {
      x: 5,
      y: -5,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  // 🔥 রকেটের ফ্ল্যাম এবং স্মোক পার্টিকেল সিস্টেম
  useEffect(() => {
    const canvas = rocketCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ক্যানভাসের সাইজ (লোগোর চেয়ে সামান্য বড় রাখা হয়েছে যাতে কণাগুলো বাইরে ছড়াতে পারে)
    canvas.width = 60;
    canvas.height = 60;

    let particles: RocketParticle[] = [];
    let animationFrameId: number;

    const renderParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // রকেটের নজল (Bottom-Left) পজিশন: X ≈ 24, Y ≈ 36
      
      // ১. আগুন (Flame) পার্টিকেল তৈরি
      if (Math.random() < 0.7) {
        particles.push({
          x: 24 + (Math.random() - 0.5) * 2,
          y: 36 + (Math.random() - 0.5) * 2,
          vx: -0.6 - Math.random() * 0.6, // বাঁ দিকে পুশ
          vy: 0.6 + Math.random() * 0.6,  // নিচের দিকে পুশ
          size: 1.5 + Math.random() * 2,
          alpha: 1,
          life: 0,
          maxLife: 10 + Math.random() * 8,
          type: 'flame',
          colorSeed: Math.random()
        });
      }

      // ২. ধোঁয়া (Smoke) পার্টিকেল তৈরি
      if (Math.random() < 0.5) {
        particles.push({
          x: 22 + (Math.random() - 0.5) * 3,
          y: 38 + (Math.random() - 0.5) * 3,
          vx: -0.3 - Math.random() * 0.4,
          vy: 0.3 + Math.random() * 0.4,
          size: 2 + Math.random() * 2.5,
          alpha: 0.5,
          life: 0,
          maxLife: 25 + Math.random() * 15,
          type: 'smoke',
          colorSeed: Math.random()
        });
      }

      particles = particles.filter(p => {
        p.life++;
        if (p.life >= p.maxLife) return false;

        const progress = p.life / p.maxLife;

        if (p.type === 'flame') {
          p.x += p.vx;
          p.y += p.vy;
          p.size += 0.05;
          p.alpha = 1 - progress;

          const flicker = 0.8 + Math.sin(p.life * 0.8) * 0.2;
          ctx.save();
          ctx.globalAlpha = p.alpha * flicker;

          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          if (p.colorSeed < 0.4) {
            grad.addColorStop(0, '#fde047'); // Yellow
            grad.addColorStop(0.5, '#f97316'); // Orange
            grad.addColorStop(1, '#ef4444'); // Red
          } else {
            grad.addColorStop(0, '#ffffff'); // White core
            grad.addColorStop(0.3, '#eab308'); // Yellow
            grad.addColorStop(1, '#dc2626'); // Red
          }

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          // স্মোক আপডেট
          p.x += p.vx;
          p.y += p.vy;
          p.size += 0.15;
          p.alpha = 0.4 * (1 - progress);

          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.shadowBlur = p.size * 0.5;
          ctx.shadowColor = 'rgba(148, 163, 184, 0.2)';
          ctx.fillStyle = 'rgba(156, 163, 175, 0.4)';

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        return true;
      });

      animationFrameId = requestAnimationFrame(renderParticles);
    };

    renderParticles();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
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
        <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-950/50 border border-cyan-500/30 group-hover:shadow-[0_0_15px_#00E5FF] transition-all duration-300">
          {/* Animated Rocket Wrapper */}
          <div className="navbar-rocket relative flex items-center justify-center w-full h-full">
            <Rocket className="w-5 h-5 text-cyan-600 dark:text-[#00E5FF] relative z-10" />
            <canvas 
              ref={rocketCanvasRef} 
              className="absolute pointer-events-none z-0" 
              style={{ width: '60px', height: '60px', top: '-10px', left: '-10px' }} 
            />
          </div>
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
              <Sun className="w-5 h-5 text-orange-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700" />
            )}
          </button>
        )}
      </div>
    </header>
  );
}