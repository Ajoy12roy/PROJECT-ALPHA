"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Thermometer, Mountain, Clock, Orbit, Activity, Rocket, FileText, ExternalLink, Calendar, UploadCloud, X, CheckCircle2 } from "lucide-react";

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

const uranusMissions = [
  { year: "1977", name: "Voyager 2 Launch", type: "Interplanetary Probe" },
  { year: "1986", name: "Voyager 2 Uranus Encounter", type: "Flyby" },
  { year: "1997", name: "Hubble Seasonal Monitoring", type: "Space Telescope" },
  { year: "2006", name: "Ring Structure Surveys", type: "Ground-Based Observations" },
  { year: "2014", name: "Atmospheric Dynamics Study", type: "Hubble Observations" },
  { year: "2020", name: "Ice Giant Mission Concepts", type: "Mission Design" },
  { year: "2023", name: "Uranus Orbiter Proposal", type: "Flagship Study" },
  { year: "2026", name: "Next-Generation Exploration", type: "Concept Development" },
];

const researchPapers = [
  {
    id: 1,
    title: "Voyager 2 Returns: Uranus at Close Range",
    author: "Smith, B. A., et al.",
    date: "1986",
    journal: "Science",
    link: "https://www.science.org/doi/10.1126/science.233.4760.43"
  },
  {
    id: 2,
    title: "Methane and the Clouds of Uranus",
    author: "Karkoschka, E.",
    date: "1998",
    journal: "Icarus",
    link: "https://www.sciencedirect.com/science/article/pii/S0019103598926882"
  },
  {
    id: 3,
    title: "Seasonal Change in Uranus' Atmosphere",
    author: "Sromovsky, L. A., et al.",
    date: "2014",
    journal: "Icarus",
    link: "https://www.sciencedirect.com/science/article/pii/S0019103514000384"
  },
  {
    id: 4,
    title: "The Ring System of Uranus: Structure and Dynamics",
    author: "de Pater, I., et al.",
    date: "2006",
    journal: "The Astronomical Journal",
    link: "https://iopscience.iop.org/article/10.1086/501031"
  },
  {
    id: 5,
    title: "Models of Uranus and Neptune Interiors",
    author: "Helled, R., et al.",
    date: "2011",
    journal: "Nature",
    link: "https://www.nature.com/articles/nature10342"
  },
];

const atmosphereGraphData = [
  { x: 0, label: "Cloud", h2: 82.8, he: 15.4, ch4: 1.8 },
  { x: 20, label: "Upper", h2: 83.1, he: 15.3, ch4: 1.6 },
  { x: 40, label: "Mid", h2: 83.4, he: 15.2, ch4: 1.4 },
  { x: 60, label: "Lower", h2: 82.6, he: 15.5, ch4: 1.9 },
  { x: 80, label: "Deep", h2: 83.0, he: 15.3, ch4: 1.7 },
  { x: 100, label: "Mantle", h2: 82.9, he: 15.4, ch4: 1.7 },
];

