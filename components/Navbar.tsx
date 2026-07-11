"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Rocket, Sun, Moon, User } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import AuthModal from "./auth/AuthModal";

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
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [userProfilePic, setUserProfilePic] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); 
  
  const rocketCanvasRef = useRef<HTMLCanvasElement>(null);

  // লোকাল স্টোরেজ চেক করার ফাংশন
  const checkLoginState = () => {
    setTimeout(() => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          // 🆕 এখন শুধু ডাটায় isLoggedIn ট্রু কিনা তা চেক করবে
          if (parsedUser.isLoggedIn !== false) {
            setIsLoggedIn(true);
            setUserProfilePic(parsedUser.profilePic || null);
          } else {
            // ডাটা আছে কিন্তু লগআউট করা
            setIsLoggedIn(false);
            setUserProfilePic(null);
          }
        } catch (e) {
          console.error("Error parsing user data");
          setIsLoggedIn(false);
          setUserProfilePic(null);
        }
      } else {
        setIsLoggedIn(false);
        setUserProfilePic(null);
      }
    }, 0);
  };

  useEffect(() => {
    setMounted(true);
    checkLoginState(); 

    window.addEventListener('userUpdated', checkLoginState);
    return () => window.removeEventListener('userUpdated', checkLoginState);
  }, []);

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

  const handleLinkHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.currentTarget.querySelector(".nav-text");
    if (target) {
      gsap.fromTo(
        target,
        { y: 0, opacity: 1 },
        { 
          y: -15, 
          opacity: 0, 
          duration: 0.2, 
          ease: "power2.in",
          onComplete: () => {
            gsap.fromTo(
              target,
              { y: 15, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.3, ease: "back.out(1.5)" }
            );
          }
        }
      );
    }
  };

  useEffect(() => {
    const canvas = rocketCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 60;
    canvas.height = 60;
    let particles: RocketParticle[] = [];
    let animationFrameId: number;

    const renderParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (Math.random() < 0.7) {
        particles.push({
          x: 24 + (Math.random() - 0.5) * 2,
          y: 36 + (Math.random() - 0.5) * 2,
          vx: -0.6 - Math.random() * 0.6, 
          vy: 0.6 + Math.random() * 0.6,  
          size: 1.5 + Math.random() * 2,
          alpha: 1,
          life: 0,
          maxLife: 10 + Math.random() * 8,
          type: 'flame',
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
          p.alpha = 1 - progress;
          ctx.save();
          ctx.globalAlpha = p.alpha;
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          grad.addColorStop(0, '#fde047');
          grad.addColorStop(1, '#ef4444');
          ctx.fillStyle = grad;
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
    return () => cancelAnimationFrame(animationFrameId);
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
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-between px-8 backdrop-blur-md bg-white/70 dark:bg-[#020617]/80 border-b border-slate-200 dark:border-white/10 transition-all duration-300">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-950/50 border border-cyan-500/30 group-hover:shadow-[0_0_15px_#00E5FF] transition-all duration-300">
            <div className="navbar-rocket relative flex items-center justify-center w-full h-full">
              <Rocket className="w-5 h-5 text-cyan-600 dark:text-[#00E5FF] relative z-10" />
              <canvas ref={rocketCanvasRef} className="absolute pointer-events-none z-0" style={{ width: '60px', height: '60px', top: '-10px', left: '-10px' }} />
            </div>
          </div>
          <span className="text-xl font-bold tracking-widest text-slate-900 dark:text-white uppercase font-sans">
            ALPHA
          </span>
        </Link>

        {isLoggedIn && (
          <nav className="hidden md:flex items-center gap-2 lg:gap-6 transition-all duration-500 animate-in fade-in slide-in-from-top-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  onMouseEnter={handleLinkHover}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 overflow-hidden flex items-center justify-center ${
                    isActive
                      ? "bg-cyan-100 dark:bg-cyan-950/40 text-cyan-700 dark:text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                      : "text-slate-600 dark:text-[#A1A1AA] hover:text-cyan-600 dark:hover:text-[#00E5FF] hover:bg-slate-100 dark:hover:bg-white/5"
                  }`}
                >
                  <span className="nav-text block">{link.name}</span>
                </Link>
              );
            })}
          </nav>
        )}

        <div className="flex items-center gap-4 lg:gap-6">
          {!isLoggedIn ? (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started
            </button>
          ) : (
            <>
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-full bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 transition-colors duration-300"
                >
                  {theme === "dark" ? <Sun className="w-5 h-5 text-orange-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
                </button>
              )}
              {/* Profile Icon / Image */}
              <Link 
                href="/profile"
                className="w-10 h-10 rounded-full border-2 border-cyan-500/30 hover:border-cyan-400 shadow-[0_0_10px_rgba(0,229,255,0.2)] bg-slate-100 dark:bg-slate-800 flex items-center justify-center cursor-pointer transition-all overflow-hidden"
              >
                {userProfilePic ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={userProfilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-slate-600 dark:text-[#00E5FF]" />
                )}
              </Link>
            </>
          )}
        </div>
      </header>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLoginSuccess={(userData) => {
          // 🆕 লগইন সফল হলে আগের সেভ করা ডাটা (ছবি, বায়ো) নতুন লগইনের সাথে মার্জ করা
          const storedStr = localStorage.getItem('user');
          let oldData: any = {};
          
          if (storedStr) {
            try {
              const parsed = JSON.parse(storedStr);
              // যদি একই ইমেইল দিয়ে আবার লগইন করে, তবেই আগের ছবি ও বায়ো রিস্টোর হবে
              if (parsed.email === userData.email) {
                oldData = parsed;
              }
            } catch (e) {}
          }

          const userToSave = { 
            ...oldData, // পুরোনো ছবি ও বায়ো
            ...userData, // নতুন লগইনের ডাটা
            isLoggedIn: true, // লগইন স্ট্যাটাস ট্রু 
            profilePic: oldData.profilePic || userData.profilePic || "" // ছবি না মুছে থাকলে সেটা ফিরিয়ে দিবে
          };

          localStorage.setItem('user', JSON.stringify(userToSave));
          checkLoginState();
          setIsAuthModalOpen(false);
        }}
      />
    </>
  );
}