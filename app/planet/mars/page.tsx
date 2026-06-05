"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Thermometer, Mountain, Clock, Orbit, Activity, Rocket, FileText, ExternalLink, Calendar, UploadCloud, X } from "lucide-react";

// কাস্টম হুক: নিখুঁত টাইপরাইটার অ্যানিমেশন তৈরি করার জন্য
function useTypewriter(text: string, speed: number = 40, delay: number = 0) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout; 

    const startTyping = () => {
      setIsTyping(true);
      let i = 0;
      interval = setInterval(() => {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, speed);
    };

    const timeout = setTimeout(startTyping, delay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, speed, delay]);

  return { displayedText, isTyping };
}

interface Star {
  id: number;
  top: string;
  left: string;
  animationDelay: string;
  size: string;
}

interface RocketParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  type: 'smoke';
}

// ---------------- ডেটা অ্যারে শুরু ---------------- //

const marsMissions = [
  { year: "1965", name: "Mariner 4", type: "Flyby" },
  { year: "1971", name: "Mars 2", type: "Orbiter & Lander" },
  { year: "1976", name: "Viking 1", type: "Lander" },
  { year: "1997", name: "Mars Pathfinder", type: "Rover" },
  { year: "2001", name: "Mars Odyssey", type: "Orbiter" },
  { year: "2004", name: "Spirit", type: "Rover" },
  { year: "2008", name: "Phoenix", type: "Lander" },
  { year: "2012", name: "Curiosity", type: "Active Rover" },
  { year: "2018", name: "InSight", type: "Lander" },
  { year: "2021", name: "Ingenuity", type: "Helicopter" },
  { year: "2023", name: "Hope Probe", type: "Orbiter" }
];

const researchPapers = [
  {
    id: 1,
    title: "Evidence of Ancient Water on Mars",
    author: "Malin, M. C., & Edgett, K. S.",
    date: "2000",
    journal: "Science",
    link: "https://astrobiology.nasa.gov/news/evidence-for-ancient-water-on-mars/?utm_source=chatgpt.com" 
  },
  {
    id: 2,
    title: "The history of Martian water: An isotopic perspective",
    author: "Jakosky, B. M., & Phillips, R. J.",
    date: "2001",
    journal: "Nature",
    link: "https://www.sciencedirect.com/science/article/pii/S001910351500175X?utm_source=chatgpt.com" 
  },

  {
    id: 3,
    title: "Methane Detection in Gale Crater",
    author: "Webster, C. R. et al.",
    date: "2015",
    journal: "Science",
    link: "https://www.science.org/doi/10.1126/science.1261713?utm_source=chatgpt.com" 
  },
    {
    id: 4,
    title: "Subsurface Ice Deposits in the Martian Mid-Latitudes",
    author: "Dundas, C. M. et al.",
    date: "2018",
    journal: "Science",
    link: "https://www.science.org/doi/10.1126/science.aao1619?utm_source=chatgpt.com" 
  },
  {
    id: 5,
    title: "Mars Atmospheric Evolution and Climate Change",
    author: "Kite, E. S.",
    date: "2019",
    journal: "Space Sci Rev",
    link: "https://www.nature.com/articles/35084184?utm_source=chatgpt.com" 
  },
  {
    id: 6,
    title: "Origin of Life on Mars",
    author: "Grotzinger, J. P.",
    date: "2021",
    journal: "Science",
    link: "https://www.mdpi.com/2075-1729/11/6/539?utm_source=chatgpt.com" 
  },
];

// 📊 গ্রাফের জন্য ডায়নামিক ডেটা (Hover করলে এই ডেটা শো করবে)
const atmosphereGraphData = [
  { x: 0, label: "1M", co2: 95.3, n2: 2.7, ar: 1.6 },
  { x: 20, label: "2M", co2: 94.8, n2: 2.9, ar: 1.8 },
  { x: 40, label: "3M", co2: 95.5, n2: 2.6, ar: 1.5 },
  { x: 60, label: "4M", co2: 94.9, n2: 2.8, ar: 1.7 },
  { x: 80, label: "5M", co2: 95.2, n2: 2.7, ar: 1.6 },
  { x: 100, label: "6M", co2: 95.3, n2: 2.8, ar: 1.6 },
];

