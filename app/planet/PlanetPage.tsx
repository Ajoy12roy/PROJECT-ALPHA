"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  Thermometer,
  Mountain,
  Clock,
  Orbit,
  Activity,
  Rocket,
  FileText,
  ExternalLink,
  Calendar,
  UploadCloud,
  X,
  CheckCircle2,
  Download,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

export interface Star {
  id: number;
  top: string;
  left: string;
  animationDelay: string;
  size: string;
}

export interface RocketParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  type: "smoke";
}

export const iconMap = {
  Thermometer,
  Mountain,
  Clock,
  Orbit,
};

export type PlanetStat = {
  iconName: keyof typeof iconMap;
  value: string;
  label: string;
  detail: string;
};

export type PlanetMission = {
  year: string;
  name: string;
  type: string;
};

export type PlanetPaper = {
  id: number;
  title: string;
  author: string;
  date: string;
  journal: string;
  link: string;
};

export type AtmospherePoint = {
  x: number;
  label: string;
  main: number;
  secondary: number;
  tertiary: number;
};

export type FaqEntry = {
  question: string;
  answer: string;
};

export type PlanetPalette = {
  tagBg: string;
  tagShadow: string;
  accent: string;
  accentText: string;
  icon: string;
  secondaryIcon: string;
  graph1: string;
  graph2: string;
  graph3: string;
  calloutFrom: string;
  calloutTo: string;
  ringGlow: string;
};

export interface PlanetPageProps {
  planetName: string;
  heroTag: string;
  heroTitle: string;
  heroAccent: string;
  heroDescription: string;
  stats: PlanetStat[];
  overviewText: string;
  videoSrc: string;
  missions: PlanetMission[];
  papers: PlanetPaper[];
  atmospherePoints: AtmospherePoint[];
  gasSummary: { label: string; value: string; color: string }[];
  habitatScore: string;
  habitatLabel: string;
  environmentTitle: string;
  environmentDescription: string;
  calloutTitle: string;
  calloutDescription: string;
  buttonText: string;
  faq: FaqEntry[];
  references: { label: string; link: string }[];
  palette: PlanetPalette;
  modelLink?: string;
  showFaq?: boolean;
  showReferences?: boolean;
  visualExtras?: ReactNode;
}

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
        i += 1;
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