export default function UranusPage() {
  const uranusContainerRef = useRef<HTMLDivElement>(null);
  const rocketCanvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [stars, setStars] = useState<Star[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [activeGraphPoint, setActiveGraphPoint] = useState<number | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const tagText = useTypewriter("The Ice Giant", 50, 500);
  const title1 = useTypewriter("URANUS :", 80, 1500);
  const title2 = useTypewriter("The Tilted Ice Giant", 50, 2200);
  const paragraph = useTypewriter(
    "A pale azure world tipped nearly on its side. Uranus drifts through a frozen hydrogen-helium atmosphere with methane clouds swirling around a dense icy mantle.",
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
        ctx.shadowColor = 'rgba(79, 208, 231, 0.3)';
        ctx.fillStyle = 'rgba(148, 205, 219, 0.35)';

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
      ".uranus-system-scale",
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 2.5, ease: "back.out(1.1)" }
    );

    gsap.to(".uranus-visual-wrapper", {
      y: -15,
      duration: 3.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1,
    });

    gsap.to(".orbit-titania", { rotation: 360, duration: 25, repeat: -1, ease: "none" });
    gsap.to(".orbit-oberon", { rotation: -360, duration: 40, repeat: -1, ease: "none" });

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
  }, { scope: uranusContainerRef, dependencies: [stars] });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmitFile = async () => {
    if (!file || !name || !email) {
      alert("Please provide your name, email, and select a file.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("email", email);

    try {
      const response = await fetch("/api/research/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setIsModalOpen(false);
        setIsSuccessOpen(true);
        setFile(null);
        setName("");
        setEmail("");
      } else {
        const errorData = await response.json();
        alert(`Upload failed: ${errorData.error}`);
      }
    } catch (error) {
      alert("Error uploading file. Please try again later.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      ref={uranusContainerRef}
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

      <section className="min-h-screen w-full max-w-7xl mx-auto flex items-center justify-center relative z-10 px-6 md:px-6 pt-24 md:pt-0">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-center">

          <div className="flex flex-col space-y-5 relative z-20">
            <div className="self-start">
              <span
                className="inline-block px-5 py-2 rounded-full text-white text-xs md:text-sm font-bold uppercase tracking-widest transition-colors duration-300"
                style={{ backgroundColor: '#4fd0e7', boxShadow: '0 0 15px rgba(79, 208, 231, 0.4)' }}
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
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-sky-400 to-blue-500 dark:from-cyan-200 dark:to-sky-200 mt-2">
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
              <div className="uranus-system-scale flex items-center justify-center origin-center">
                <div className="uranus-visual-wrapper relative flex items-center justify-center w-125 h-125">
                  <div className="orbit-titania absolute rounded-full border border-slate-300 dark:border-white/10 pointer-events-none flex items-center justify-center"
                       style={{ width: "380px", height: "380px" }}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-400 rounded-full shadow-[0_0_10px_rgba(148,163,184,0.6)]" />
                  </div>
                  <div className="orbit-oberon absolute rounded-full border border-slate-400/50 dark:border-white/10 border-dashed pointer-events-none flex items-center justify-center"
                       style={{ width: "500px", height: "500px" }}>
                    <div className="absolute bottom-0 right-1/2 translate-x-1/2 w-3 h-3 bg-slate-500 rounded-full shadow-[0_0_8px_rgba(100,116,139,0.5)]" />
                  </div>
                  <div
                    className="rounded-full relative overflow-hidden transition-transform duration-500 shadow-[0_15px_50px_rgba(14,165,233,0.15)] dark:shadow-[0_15px_50px_rgba(0,0,0,0.4)]"
                    style={{
                      width: "280px",
                      height: "280px",
                      backgroundColor: "#72d2e9",
                      boxShadow: "inset -25px -25px 50px rgba(0,0,0,0.45)",
                    }}
                  >
                    <div className="absolute top-1/4 left-1/4 w-20 h-12 rounded-full bg-white/20 blur-lg" />
                    <div className="absolute bottom-1/3 right-1/4 w-16 h-16 rounded-full bg-slate-900/25 blur-md" />
                    <div className="absolute top-1/2 right-8 w-10 h-10 rounded-full bg-white/20 blur-sm" />
                    <div className="absolute inset-0 bg-linear-to-br from-white/30 via-transparent to-slate-900/70 rounded-full pointer-events-none mix-blend-overlay" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-[0_4px_20px_rgba(14,165,233,0.05)] hover:shadow-[0_8px_30px_rgba(14,165,233,0.15)] dark:shadow-none hover:-translate-y-1 transition-all duration-300">
            <Thermometer className="w-6 h-6 text-cyan-500 dark:text-sky-400 mb-4" />
            <h3 className="text-3xl font-black text-slate-800 dark:text-white">-195°C</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">Average Temperature</p>
          </div>
          <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-[0_4px_20px_rgba(14,165,233,0.05)] hover:shadow-[0_8px_30px_rgba(14,165,233,0.15)] dark:shadow-none hover:-translate-y-1 transition-all duration-300">
            <Mountain className="w-6 h-6 text-cyan-500 dark:text-sky-400 mb-4" />
            <h3 className="text-3xl font-black text-slate-800 dark:text-white">8.69 m/s²</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">Surface Gravity</p>
          </div>
          <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-[0_4px_20px_rgba(14,165,233,0.05)] hover:shadow-[0_8px_30px_rgba(14,165,233,0.15)] dark:shadow-none hover:-translate-y-1 transition-all duration-300">
            <Clock className="w-6 h-6 text-cyan-500 dark:text-sky-400 mb-4" />
            <h3 className="text-3xl font-black text-slate-800 dark:text-white">17.2 hrs</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">Rotation Period</p>
          </div>
          <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-[0_4px_20px_rgba(14,165,233,0.05)] hover:shadow-[0_8px_30px_rgba(14,165,233,0.15)] dark:shadow-none hover:-translate-y-1 transition-all duration-300">
            <Orbit className="w-6 h-6 text-cyan-500 dark:text-sky-400 mb-4" />
            <h3 className="text-3xl font-black text-slate-800 dark:text-white">27 Moons</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">Titania, Oberon & More</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 backdrop-blur-md rounded-4xl p-6 md:p-10 shadow-[0_10px_40px_rgba(14,165,233,0.1)] dark:shadow-lg mb-24 transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-8 h-8 text-cyan-500 dark:text-sky-400 animate-pulse" />
            <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Scientific Overview</h2>
          </div>
          <div className="w-full rounded-2xl overflow-hidden shadow-md bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/5 relative">
            <video
              ref={videoRef}
              src="/videos/uranus-overview.mp4"
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
            Uranus is the seventh planet from the Sun and one of two ice giants in our solar system. With a mean diameter of about 50,724 km and roughly 14.5 Earth masses, it orbits the Sun once every 84 Earth years. Its extreme axial tilt of about 98 degrees causes each pole to face the Sun for decades at a time, while methane in the upper atmosphere gives the planet its blue-green coloration. The only spacecraft to visit Uranus is Voyager 2, which revealed a tilted magnetic field, faint rings, and a complex atmospheric system.
          </p>
        </div>
        <div className="mb-24">
          <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 backdrop-blur-md rounded-4xl p-10 shadow-[0_10px_40px_rgba(14,165,233,0.08)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.4)] transition-all duration-300">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="max-w-3xl">
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tight">Explore 3D Model</h2>
                <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed text-lg md:text-xl">
                  Open a trusted interactive 3D simulation of Uranus to explore its tilted axis, ring system, and cloud layers in a new browser tab.
                </p>
              </div>
              <a
                href="https://eyes.nasa.gov/apps/solar-system/#/uranus"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 bg-cyan-500 text-white font-bold shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                Open 3D Model
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
        <div className="mb-24">          <div className="flex items-center gap-3 mb-10">
            <div className="relative inline-flex items-center justify-center rocket-animated-wrapper w-8 h-8">
              <Rocket className="w-8 h-8 text-cyan-500 dark:text-sky-400 relative z-10" />
              <canvas ref={rocketCanvasRef} className="absolute pointer-events-none z-0" style={{ width: '80px', height: '80px', top: '-24px', left: '-24px' }} />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tight">Exploration History</h2>
          </div>

          <div className="relative ml-2 md:ml-6 py-6">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-linear-to-b from-cyan-400 via-sky-400 to-blue-500 dark:from-cyan-300 dark:via-blue-500 dark:to-indigo-600 rounded-full shadow-[0_0_15px_rgba(14,165,233,0.4)]"></div>

            {uranusMissions.map((mission, index) => (
              <div key={index} className="relative pl-10 md:pl-16 mb-6 group flex items-center">
                <div className="absolute -left-1.75 top-1/2 -translate-y-1/2 w-5 h-5 bg-cyan-50 dark:bg-slate-900 border-4 border-cyan-400 dark:border-sky-400 rounded-full group-hover:bg-cyan-400 dark:group-hover:bg-sky-400 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all duration-300 z-10" />

                <div className="w-full bg-linear-to-br from-white to-cyan-50/50 dark:from-slate-800/80 dark:to-slate-800/40 border border-cyan-200/70 dark:border-white/5 rounded-xl p-5 shadow-sm shadow-cyan-100/50 dark:shadow-none group-hover:shadow-[0_10px_30px_rgba(34,211,238,0.15)] dark:group-hover:shadow-[0_10px_30px_rgba(56,189,248,0.15)] group-hover:border-cyan-400 dark:group-hover:border-sky-500/50 transition-all duration-300 transform group-hover:-translate-y-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 w-full">
                    <div>
                      <h4 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-sky-300 transition-colors">
                        {mission.name}
                      </h4>
                      <span className="inline-block mt-2 px-3 py-1 bg-cyan-100/60 dark:bg-slate-700 text-xs font-bold text-cyan-700 dark:text-slate-300 rounded-full border border-cyan-200 dark:border-transparent">
                        {mission.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-mono text-sm font-semibold bg-white/60 dark:bg-slate-900/50 px-4 py-2 rounded-lg border border-cyan-100 dark:border-slate-700/50 w-fit">
                      <Calendar className="w-4 h-4 text-cyan-600 dark:text-sky-400" />
                      {mission.year}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-24">
          <div className="flex items-center gap-3 mb-10">
            <FileText className="w-8 h-8 text-cyan-500 dark:text-sky-400" />
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tight">Research and Papers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {researchPapers.map((paper) => (
              <a
                key={paper.id}
                href={paper.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col bg-linear-to-br from-white to-blue-50/50 dark:from-slate-800/80 dark:to-slate-800/60 border border-cyan-600 dark:border-slate-700 rounded-2xl p-5 shadow-sm shadow-blue-100/50 dark:shadow-none hover:shadow-[0_12px_35px_-10px_rgba(14,165,233,0.25)] dark:hover:shadow-[0_12px_35px_-10px_rgba(6,182,212,0.3)] hover:-translate-y-1.5 hover:border-blue-300 dark:hover:border-slate-600 transition-all duration-300 min-h-42.5"
              >
                <div className="mb-3">
                  <span className="text-[11px] font-bold text-sky-500 dark:text-cyan-400 uppercase tracking-wider bg-sky-100/50 dark:bg-slate-700/50 px-2 py-1 rounded-md">
                    {paper.journal} • {paper.date}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 leading-snug group-hover:text-sky-600 dark:group-hover:text-cyan-300 transition-colors">
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

        <div className="mb-24 bg-white dark:bg-[#1a202c] rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white text-center mb-16 tracking-tight">Ice Giant Environment</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-8">Habitat Viability</h3>
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
                    className="text-sky-500 transition-all duration-1000 ease-out"
                    strokeDasharray="6, 100"
                    strokeWidth="4"
                    strokeLinecap="butt"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="mt-8 text-center">
                  <span className="text-5xl font-black text-sky-500 block">6%</span>
                  <span className="text-sm text-slate-700 dark:text-slate-400 mt-2 block">Extreme atmospheric conditions</span>
                </div>
                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white dark:bg-white dark:text-slate-900 font-bold text-xs py-2 px-4 rounded-lg pointer-events-none whitespace-nowrap shadow-xl z-20">
                  Atmospheric Survey Score: 6%
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center lg:items-start w-full">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-10 text-center w-full">Atmospheric Composition</h3>
              <div className="relative w-full h-55 border-l-2 border-b-2 border-slate-300 dark:border-slate-700 flex flex-col justify-between pb-2 pl-2">
                <div className="absolute -left-8 top-0 text-xs font-semibold text-slate-700 dark:text-slate-400">100</div>
                <div className="absolute -left-6 top-[25%] text-xs font-semibold text-slate-700 dark:text-slate-400">75</div>
                <div className="absolute -left-6 top-[50%] text-xs font-semibold text-slate-700 dark:text-slate-400">50</div>
                <div className="absolute -left-6 top-[75%] text-xs font-semibold text-slate-700 dark:text-slate-400">25</div>
                <div className="absolute -left-4 bottom-0 text-xs font-semibold text-slate-700 dark:text-slate-400">0</div>

                <div className="absolute top-[25%] left-0 right-0 border-t border-dashed border-slate-300 dark:border-slate-800 pointer-events-none" />
                <div className="absolute top-[50%] left-0 right-0 border-t border-dashed border-slate-300 dark:border-slate-800 pointer-events-none" />
                <div className="absolute top-[75%] left-0 right-0 border-t border-dashed border-slate-300 dark:border-slate-800 pointer-events-none" />

                <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <polyline
                    points={atmosphereGraphData.map(d => `${d.x},${100 - d.h2}`).join(" ")}
                    fill="none" stroke="#0ea5e9" strokeWidth="2.5" vectorEffect="non-scaling-stroke"
                  />
                  <polyline
                    points={atmosphereGraphData.map(d => `${d.x},${100 - d.he}`).join(" ")}
                    fill="none" stroke="#f97316" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeDasharray="4 2"
                  />
                  <polyline
                    points={atmosphereGraphData.map(d => `${d.x},${100 - d.ch4}`).join(" ")}
                    fill="none" stroke="#3b82f6" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeDasharray="2 2"
                  />
                  {atmosphereGraphData.map((d, i) => (
                    <circle key={`h2-${i}`} cx={d.x} cy={100 - d.h2} r={activeGraphPoint === i ? "4" : "2.5"} fill="white" stroke="#0ea5e9" strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="transition-all duration-200" />
                  ))}
                  {atmosphereGraphData.map((d, i) => (
                    <circle key={`he-${i}`} cx={d.x} cy={100 - d.he} r={activeGraphPoint === i ? "3" : "2"} fill="white" stroke="#f97316" strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="transition-all duration-200" />
                  ))}
                  {atmosphereGraphData.map((d, i) => (
                    <circle key={`ch4-${i}`} cx={d.x} cy={100 - d.ch4} r={activeGraphPoint === i ? "3" : "2"} fill="white" stroke="#3b82f6" strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="transition-all duration-200" />
                  ))}
                </svg>

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

                {activeGraphPoint !== null && (
                  <>
                    <div
                      className="absolute top-0 bottom-0 w-px bg-slate-500 dark:bg-slate-400 pointer-events-none z-10 transition-all duration-100"
                      style={{ left: `${atmosphereGraphData[activeGraphPoint].x}%` }}
                    />
                    <div
                      className="absolute -top-4 -translate-y-full -translate-x-1/2 bg-slate-800 dark:bg-white border border-slate-700 dark:border-slate-200 text-white dark:text-slate-900 p-3 rounded-xl shadow-2xl w-36 z-30 pointer-events-none transition-all duration-100"
                      style={{ left: `${atmosphereGraphData[activeGraphPoint].x}%` }}
                    >
                      <div className="text-xs font-bold mb-2 pb-1 border-b border-slate-600 dark:border-slate-300 text-center tracking-wide">
                        Zone: {atmosphereGraphData[activeGraphPoint].label}
                      </div>
                      <div className="flex justify-between items-center text-sky-400 dark:text-sky-600 font-bold text-sm mb-1">
                        <span>H₂</span> <span>{atmosphereGraphData[activeGraphPoint].h2}%</span>
                      </div>
                      <div className="flex justify-between items-center text-orange-400 dark:text-orange-600 font-bold text-sm mb-1">
                        <span>He</span> <span>{atmosphereGraphData[activeGraphPoint].he}%</span>
                      </div>
                      <div className="flex justify-between items-center text-blue-400 dark:text-blue-600 font-bold text-sm">
                        <span>CH₄</span> <span>{atmosphereGraphData[activeGraphPoint].ch4}%</span>
                      </div>
                    </div>
                  </>
                )}
                <div className="absolute -bottom-8 left-0 right-0 flex justify-between px-2 text-xs font-bold text-slate-700 dark:text-slate-400">
                  {atmosphereGraphData.map((d, i) => (
                    <span key={`x-label-${i}`}>{d.label}</span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between w-full mt-14 px-4 relative z-0">
                <div className="text-center">
                  <div className="text-2xl font-black text-sky-500">~83%</div>
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-400">Hydrogen</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-orange-500">~15%</div>
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-400">Helium</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-blue-500">~2%</div>
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-400">Methane</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-24">
          <div className="bg-linear-to-r from-slate-800 to-slate-900 dark:from-[#1a2235] dark:to-[#111827] rounded-4xl p-10 md:p-16 text-center shadow-xl border border-slate-700/50">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Future Ice Giant Discovery</h2>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
              Join the next generation of missions probing Uranus' tilted axis, icy mantle, and strange magnetosphere. The mysteries of the ice giant are a gateway to understanding planetary formation beyond the inner solar system.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-3.5 bg-[#00E5FF] hover:bg-cyan-400 text-slate-900 font-bold rounded-full transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] transform hover:-translate-y-1"
            >
              Learn About Uranus Missions
            </button>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4 transition-opacity">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative border border-slate-200 dark:border-slate-700 transform scale-100 animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-2xl font-black text-center text-slate-800 dark:text-white mb-4">Upload Uranus Research File</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
              Please enter your details and select your research file. Once approved, your file will be published on the website.
            </p>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-sky-500"
                required
              />
            </div>

            <div className="mb-6">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-sky-500"
                required
              />
            </div>

            <div className="mb-8">
              <div className="border-2 border-dashed border-sky-300 dark:border-slate-600 rounded-2xl p-8 text-center bg-sky-50/50 dark:bg-slate-800/30 hover:bg-sky-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  id="file-upload"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center gap-3 pointer-events-none">
                  <UploadCloud className="w-12 h-12 text-sky-500 dark:text-cyan-400" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {file ? file.name : "Click to browse or drag file here"}
                  </span>
                  <span className="text-xs text-slate-500">Supported formats: PDF, DOCX (Max 10MB)</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmitFile}
              disabled={isUploading}
              className={`w-full py-3.5 ${isUploading ? 'bg-sky-400 cursor-not-allowed' : 'bg-sky-500 hover:bg-sky-600'} dark:bg-[#00E5FF] dark:hover:bg-cyan-400 dark:text-slate-900 text-white font-bold rounded-xl transition-all shadow-lg`}
            >
              {isUploading ? "Submitting..." : "Submit File"}
            </button>
          </div>
        </div>
      )}

      {isSuccessOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/70 backdrop-blur-md px-4 transition-all duration-300">
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(0,229,255,0.25)] dark:shadow-[0_0_50px_rgba(0,229,255,0.15)] relative border border-slate-200 dark:border-slate-800/80 text-center transform scale-100 animate-in fade-in zoom-in-95 duration-300">
            <button
              onClick={() => setIsSuccessOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex flex-col items-center justify-center pt-4">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 dark:bg-cyan-500/20 animate-ping opacity-75 duration-1000" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 dark:from-[#00E5FF] dark:to-cyan-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 dark:shadow-cyan-500/20">
                <CheckCircle2 className="w-10 h-10 text-white animate-in zoom-in duration-300 delay-100" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-3 tracking-tight">
              Submission Successful!
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm font-medium mb-8 leading-relaxed max-w-sm">
              Your request has been submitted successfully. Please wait for the admin's decision.
            </p>
            <button
              onClick={() => setIsSuccessOpen(false)}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-[#00E5FF] dark:to-cyan-500 dark:text-slate-900 text-white font-bold rounded-xl transition-all shadow-md hover:opacity-95 active:scale-95"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