// ---------------- ডেটা অ্যারে শেষ ---------------- //

export default function MarsPage() {
  const marsContainerRef = useRef<HTMLDivElement>(null);
  const rocketCanvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [stars, setStars] = useState<Star[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [activeGraphPoint, setActiveGraphPoint] = useState<number | null>(null);

  const tagText = useTypewriter("The Red Planet", 50, 500);
  const title1 = useTypewriter("MARS :", 80, 1500);
  const title2 = useTypewriter("The Red Frontier", 50, 2200);
  const paragraph = useTypewriter(
    "Our closest neighbor in the search for extraterrestrial life. Mars holds secrets of ancient water flows and potential microbial habitats beneath its rust-colored surface.",
    20,
    3500
  );

  useEffect(() => {
    const generatedStars = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      size: Math.random() > 0.5 ? 'w-1 h-1' : 'w-1.5 h-1.5'
    }));
    
    const timer = setTimeout(() => {
      setStars(generatedStars);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // 🎬 স্ক্রল করলে ভিডিও অটো-প্লে এবং পজ করার লজিক
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoElement.play().catch((err) => console.log("Auto-play prevented by browser: ", err));
          } else {
            videoElement.pause();
          }
        });
      },
      { threshold: 0.5 } 
    );

    observer.observe(videoElement);

    return () => {
      observer.unobserve(videoElement);
    };
  }, []);

  // 💨 শুধুমাত্র রকেটের স্মোক (Smoke) অ্যানিমেশন
  useEffect(() => {
    const canvas = rocketCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 160;
    canvas.height = 160;

    let particles: RocketParticle[] = [];
    let animationFrameId: number;

    const renderParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (Math.random() < 0.6) {
        particles.push({
          x: 52 + (Math.random() - 0.5) * 6,
          y: 104 + (Math.random() - 0.5) * 4,
          vx: -0.6 - Math.random() * 0.5 + (Math.random() - 0.5) * 0.4, 
          vy: 0.6 + Math.random() * 0.8,
          size: 4 + Math.random() * 5,
          alpha: 0.5,
          life: 0,
          maxLife: 50 + Math.random() * 20,
          type: 'smoke'
        });
      }

      particles = particles.filter(p => {
        p.life++;
        if (p.life >= p.maxLife) return false;

        const progress = p.life / p.maxLife;
        p.x += p.vx;
        p.y += p.vy;
        p.size += 0.25; 
        p.alpha = 0.5 * (1 - progress);

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = p.size * 0.8;
        ctx.shadowColor = 'rgba(148, 163, 184, 0.3)';
        ctx.fillStyle = 'rgba(156, 163, 175, 0.4)';

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        return true;
      });

      animationFrameId = requestAnimationFrame(renderParticles);
    };

    renderParticles();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  useGSAP(() => {
    gsap.fromTo(
      ".mars-system-scale",
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 2.5, ease: "back.out(1.1)" }
    );

    gsap.to(".mars-visual-wrapper", {
      y: -15,
      duration: 3.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1, 
    });

    gsap.to(".orbit-phobos", { rotation: 360, duration: 25, repeat: -1, ease: "none" });
    gsap.to(".orbit-deimos", { rotation: -360, duration: 40, repeat: -1, ease: "none" });

    gsap.to(".rocket-animated-wrapper", {
      x: 4,
      y: -4,
      duration: 2.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    if (stars.length > 0) {
      gsap.to(".star-node", {
        opacity: 0.1,
        duration: 0.6,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        stagger: 0.04
      });
    }
  }, { scope: marsContainerRef, dependencies: [stars] }); 

  return (
    <div 
      ref={marsContainerRef} 
      className="min-h-screen w-full bg-slate-50 dark:bg-[#0b101a] text-slate-900 dark:text-white relative overflow-x-hidden transition-colors duration-500"
    >
      <div className="fixed inset-0 pointer-events-none z-0">
        {stars.map((star) => (
          <div
            key={star.id}
            className={`star-node absolute bg-slate-400 dark:bg-white rounded-full ${star.size} opacity-80`}
            style={{
              top: star.top,
              left: star.left,
              animationDelay: star.animationDelay,
            }}
          />
        ))}
      </div>

      {/* --- হিরো সেকশন --- */}
      <section className="min-h-screen w-full max-w-7xl mx-auto flex items-center justify-center relative z-10 px-6 md:px-6 pt-24 md:pt-0">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          
          <div className="flex flex-col space-y-5 relative z-20">
            <div className="self-start">
              <span 
                className="inline-block px-5 py-2 rounded-full text-white text-xs md:text-sm font-bold uppercase tracking-widest transition-colors duration-300"
                style={{ backgroundColor: '#ff1e1e', boxShadow: '0 0 15px rgba(237, 21, 25, 0.4)' }}
              >
                {tagText.displayedText}
                {tagText.isTyping && <span className="animate-pulse ml-1">|</span>}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] text-slate-800 dark:text-slate-100 min-h-35 md:min-h-45 flex flex-col justify-center">
              <span className="uppercase block">
                {title1.displayedText}
                {title1.isTyping && <span className="animate-pulse">|</span>}
              </span>
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-red-500 via-orange-600 to-amber-500 dark:from-slate-200 dark:to-sky-200 mt-2">
                {title2.displayedText}
                {title2.isTyping && <span className="animate-pulse text-sky-500">|</span>}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-700 dark:text-slate-400 font-medium max-w-lg leading-relaxed min-h-30">
              {paragraph.displayedText}
              {paragraph.isTyping && <span className="animate-pulse ml-1 text-sky-500">|</span>}
            </p>
          </div>

          <div className="flex items-center justify-center relative h-100 md:h-150 pointer-events-none mt-10 md:mt-0">
            <div className="transform scale-[0.6] md:scale-[0.85] xl:scale-100 flex items-center justify-center absolute">
              <div className="mars-system-scale flex items-center justify-center origin-center">
                <div className="mars-visual-wrapper relative flex items-center justify-center w-125 h-125">
                  <div className="orbit-phobos absolute rounded-full border border-slate-300 dark:border-white/10 pointer-events-none flex items-center justify-center"
                       style={{ width: "380px", height: "380px" }}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-400 rounded-full shadow-[0_0_10px_rgba(148,163,184,0.6)]" />
                  </div>
                  <div className="orbit-deimos absolute rounded-full border border-slate-400/50 dark:border-white/10 border-dashed pointer-events-none flex items-center justify-center"
                       style={{ width: "500px", height: "500px" }}>
                    <div className="absolute bottom-0 right-1/2 translate-x-1/2 w-3 h-3 bg-slate-500 rounded-full shadow-[0_0_8px_rgba(100,116,139,0.5)]" />
                  </div>
                  <div
                    className="rounded-full relative overflow-hidden transition-transform duration-500 shadow-[0_15px_50px_rgba(14,165,233,0.15)] dark:shadow-[0_15px_50px_rgba(0,0,0,0.4)]"
                    style={{
                      width: "280px",
                      height: "280px",
                      backgroundColor: "#A14A36", 
                      boxShadow: "inset -25px -25px 50px rgba(0,0,0,0.6)",
                    }}
                  >
                    <div className="absolute top-1/4 left-1/4 w-20 h-12 rounded-full bg-black/20 blur-lg" />
                    <div className="absolute bottom-1/3 right-1/4 w-16 h-16 rounded-full bg-orange-950/40 blur-md" />
                    <div className="absolute top-1/2 right-8 w-10 h-10 rounded-full bg-black/25 blur-sm" />
                    <div className="absolute inset-0 bg-linear-to-br from-white/30 via-transparent to-black/70 rounded-full pointer-events-none mix-blend-overlay" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- ইনফো কার্ড এবং ভিডিও সেকশন --- */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 pb-24">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-[0_4px_20px_rgba(14,165,233,0.05)] hover:shadow-[0_8px_30px_rgba(14,165,233,0.15)] dark:shadow-none hover:-translate-y-1 transition-all duration-300">
            <Thermometer className="w-6 h-6 text-sky-500 dark:text-cyan-400 mb-4" />
            <h3 className="text-3xl font-black text-slate-800 dark:text-white">-63°C</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">Average Temperature</p>
          </div>
          <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-[0_4px_20px_rgba(14,165,233,0.05)] hover:shadow-[0_8px_30px_rgba(14,165,233,0.15)] dark:shadow-none hover:-translate-y-1 transition-all duration-300">
            <Mountain className="w-6 h-6 text-sky-500 dark:text-cyan-400 mb-4" />
            <h3 className="text-3xl font-black text-slate-800 dark:text-white">3.71 m/s²</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">Surface Gravity</p>
          </div>
          <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-[0_4px_20px_rgba(14,165,233,0.05)] hover:shadow-[0_8px_30px_rgba(14,165,233,0.15)] dark:shadow-none hover:-translate-y-1 transition-all duration-300">
            <Clock className="w-6 h-6 text-sky-500 dark:text-cyan-400 mb-4" />
            <h3 className="text-3xl font-black text-slate-800 dark:text-white">24.6 hrs</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">Day Length</p>
          </div>
          <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-[0_4px_20px_rgba(14,165,233,0.05)] hover:shadow-[0_8px_30px_rgba(14,165,233,0.15)] dark:shadow-none hover:-translate-y-1 transition-all duration-300">
            <Orbit className="w-6 h-6 text-sky-500 dark:text-cyan-400 mb-4" />
            <h3 className="text-3xl font-black text-slate-800 dark:text-white">2 Moons</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">Phobos & Deimos</p>
          </div>
        </div>

        {/* 🎬 Video Player */}
        <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 backdrop-blur-md rounded-4xl p-6 md:p-10 shadow-[0_10px_40px_rgba(14,165,233,0.1)] dark:shadow-lg mb-24 transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-8 h-8 text-sky-500 dark:text-cyan-400 animate-pulse" />
            <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Scientific Overview</h2>
          </div>
          <div className="w-full rounded-2xl overflow-hidden shadow-md bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/5 relative">
            <video 
              ref={videoRef}
              src="/videos/mars-overview.mp4" 
              controls 
              muted 
              playsInline
              preload="metadata"
              className="w-full h-auto aspect-video object-cover"
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <p className="mt-8 text-slate-700 dark:text-slate-300 leading-relaxed text-lg md:text-xl font-medium">
            Mars, the fourth planet from the Sun, has been the subject of intense scientific scrutiny for decades. Recent discoveries of recurring slope lineae and subsurface ice deposits have reignited hopes of finding past or present microbial life. The planet&apos;s thin atmosphere, composed primarily of carbon dioxide, and evidence of ancient river valleys suggest a dramatically different climate in Mars&apos; distant past.
          </p>
        </div>

        {/* --- Timeline Section --- */}
        <div className="mb-24">
          <div className="flex items-center gap-3 mb-10">
            <div className="relative inline-flex items-center justify-center rocket-animated-wrapper w-8 h-8">
              <Rocket className="w-8 h-8 text-sky-500 dark:text-cyan-400 relative z-10" />
              <canvas ref={rocketCanvasRef} className="absolute pointer-events-none z-0" style={{ width: '80px', height: '80px', top: '-24px', left: '-24px' }} />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tight">Satellite and Rover Missions</h2>
          </div>

          <div className="relative ml-2 md:ml-6 py-6">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-linear-to-b from-orange-400 via-red-400 to-rose-500 dark:from-amber-400 dark:via-purple-600 dark:to-blue-500 rounded-full shadow-[0_0_15px_rgba(14,165,233,0.4)]"></div>

            {marsMissions.map((mission, index) => (
              <div key={index} className="relative pl-10 md:pl-16 mb-6 group flex items-center">
                <div className="absolute -left-1.75 top-1/2 -translate-y-1/2 w-5 h-5 bg-teal-50 dark:bg-slate-900 border-4 border-teal-500 dark:border-cyan-400 rounded-full group-hover:bg-teal-500 dark:group-hover:bg-cyan-400 group-hover:shadow-[0_0_15px_rgba(20,184,166,0.6)] dark:group-hover:shadow-[0_0_15px_#0ea5e9] transition-all duration-300 z-10" />
                
                <div className="w-full bg-linear-to-br from-white to-teal-50/50 dark:from-slate-800/80 dark:to-slate-800/40 border border-teal-200/70 dark:border-white/5 rounded-xl p-5 shadow-sm shadow-teal-100/50 dark:shadow-none group-hover:shadow-[0_10px_30px_rgba(20,184,166,0.15)] dark:group-hover:shadow-[0_10px_30px_rgba(6,182,212,0.15)] group-hover:border-teal-400 dark:group-hover:border-cyan-500/50 transition-all duration-300 transform group-hover:-translate-y-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 w-full">
                    <div>
                      <h4 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-teal-600 dark:group-hover:text-cyan-300 transition-colors">
                        {mission.name}
                      </h4>
                      <span className="inline-block mt-2 px-3 py-1 bg-teal-100/50 dark:bg-slate-700 text-xs font-bold text-teal-700 dark:text-slate-300 rounded-full border border-teal-200 dark:border-transparent">
                        {mission.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-mono text-sm font-semibold bg-white/60 dark:bg-slate-900/50 px-4 py-2 rounded-lg border border-teal-100 dark:border-slate-700/50 w-fit">
                      <Calendar className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
                      {mission.year}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Research and Papers --- */}
        <div className="mb-24">
          <div className="flex items-center gap-3 mb-10">
            <FileText className="w-8 h-8 text-sky-500 dark:text-cyan-400" />
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tight">Research and Papers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {researchPapers.map((paper) => (
              <a 
                key={paper.id} 
                href={paper.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex flex-col bg-linear-to-br from-white to-blue-50/50 dark:from-slate-800/80 dark:to-slate-800/60 border border-teal-600 dark:border-slate-700 rounded-2xl p-5 shadow-sm shadow-blue-100/50 dark:shadow-none hover:shadow-[0_12px_35px_-10px_rgba(14,165,233,0.25)] dark:hover:shadow-[0_12px_35px_-10px_rgba(6,182,212,0.3)] hover:-translate-y-1.5 hover:border-blue-300 dark:hover:border-slate-600 transition-all duration-300 min-h-42.5"
              >
                <div className="mb-3">
                  <span className="text-[11px] font-bold text-blue-500 dark:text-cyan-400 uppercase tracking-wider bg-blue-100/50 dark:bg-slate-700/50 px-2 py-1 rounded-md">
                    {paper.journal} • {paper.date}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors">
                  {paper.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 grow">
                  By {paper.author}
                </p>
                <div className="mt-auto flex items-center justify-between text-sm font-semibold text-blue-600 dark:text-cyan-400">
                  <span>Read Paper</span>
                  <div className="bg-blue-100/50 dark:bg-slate-700/50 p-1.5 rounded-full group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-cyan-500 transition-all">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* --- সেকশন ১: Probability of Life --- */}
        <div className="mb-24 bg-white dark:bg-[#1a202c] rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white text-center mb-16 tracking-tight">Possibility of Life</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Side: Habitability Score (Ring Chart) */}
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-8">Habitability Score</h3>
              <div className="relative group flex flex-col items-center cursor-pointer">
                <svg className="w-52 h-52 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100 dark:text-slate-800"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-orange-500 transition-all duration-1000 ease-out"
                    strokeDasharray="42, 100" 
                    strokeWidth="4"
                    strokeLinecap="butt"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                
                <div className="mt-8 text-center">
                  <span className="text-5xl font-black text-orange-500 block">42%</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400 mt-2 block">Potential for microbial life</span>
                </div>

                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white dark:bg-white dark:text-slate-900 font-bold text-xs py-2 px-4 rounded-lg pointer-events-none whitespace-nowrap shadow-xl z-20">
                  Microbial Life Probability: 42%
                </div>
              </div>
            </div>

            {/* Right Side: Atmospheric Composition (Interactive Line Chart) */}
            <div className="flex flex-col items-center lg:items-start w-full">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-10 text-center w-full">Atmospheric Composition</h3>
              
              {/* 📈 Dynamic Line Graph Area */}
              <div className="relative w-full h-55 border-l-2 border-b-2 border-slate-300 dark:border-slate-700 flex flex-col justify-between pb-2 pl-2">
                
                {/* Y-axis labels (High contrast for Light Mode) */}
                <div className="absolute -left-8 top-0 text-xs font-semibold text-slate-700 dark:text-slate-400">100</div>
                <div className="absolute -left-6 top-[25%] text-xs font-semibold text-slate-700 dark:text-slate-400">75</div>
                <div className="absolute -left-6 top-[50%] text-xs font-semibold text-slate-700 dark:text-slate-400">50</div>
                <div className="absolute -left-6 top-[75%] text-xs font-semibold text-slate-700 dark:text-slate-400">25</div>
                <div className="absolute -left-4 bottom-0 text-xs font-semibold text-slate-700 dark:text-slate-400">0</div>

                {/* Background Grid Lines */}
                <div className="absolute top-[25%] left-0 right-0 border-t border-dashed border-slate-300 dark:border-slate-800 pointer-events-none" />
                <div className="absolute top-[50%] left-0 right-0 border-t border-dashed border-slate-300 dark:border-slate-800 pointer-events-none" />
                <div className="absolute top-[75%] left-0 right-0 border-t border-dashed border-slate-300 dark:border-slate-800 pointer-events-none" />

                {/* 1. SVG Line Chart Rendering */}
                <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                  {/* CO2 Line (Cyan) */}
                  <polyline
                    points={atmosphereGraphData.map(d => `${d.x},${100 - d.co2}`).join(" ")}
                    fill="none" stroke="#0ea5e9" strokeWidth="2.5" vectorEffect="non-scaling-stroke"
                  />
                  {/* N2 Line (Orange) */}
                  <polyline
                    points={atmosphereGraphData.map(d => `${d.x},${100 - d.n2}`).join(" ")}
                    fill="none" stroke="#f97316" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeDasharray="4 2"
                  />
                  {/* Ar Line (Blue) */}
                  <polyline
                    points={atmosphereGraphData.map(d => `${d.x},${100 - d.ar}`).join(" ")}
                    fill="none" stroke="#3b82f6" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeDasharray="2 2"
                  />
                  
                  {/* Dots for CO2 */}
                  {atmosphereGraphData.map((d, i) => (
                    <circle key={`co2-${i}`} cx={d.x} cy={100 - d.co2} r={activeGraphPoint === i ? "4" : "2.5"} fill="white" stroke="#0ea5e9" strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="transition-all duration-200" />
                  ))}
                  {/* Dots for N2 */}
                  {atmosphereGraphData.map((d, i) => (
                    <circle key={`n2-${i}`} cx={d.x} cy={100 - d.n2} r={activeGraphPoint === i ? "3" : "2"} fill="white" stroke="#f97316" strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="transition-all duration-200" />
                  ))}
                  {/* Dots for Ar */}
                  {atmosphereGraphData.map((d, i) => (
                    <circle key={`ar-${i}`} cx={d.x} cy={100 - d.ar} r={activeGraphPoint === i ? "3" : "2"} fill="white" stroke="#3b82f6" strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="transition-all duration-200" />
                  ))}
                </svg>

                {/* 2. Interactive Hover Zones */}
                {atmosphereGraphData.map((d, i) => {
                  const width = i === 0 || i === atmosphereGraphData.length - 1 ? 10 : 20;
                  const left = Math.max(0, d.x - (i === 0 ? 0 : 10));
                  
                  return (
                    <div
                      key={`zone-${i}`}
                      className="absolute top-0 bottom-0 z-20 cursor-crosshair"
                      style={{ left: `${left}%`, width: `${width}%` }}
                      onMouseEnter={() => setActiveGraphPoint(i)}
                      onMouseLeave={() => setActiveGraphPoint(null)}
                    />
                  );
                })}

                {/* 3. Hover Guide Line & Tooltip */}
                {activeGraphPoint !== null && (
                  <>
                    <div 
                      className="absolute top-0 bottom-0 w-px bg-slate-500 dark:bg-slate-400 pointer-events-none z-10 transition-all duration-100"
                      style={{ left: `${atmosphereGraphData[activeGraphPoint].x}%` }}
                    />
                    
                    {/* Tooltip Card */}
                    <div 
                      className="absolute -top-4 -translate-y-full -translate-x-1/2 bg-slate-800 dark:bg-white border border-slate-700 dark:border-slate-200 text-white dark:text-slate-900 p-3 rounded-xl shadow-2xl w-36 z-30 pointer-events-none transition-all duration-100"
                      style={{ left: `${atmosphereGraphData[activeGraphPoint].x}%` }}
                    >
                      <div className="text-xs font-bold mb-2 pb-1 border-b border-slate-600 dark:border-slate-300 text-center tracking-wide">
                        Month: {atmosphereGraphData[activeGraphPoint].label}
                      </div>
                      <div className="flex justify-between items-center text-sky-400 dark:text-sky-600 font-bold text-sm mb-1">
                        <span>CO₂</span> <span>{atmosphereGraphData[activeGraphPoint].co2}%</span>
                      </div>
                      <div className="flex justify-between items-center text-orange-400 dark:text-orange-600 font-bold text-sm mb-1">
                        <span>N₂</span> <span>{atmosphereGraphData[activeGraphPoint].n2}%</span>
                      </div>
                      <div className="flex justify-between items-center text-blue-400 dark:text-blue-600 font-bold text-sm">
                        <span>Ar</span> <span>{atmosphereGraphData[activeGraphPoint].ar}%</span>
                      </div>
                    </div>
                  </>
                )}

                {/* X-axis labels */}
                <div className="absolute -bottom-8 left-0 right-0 flex justify-between px-2 text-xs font-bold text-slate-700 dark:text-slate-400">
                  {atmosphereGraphData.map((d, i) => (
                    <span key={`x-label-${i}`}>{d.label}</span>
                  ))}
                </div>
              </div>

              {/* Data Summary Legend below chart */}
              <div className="flex justify-between w-full mt-14 px-4 relative z-0">
                <div className="text-center">
                  <div className="text-2xl font-black text-sky-500">~95%</div>
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-400">Carbon Dioxide</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-orange-500">2.7%</div>
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-400">Nitrogen</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-blue-500">1.6%</div>
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-400">Argon</div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* --- সেকশন ২: Future Colonization --- */}
        <div className="mb-24">
          <div className="bg-linear-to-r from-slate-800 to-slate-900 dark:from-[#1a2235] dark:to-[#111827] rounded-4xl p-10 md:p-16 text-center shadow-xl border border-slate-700/50">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Future Colonization</h2>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
              Join the mission to make humanity a multi-planetary species. The first human settlement on Mars could be established within the next two decades.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-3.5 bg-[#00E5FF] hover:bg-cyan-400 text-slate-900 font-bold rounded-full transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] transform hover:-translate-y-1"
            >
              Learn About Mars Missions
            </button>
          </div>
        </div>

      </section>

      {/* --- Modal / Pop-up for File Upload --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4 transition-opacity">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative border border-slate-200 dark:border-slate-700 transform scale-100 animate-in fade-in zoom-in duration-200">
            
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-4">Upload Research File</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-8 leading-relaxed">
              Please select your research file. After uploading, we will review it. Once it is verified, and if approved, your file will be published on the website.
            </p>

            <div className="mb-8">
              <div className="border-2 border-dashed border-sky-300 dark:border-slate-600 rounded-2xl p-8 text-center bg-sky-50/50 dark:bg-slate-800/30 hover:bg-sky-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  id="file-upload"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                />
                <div className="flex flex-col items-center justify-center gap-3 pointer-events-none">
                  <UploadCloud className="w-12 h-12 text-sky-500 dark:text-cyan-400" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Click to browse or drag file here
                  </span>
                  <span className="text-xs text-slate-500">Supported formats: PDF, DOCX (Max 10MB)</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsModalOpen(false)} 
              className="w-full py-3.5 bg-sky-500 hover:bg-sky-600 dark:bg-[#00E5FF] dark:hover:bg-cyan-400 dark:text-slate-900 text-white font-bold rounded-xl transition-all shadow-lg"
            >
              Submit File
            </button>
          </div>
        </div>
      )}

    </div>
  );
}