export default function PlanetPage({
  planetName,
  heroTag,
  heroTitle,
  heroAccent,
  heroDescription,
  stats,
  overviewText,
  videoSrc,
  missions,
  papers,
  atmospherePoints,
  gasSummary,
  habitatScore,
  habitatLabel,
  environmentTitle,
  environmentDescription,
  calloutTitle,
  calloutDescription,
  buttonText,
  faq,
  references,
  palette,
  modelLink,
  showFaq,
  showReferences,
  visualExtras,
}: PlanetPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
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
  const [uploadInProgress, setUploadInProgress] = useState(false); // ডুপ্লিকেট সাবমিশন প্রতিরোধ করা
  const [approvedPapers, setApprovedPapers] = useState<any[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<any | null>(null);
  const [imgZoom, setImgZoom] = useState(1);

  const shouldShowFaq = showFaq ?? true;
  const shouldShowReferences = showReferences ?? true;

  const heroTagText = useTypewriter(heroTag, 50, 500);
  const title1 = useTypewriter(heroTitle, 80, 1500);
  const title2 = useTypewriter(heroAccent, 50, 2200);
  const paragraph = useTypewriter(heroDescription, 20, 3500);

  useEffect(() => {
    const generatedStars = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      size: Math.random() > 0.5 ? "w-1 h-1" : "w-1.5 h-1.5",
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

    return () => observer.unobserve(videoElement);
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
          type: "smoke",
        });
      }

      particles = particles.filter((p) => {
        p.life += 1;
        if (p.life >= p.maxLife) return false;

        const progress = p.life / p.maxLife;
        p.x += p.vx;
        p.y += p.vy;
        p.size += 0.25;
        p.alpha = 0.5 * (1 - progress);

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = p.size * 0.8;
        ctx.shadowColor = "rgba(79, 208, 231, 0.3)";
        ctx.fillStyle = "rgba(148, 205, 219, 0.35)";

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

  // গ্রহের জন্য অনুমোদিত গবেষণা পেপার ফেচ করা (একবার, রি-রেন্ডার এড়ানো)
  useEffect(() => {
    const fetchApprovedPapers = async () => {
      try {
        const response = await fetch(`/api/research/get-approved?planet=${planetName}`);
        if (response.ok) {
          const data = await response.json();
          setApprovedPapers(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error fetching approved papers:", error);
      }
    };
    fetchApprovedPapers();
  }, [planetName]);

  useGSAP(() => {
    gsap.fromTo(
      ".planet-system-scale",
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 2.5, ease: "back.out(1.1)" }
    );

    gsap.to(".planet-visual-wrapper", {
      y: -15,
      duration: 3.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1,
    });

    gsap.to(".orbit-outer", { rotation: 360, duration: 25, repeat: -1, ease: "none" });
    gsap.to(".orbit-inner", { rotation: -360, duration: 40, repeat: -1, ease: "none" });

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
        stagger: 0.04,
      });
    }
  }, { scope: containerRef, dependencies: [stars] });

  // ফাইল টাইপ চেক করার ফাংশন
  const getFileType = (url: string) => {
    if (!url) return 'unknown';
    const extension = url.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(extension || '')) return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) return 'image';
    if (['mp4', 'webm', 'ogg'].includes(extension || '')) return 'video';
    return 'unknown';
  };

  // প্রিভিউ খোলার ফাংশন
  const openPreview = (e: React.MouseEvent, paper: any) => {
    e.preventDefault();
    setPreviewData(paper);
    setImgZoom(1);
    setIsPreviewOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmitFile = async () => {
    // ডুপ্লিকেট সাবমিশন প্রতিরোধ করা
    if (uploadInProgress) {
      return;
    }

    if (!file || !name || !email) {
      alert("Please provide your name, email, and select a file.");
      return;
    }

    setUploadInProgress(true);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("planet", planetName);
    formData.append("topic", `${planetName} Research Submission`);
    formData.append("description", "User submitted research for publication");

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
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
      setUploadInProgress(false);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen w-full bg-slate-50 dark:bg-[#0b101a] text-slate-900 dark:text-white relative overflow-x-hidden transition-colors duration-500">
      <div className="fixed inset-0 pointer-events-none z-0">
        {stars.map((star) => (
          <div
            key={star.id}
            className={`star-node absolute bg-slate-400 dark:bg-white rounded-full ${star.size} opacity-80`}
            style={{ top: star.top, left: star.left, animationDelay: star.animationDelay }}
          />
        ))}
      </div>

      <section className="min-h-screen w-full max-w-7xl mx-auto flex items-center justify-center relative z-10 px-6 md:px-6 pt-24 md:pt-0">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex flex-col space-y-5 relative z-20">
            <div className="self-start">
              <span
                className="inline-block px-5 py-2 rounded-full text-white text-xs md:text-sm font-bold uppercase tracking-widest transition-colors duration-300"
                style={{ backgroundColor: palette.tagBg, boxShadow: `0 0 15px ${palette.tagShadow}` }}
              >
                {heroTagText.displayedText}
                {heroTagText.isTyping && <span className="animate-pulse ml-1">|</span>}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] text-slate-800 dark:text-slate-100 min-h-35 md:min-h-45 flex flex-col justify-center">
              <span className="uppercase block">
                {title1.displayedText}
                {title1.isTyping && <span className="animate-pulse">|</span>}
              </span>
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-slate-900 via-transparent to-slate-900 dark:from-slate-200 dark:to-sky-200 mt-2" style={{ backgroundImage: `linear-gradient(90deg, ${palette.accent} 0%, ${palette.accentText} 100%)` }}>
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
              <div className="planet-system-scale flex items-center justify-center origin-center">
                <div className="planet-visual-wrapper relative flex items-center justify-center w-125 h-125">
                  <div
                    className="orbit-outer absolute rounded-full border border-slate-300 dark:border-white/10 pointer-events-none flex items-center justify-center"
                    style={{ width: "380px", height: "380px" }}
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-400 rounded-full shadow-[0_0_10px_rgba(148,163,184,0.6)]" />
                  </div>
                  <div
                    className="orbit-inner absolute rounded-full border border-slate-400/50 dark:border-white/10 border-dashed pointer-events-none flex items-center justify-center"
                    style={{ width: "500px", height: "500px" }}
                  >
                    <div className="absolute bottom-0 right-1/2 translate-x-1/2 w-3 h-3 bg-slate-500 rounded-full shadow-[0_0_8px_rgba(100,116,139,0.5)]" />
                  </div>
                  <div
                    className="rounded-full relative overflow-hidden transition-transform duration-500 shadow-[0_15px_50px_rgba(14,165,233,0.15)] dark:shadow-[0_15px_50px_rgba(0,0,0,0.4)]"
                    style={{
                      width: "280px",
                      height: "280px",
                      backgroundColor: palette.accentText,
                      boxShadow: `inset -25px -25px 50px rgba(0,0,0,0.45)`,
                    }}
                  >
                    <div className="absolute top-1/4 left-1/4 w-20 h-12 rounded-full bg-white/20 blur-lg" />
                    <div className="absolute bottom-1/3 right-1/4 w-16 h-16 rounded-full bg-slate-900/25 blur-md" />
                    <div className="absolute top-1/2 right-8 w-10 h-10 rounded-full bg-white/20 blur-sm" />
                    <div className="absolute inset-0 bg-linear-to-br from-white/30 via-transparent to-slate-900/70 rounded-full pointer-events-none mix-blend-overlay" />
                    {visualExtras}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, idx) => {
            const StatIcon = iconMap[stat.iconName] || Thermometer;
            return (
              <div key={idx} className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-[0_4px_20px_rgba(14,165,233,0.05)] hover:shadow-[0_8px_30px_rgba(14,165,233,0.15)] dark:shadow-none hover:-translate-y-1 transition-all duration-300">
                <StatIcon className={`w-6 h-6 mb-4 ${palette.icon}`} />
                <h3 className="text-3xl font-black text-slate-800 dark:text-white">{stat.value}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">{stat.label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{stat.detail}</p>
              </div>
            );
          })}
        </div>
        <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 backdrop-blur-md rounded-4xl p-6 md:p-10 shadow-[0_10px_40px_rgba(14,165,233,0.1)] dark:shadow-lg mb-24 transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <Activity className={`w-8 h-8 ${palette.icon} animate-pulse`} />
            <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Scientific Overview</h2>
          </div>
          <div className="w-full rounded-2xl overflow-hidden shadow-md bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/5 relative">
            <video
              ref={videoRef}
              src={videoSrc}
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
            {overviewText}
          </p>
        </div>
        <div className="mb-24">
          <div className="flex items-center gap-3 mb-10">
            <div className="relative inline-flex items-center justify-center rocket-animated-wrapper w-8 h-8">
              <Rocket className={`w-8 h-8 ${palette.icon} relative z-10`} />
              <canvas ref={rocketCanvasRef} className="absolute pointer-events-none z-0" style={{ width: "80px", height: "80px", top: "-24px", left: "-24px" }} />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tight">Exploration History</h2>
          </div>
          <div className="relative ml-2 md:ml-6 py-6">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-full shadow-[0_0_15px_rgba(14,165,233,0.4)]" style={{ background: `linear-gradient(${palette.calloutFrom}, ${palette.calloutTo})` }} />
            {missions.map((mission, index) => (
              <div key={index} className="relative pl-10 md:pl-16 mb-6 group flex items-center">
                <div className="absolute -left-1.75 top-1/2 -translate-y-1/2 w-5 h-5 bg-slate-50 dark:bg-slate-900 border-4 rounded-full transition-all duration-300 z-10" style={{ borderColor: palette.accent }} />
                <div className="w-full bg-linear-to-br from-white to-slate-50/50 dark:from-slate-800/80 dark:to-slate-800/40 border border-slate-200/70 dark:border-white/5 rounded-xl p-5 shadow-sm shadow-slate-100/50 dark:shadow-none group-hover:border-current group-hover:-translate-y-1 transition-all duration-300" style={{ borderColor: palette.accent }}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 w-full">
                    <div>
                      <h4 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-current transition-colors">{mission.name}</h4>
                      <span className="inline-block mt-2 px-3 py-1 bg-slate-100/70 dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-full border border-slate-200 dark:border-transparent">
                        {mission.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-mono text-sm font-semibold bg-white/60 dark:bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-100 dark:border-slate-700/50 w-fit">
                      <Calendar className={`w-4 h-4 ${palette.icon}`} />
                      {mission.year}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {modelLink && (
          <div className="mb-24">
            <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 backdrop-blur-md rounded-4xl p-10 shadow-[0_10px_40px_rgba(14,165,233,0.08)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.4)] transition-all duration-300">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="max-w-3xl">
                  <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tight">Explore 3D Model</h2>
                  <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed text-lg md:text-xl">
                    Open a trusted interactive 3D simulation of {planetName} to explore its atmosphere, clouds, rings, and moons in a fully immersive planetary view.
                  </p>
                </div>
                <a
                  href={modelLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-white font-bold shadow-xl transition-all duration-300 hover:-translate-y-1"
                  style={{ backgroundColor: palette.accent }}
                >
                  Open 3D Model
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        )}
        <div className="mb-24">
          <div className="flex items-center gap-3 mb-10">
            <FileText className={`w-8 h-8 ${palette.icon}`} />
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tight">Research and Papers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* অনুমোদিত ব্যবহারকারী-জমা দেওয়া গবেষণা */}
            {approvedPapers.map((paper: any, index: number) => (
              <a
                key={`approved-${index}`}
                href="#"
                onClick={(e) => openPreview(e, paper)}
                className="group flex flex-col bg-linear-to-br from-white to-slate-50/50 dark:from-slate-800/80 dark:to-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-2xl p-5 shadow-sm shadow-slate-100/50 dark:shadow-none hover:shadow-[0_12px_35px_-10px_rgba(14,165,233,0.25)] dark:hover:shadow-[0_12px_35px_-10px_rgba(6,182,212,0.3)] hover:-translate-y-1.5 transition-all duration-300 min-h-42.5 cursor-pointer"
                style={{ borderColor: palette.accent }}
              >
                <div className="mb-3">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider bg-slate-100/50 dark:bg-slate-700/50 px-2 py-1 rounded-md">
                    User Submitted • {new Date(paper.uploadDate).getFullYear()}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 leading-snug group-hover:text-current transition-colors">{paper.topic}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 grow">By {paper.userName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">📄 {paper.originalFileName}</p>
              </a>
            ))}
            
            {/* স্ট্যাটিক গবেষণা পত্র */}
            {papers.map((paper) => (
              <a
                key={paper.id}
                href={paper.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col bg-linear-to-br from-white to-slate-50/50 dark:from-slate-800/80 dark:to-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-2xl p-5 shadow-sm shadow-slate-100/50 dark:shadow-none hover:shadow-[0_12px_35px_-10px_rgba(14,165,233,0.25)] dark:hover:shadow-[0_12px_35px_-10px_rgba(6,182,212,0.3)] hover:-translate-y-1.5 transition-all duration-300 min-h-42.5"
                style={{ borderColor: palette.accent }}
              >
                <div className="mb-3">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider bg-slate-100/50 dark:bg-slate-700/50 px-2 py-1 rounded-md">
                    {paper.journal} • {paper.date}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 leading-snug group-hover:text-current transition-colors">{paper.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 grow">By {paper.author}</p>
                <div className="mt-auto flex items-center justify-between text-sm font-semibold" style={{ color: palette.accent }}>
                  <span>Read Paper</span>
                  <div className="bg-white/60 dark:bg-slate-700/50 p-1.5 rounded-full group-hover:bg-current group-hover:text-white transition-all">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
        <div className="mb-24 bg-white dark:bg-[#1a202c] rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white text-center mb-16 tracking-tight">{environmentTitle}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-8">{habitatLabel}</h3>
              <div className="relative group flex flex-col items-center cursor-pointer">
                <svg className="w-52 h-52 transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-100 dark:text-slate-800" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path
                    className="transition-all duration-1000 ease-out"
                    strokeDasharray={`${Number(habitatScore.replace("%", ""))}, 100`}
                    strokeWidth="4"
                    strokeLinecap="butt"
                    stroke={palette.accent}
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="mt-8 text-center">
                  <span className={`text-5xl font-black block`} style={{ color: palette.accent }}>{habitatScore}</span>
                  <span className="text-sm text-slate-700 dark:text-slate-400 mt-2 block">{habitatLabel}</span>
                </div>
                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white dark:bg-white dark:text-slate-900 font-bold text-xs py-2 px-4 rounded-lg pointer-events-none whitespace-nowrap shadow-xl z-20">
                  {environmentDescription}
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
                  <polyline points={atmospherePoints.map((d) => `${d.x},${100 - d.main}`).join(" ")} fill="none" stroke={palette.graph1} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
                  <polyline points={atmospherePoints.map((d) => `${d.x},${100 - d.secondary}`).join(" ")} fill="none" stroke={palette.graph2} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeDasharray="4 2" />
                  <polyline points={atmospherePoints.map((d) => `${d.x},${100 - d.tertiary}`).join(" ")} fill="none" stroke={palette.graph3} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeDasharray="2 2" />
                  {atmospherePoints.map((d, i) => (
                    <circle key={`main-${i}`} cx={d.x} cy={100 - d.main} r={activeGraphPoint === i ? "4" : "2.5"} fill="white" stroke={palette.graph1} strokeWidth="1.5" />
                  ))}
                  {atmospherePoints.map((d, i) => (
                    <circle key={`sec-${i}`} cx={d.x} cy={100 - d.secondary} r={activeGraphPoint === i ? "3" : "2"} fill="white" stroke={palette.graph2} strokeWidth="1.5" />
                  ))}
                  {atmospherePoints.map((d, i) => (
                    <circle key={`tert-${i}`} cx={d.x} cy={100 - d.tertiary} r={activeGraphPoint === i ? "3" : "2"} fill="white" stroke={palette.graph3} strokeWidth="1.5" />
                  ))}
                </svg>
                {atmospherePoints.map((d, i) => {
                  const width = i === 0 || i === atmospherePoints.length - 1 ? 10 : 20;
                  const left = Math.max(0, d.x - (i === 0 ? 0 : 10));
                  return (
                    <div key={`zone-${i}`} className="absolute top-0 bottom-0 z-20 cursor-crosshair" style={{ left: `${left}%`, width: `${width}%` }} onMouseEnter={() => setActiveGraphPoint(i)} onMouseLeave={() => setActiveGraphPoint(null)} />
                  );
                })}
                {activeGraphPoint !== null && (
                  <>
                    <div className="absolute top-0 bottom-0 w-px bg-slate-500 dark:bg-slate-400 pointer-events-none z-10 transition-all duration-100" style={{ left: `${atmospherePoints[activeGraphPoint].x}%` }} />
                    <div className="absolute -top-4 -translate-y-full -translate-x-1/2 bg-slate-800 dark:bg-white border border-slate-700 dark:border-slate-200 text-white dark:text-slate-900 p-3 rounded-xl shadow-2xl w-36 z-30 pointer-events-none transition-all duration-100" style={{ left: `${atmospherePoints[activeGraphPoint].x}%` }}>
                      <div className="text-xs font-bold mb-2 pb-1 border-b border-slate-600 dark:border-slate-300 text-center tracking-wide">Zone: {atmospherePoints[activeGraphPoint].label}</div>
                      <div className="flex justify-between items-center text-slate-200 dark:text-slate-800 font-bold text-sm mb-1">
                        <span>Main</span> <span>{atmospherePoints[activeGraphPoint].main}%</span>
                      </div>
                      <div className="flex justify-between items-center" style={{ color: palette.graph2, fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                        <span>Second</span> <span>{atmospherePoints[activeGraphPoint].secondary}%</span>
                      </div>
                      <div className="flex justify-between items-center" style={{ color: palette.graph3, fontWeight: 700, fontSize: '0.875rem' }}>
                        <span>Tertiary</span> <span>{atmospherePoints[activeGraphPoint].tertiary}%</span>
                      </div>
                    </div>
                  </>
                )}
                <div className="absolute -bottom-8 left-0 right-0 flex justify-between px-2 text-xs font-bold text-slate-700 dark:text-slate-400">
                  {atmospherePoints.map((d, i) => (
                    <span key={`x-label-${i}`}>{d.label}</span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between w-full mt-14 px-4 relative z-0">
                {gasSummary.map((gas, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-black" style={{ color: gas.color }}>{gas.value}</div>
                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-400">{gas.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mb-24">
          <div className="bg-gradient-to-r rounded-4xl p-10 md:p-16 text-center shadow-xl border border-slate-700/50" style={{ backgroundImage: `linear-gradient(90deg, ${palette.calloutFrom}, ${palette.calloutTo})` }}>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{calloutTitle}</h2>
            <p className="text-white text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed">{calloutDescription}</p>
            <button onClick={() => setIsModalOpen(true)} className="px-8 py-3.5 bg-white text-slate-900 font-bold rounded-full transition-all shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:shadow-[0_0_30px_rgba(255,255,255,0.35)] transform hover:-translate-y-1">
              {buttonText}
            </button>
          </div>
        </div>
        {shouldShowFaq && (
          <div className="mb-24 bg-white dark:bg-[#111827] rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white text-center mb-12 tracking-tight">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faq.map((item, index) => (
                <div key={index} className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">{item.question}</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {shouldShowReferences && (
          <div className="mb-24 bg-white dark:bg-[#111827] rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white text-center mb-10 tracking-tight">References</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {references.map((ref, index) => (
                <a key={index} href={ref.link} target="_blank" rel="noopener noreferrer" className="block rounded-3xl p-5 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-700 transition hover:bg-slate-100 dark:hover:bg-slate-900">
                  <p className="font-semibold text-slate-800 dark:text-white mb-2">{ref.label}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Open source reference</p>
                </a>
              ))}
            </div>
          </div>
        )}
      </section>
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4 transition-opacity">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative border border-slate-200 dark:border-slate-700 transform scale-100 animate-in fade-in zoom-in duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-2xl font-black text-center text-slate-800 dark:text-white mb-4">Upload {planetName} Research File</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">Please enter your details and select your research file. Once approved, your file will be published on the website.</p>
            <div className="mb-4">
              <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-sky-500" required />
            </div>
            <div className="mb-6">
              <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-sky-500" required />
            </div>
            <div className="mb-8">
              <div className="border-2 border-dashed border-sky-300 dark:border-slate-600 rounded-2xl p-8 text-center bg-sky-50/50 dark:bg-slate-800/30 hover:bg-sky-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer relative">
                <input type="file" id="file-upload" accept=".pdf,.docx" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="flex flex-col items-center justify-center gap-3 pointer-events-none">
                  <UploadCloud className="w-12 h-12 text-sky-500 dark:text-cyan-400" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{file ? file.name : "Click to browse or drag file here"}</span>
                  <span className="text-xs text-slate-500">Supported formats: PDF, DOCX (Max 10MB)</span>
                </div>
              </div>
            </div>
            <button onClick={handleSubmitFile} disabled={isUploading} className={`w-full py-3.5 ${isUploading ? "bg-sky-400 cursor-not-allowed" : "bg-sky-500 hover:bg-sky-600"} dark:bg-[#00E5FF] dark:hover:bg-cyan-400 dark:text-slate-900 text-white font-bold rounded-xl transition-all shadow-lg`}>
              {isUploading ? "Submitting..." : "Submit File"}
            </button>
          </div>
        </div>
      )}
      {isSuccessOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/70 backdrop-blur-md px-4 transition-all duration-300">
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(0,229,255,0.25)] dark:shadow-[0_0_50px_rgba(0,229,255,0.15)] relative border border-slate-200 dark:border-slate-800/80 text-center transform scale-100 animate-in fade-in zoom-in-95 duration-300">
            <button onClick={() => setIsSuccessOpen(false)} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
            <div className="flex flex-col items-center justify-center pt-4">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 dark:bg-cyan-500/20 animate-ping opacity-75 duration-1000" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 dark:from-[#00E5FF] dark:to-cyan-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 dark:shadow-cyan-500/20">
                <CheckCircle2 className="w-10 h-10 text-white animate-in zoom-in duration-300 delay-100" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-3 tracking-tight">Submission Successful!</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm font-medium mb-8 leading-relaxed max-w-sm">Your request has been submitted successfully. Please wait for the admin's decision.</p>
            <button onClick={() => setIsSuccessOpen(false)} className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-[#00E5FF] dark:to-cyan-500 dark:text-slate-900 text-white font-bold rounded-xl transition-all shadow-md hover:opacity-95 active:scale-95">Done</button>
          </div>
        </div>
      )}
      {/* ================= ফাইল প্রিভিউ মডাল (PDF/IMG/VIDEO) ================= */}
      {isPreviewOpen && previewData && (
        <div className="fixed inset-0 z-[300] bg-slate-900/90 dark:bg-black/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-300">
          {/* টপ নেভবার */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/50">
            <div className="flex flex-col">
              <h3 className="text-white font-bold text-lg">{previewData.topic || "Research Paper"}</h3>
              <p className="text-slate-400 text-xs">Submitted by {previewData.userName} • {previewData.fileSize}</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* ইমেজ-নির্দিষ্ট নিয়ন্ত্রণ (জুম) */}
              {getFileType(previewData.storedFilePath) === 'image' && (
                <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1 mr-4">
                  <button onClick={() => setImgZoom(prev => Math.max(0.5, prev - 0.2))} className="p-2 text-white hover:bg-white/20 rounded-md transition"><ZoomOut className="w-5 h-5"/></button>
                  <span className="text-white text-xs font-mono w-12 text-center">{Math.round(imgZoom * 100)}%</span>
                  <button onClick={() => setImgZoom(prev => Math.min(3, prev + 0.2))} className="p-2 text-white hover:bg-white/20 rounded-md transition"><ZoomIn className="w-5 h-5"/></button>
                </div>
              )}

              {/* ডাউনলোড বাটন */}
              <a 
                href={previewData.storedFilePath} 
                download={previewData.originalFileName || "research_file"}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-colors"
              >
                <Download className="w-4 h-4" /> Download
              </a>
              
              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* ডায়নামিক কন্টেন্ট ভিউয়ার এরিয়া */}
          <div className="flex-1 overflow-auto flex items-center justify-center p-4">
            
            {getFileType(previewData.storedFilePath) === 'pdf' ? (
              <iframe 
                src={`${previewData.storedFilePath}#view=FitH`} 
                className="w-full h-full max-w-5xl bg-white rounded-xl shadow-2xl"
                title="PDF Viewer"
              />
            ) : getFileType(previewData.storedFilePath) === 'image' ? (
              <div className="w-full h-full overflow-auto flex items-center justify-center">
                 <img 
                   src={previewData.storedFilePath} 
                   alt={previewData.topic}
                   style={{ transform: `scale(${imgZoom})`, transition: 'transform 0.2s ease-out' }}
                   className="max-w-none shadow-2xl rounded-lg"
                 />
              </div>
            ) : getFileType(previewData.storedFilePath) === 'video' ? (
              <video 
                src={previewData.storedFilePath} 
                controls 
                autoPlay
                className="max-w-5xl w-full max-h-[80vh] rounded-xl shadow-2xl bg-black"
              />
            ) : (
              <div className="text-center text-white bg-white/5 p-12 rounded-2xl border border-white/10">
                <FileText className="w-16 h-16 mx-auto mb-4 text-slate-500" />
                <h3 className="text-xl font-bold mb-2">Preview not available</h3>
                <p className="text-slate-400 mb-6">This file type cannot be previewed directly in the browser.</p>
                <a 
                  href={previewData.storedFilePath} 
                  download
                  className="px-6 py-3 bg-cyan-600 text-white rounded-lg font-bold"
                >
                  Download File
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
