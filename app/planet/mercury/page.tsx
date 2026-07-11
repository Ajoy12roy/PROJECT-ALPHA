"use client";

import { useState, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { 
  Thermometer, ShieldAlert, Clock, Moon, Play, Rocket, 
  FileText, Activity, Wind, Hexagon, ExternalLink, Satellite, Info
} from "lucide-react";

export default function MercuryPage() {
  const [mounted, setMounted] = useState(false);
  const [activeGas, setActiveGas] = useState<number | null>(0);
  const [stars, setStars] = useState<{ id: number; top: string; left: string; duration: string }[]>([]);
  
  // GSAP Scope Ref - এরর ফিক্স করার জন্য
  const containerRef = useRef<HTMLDivElement>(null);

  // Client-side hydration
  useEffect(() => {
    setMounted(true);
    const generatedStars = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: `${2 + Math.random() * 4}s`,
    }));
    setStars(generatedStars);
  }, []);

  // GSAP Animations (Mounted হওয়ার পর ট্রিগার হবে)
  useGSAP(() => {
    if (!mounted) return;

    // ১. এন্ট্রান্স অ্যানিমেশন (Fade Up)
    gsap.fromTo(".fade-up", 
      { opacity: 0, y: 50 }, 
      { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out" }
    );

    // ২. গ্লোব স্কেল আপ এবং স্মুথ রোটেশন (Main Globe)
    gsap.fromTo(".mercury-globe-container",
      { scale: 0.4, opacity: 0 },
      { scale: 1, opacity: 1, duration: 2, ease: "back.out(1.2)" }
    );
    gsap.to(".mercury-globe-container", {
      rotation: 360,
      duration: 40,
      repeat: -1,
      ease: "linear"
    });

    // ৩. রিং রোটেশন (বিপরীত দিকে)
    gsap.to(".globe-ring", {
      rotation: -360,
      duration: 25,
      repeat: -1,
      ease: "linear"
    });

    // ৪. ফ্লোটিং রকেট অ্যানিমেশন (Up and Down)
    gsap.to(".floating-rocket", {
      y: -15,
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });

  }, { scope: containerRef, dependencies: [mounted] });

  if (!mounted) return null;

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-800 dark:text-white relative overflow-hidden transition-colors duration-300">
      
      {/* Background Blinking Stars (Visible in dark mode) */}
      <div className="absolute inset-0 pointer-events-none z-0 hidden dark:block overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              top: star.top,
              left: star.left,
              animation: `pulse ${star.duration} infinite ease-in-out`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 relative z-10 space-y-32">
        
        {/* ================= 1. HERO SECTION ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center fade-up">
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-emerald-600 dark:text-cyan-400 tracking-widest uppercase">
              The Swift Planet
            </h3>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-white">
              MERCURY
            </h1>
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed max-w-lg font-medium">
              Mercury is the closest planet to the Sun and the smallest in our solar system. It is a rocky, cratered world with extreme temperature swings, lacking a substantial atmosphere to retain heat.
            </p>
            <a 
              href="https://eyes.nasa.gov/apps/solar-system/#/mercury?rate=-64800&time=2026-07-06T04:19:11.337+00:00"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300"
            >
              Explore 3D Model <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          
          {/* Globe and Ring */}
          <div className="relative flex items-center justify-center h-[400px]">
            <div className="mercury-globe-container relative flex items-center justify-center">
              {/* The Ring */}
              <div className="globe-ring absolute w-[350px] h-[350px] md:w-[450px] md:h-[450px] border-2 border-dashed border-slate-400 dark:border-cyan-500/30 rounded-full" />
              
              {/* The Planet */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-slate-300 via-slate-500 to-slate-800 dark:from-slate-400 dark:via-slate-600 dark:to-gray-900 shadow-[inset_-20px_-20px_50px_rgba(0,0,0,0.5),0_0_50px_rgba(100,116,139,0.3)] flex items-center justify-center overflow-hidden">
                {/* Craters texture simulation */}
                <div className="absolute top-10 left-10 w-12 h-12 rounded-full bg-black/20 shadow-inner" />
                <div className="absolute bottom-20 right-16 w-24 h-24 rounded-full bg-black/10 shadow-inner" />
                <div className="absolute top-1/2 left-1/3 w-8 h-8 rounded-full bg-black/20 shadow-inner" />
                <div className="absolute top-1/3 right-1/4 w-10 h-10 rounded-full bg-black/15 shadow-inner" />
              </div>
            </div>
          </div>
        </section>

        {/* ================= 2. 4 STAT CARDS ================= */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 fade-up">
          {[
            { icon: Thermometer, label: "Temperature", value: "-173°C to 427°C" },
            { icon: ShieldAlert, label: "Surface Gravity", value: "3.7 m/s²" },
            { icon: Clock, label: "Day Length", value: "176 Earth Days" },
            { icon: Moon, label: "Moons", value: "0 (None)" },
          ].map((stat, idx) => (
            <div key={idx} className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-[0_0_20px_rgba(5,150,105,0.2)] dark:hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:border-emerald-400 dark:hover:border-cyan-500 hover:-translate-y-2 transition-all duration-300">
              <stat.icon className="w-8 h-8 text-emerald-600 dark:text-cyan-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
            </div>
          ))}
        </section>

        {/* ================= 3. VIDEO SECTION ================= */}
        <section className="fade-up space-y-6 max-w-5xl mx-auto">
          <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden bg-slate-800 border-4 border-white dark:border-slate-800 shadow-2xl flex items-center justify-center group cursor-pointer">
            {/* Background Image Placeholder */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
            
            <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition-colors z-10" />
            
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center z-20 shadow-[0_0_30px_rgba(255,255,255,0.4)] group-hover:scale-110 transition-transform duration-300">
              <Play className="w-10 h-10 text-white fill-white ml-2" />
            </div>
          </div>
          <div className="text-center px-4">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">The Desolate World</h3>
            <p className="text-slate-700 dark:text-slate-300 max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
              Witness the harsh reality of Mercury. A planet shaped by relentless solar radiation and massive asteroid impacts. The Caloris Basin, one of the largest impact craters in the solar system, bears witness to its violent history.
            </p>
          </div>
        </section>

        {/* ================= 4. SATELLITES & MISSIONS ================= */}
        <section className="fade-up">
          <div className="flex flex-col items-center justify-center gap-2 mb-14">
            <div className="relative flex flex-col items-center">
              {/* ফ্লোটিং রকেট এবং স্মোক (নো ফায়ার) */}
              <Rocket className="w-12 h-12 text-emerald-600 dark:text-cyan-400 floating-rocket z-10 drop-shadow-lg" />
              <div className="w-8 h-8 bg-slate-300 dark:bg-slate-700 rounded-full blur-[10px] absolute -bottom-4 animate-pulse opacity-60" />
            </div>
            <h2 className="text-4xl font-black mt-4 text-slate-900 dark:text-white">Missions to Mercury</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Mariner 10", desc: "Launched in 1973, it was the first spacecraft to visit Mercury, mapping about 45% of its surface." },
              { title: "MESSENGER", desc: "Launched in 2004, this NASA probe became the first to orbit Mercury, mapping 100% of the planet." },
              { title: "BepiColombo", desc: "An ongoing joint mission between ESA and JAXA, en route to study Mercury's magnetic field and interior." }
            ].map((mission, idx) => (
              <div key={idx} className="group p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-[0_0_30px_rgba(5,150,105,0.15)] dark:hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-50 dark:group-hover:bg-cyan-950 transition-all duration-300 shadow-sm">
                  <Satellite className="w-8 h-8 text-emerald-600 dark:text-cyan-400" />
                </div>
                <h3 className="text-2xl font-black mb-3 text-slate-900 dark:text-white">{mission.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed font-medium">
                  {mission.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 5. RESEARCH PAPERS ================= */}
        <section className="fade-up">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-emerald-100 dark:bg-cyan-500/10 rounded-xl">
              <FileText className="w-8 h-8 text-emerald-600 dark:text-cyan-400" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Research Papers</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Core Contraction and Planetary Shrinkage",
              "Water Ice in Permanently Shadowed Craters",
              "Mercury's Magnetic Field Generation",
              "Exosphere Composition and Solar Wind",
              "Volcanism and Surface Formation",
              "The Caloris Basin Impact Event"
            ].map((title, index) => (
              <div key={index} className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:border-emerald-500 dark:hover:border-cyan-400 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-emerald-100 dark:group-hover:bg-cyan-500/20 transition-colors">
                  <FileText className="w-6 h-6 text-slate-400 group-hover:text-emerald-600 dark:text-slate-500 dark:group-hover:text-cyan-400" />
                </div>
                <h4 className="text-lg font-bold mb-2 text-slate-800 dark:text-white">{title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Published in Planetary Science Journal</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 6. POSSIBILITY OF LIFE ================= */}
        <section className="fade-up pt-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-emerald-100 dark:bg-cyan-500/10 rounded-xl">
              <Activity className="w-8 h-8 text-emerald-600 dark:text-cyan-400" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Possibility of Life</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Premium Habitability Score */}
            <div className="relative flex flex-col items-center justify-center p-12 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden group hover:border-emerald-200 dark:hover:border-cyan-900 transition-colors duration-500">
              {/* Background Glow Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent dark:from-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative w-56 h-56 rounded-full flex items-center justify-center bg-white dark:bg-slate-950 shadow-[0_0_40px_rgba(0,0,0,0.05)] dark:shadow-[0_0_40px_rgba(0,0,0,0.3)] z-10">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                  <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="628" strokeDashoffset="620" className="text-emerald-500 dark:text-cyan-400 transition-all duration-1000" />
                </svg>
                <div className="text-center z-10">
                  <h3 className="text-6xl font-black text-slate-900 dark:text-white">1%</h3>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2 uppercase tracking-widest">Habitability</p>
                </div>
              </div>
              <p className="text-center text-sm md:text-base font-medium text-slate-700 dark:text-slate-300 mt-8 max-w-sm relative z-10">
                Due to extreme temperatures and high solar radiation, life as we know it is virtually impossible on Mercury.
              </p>
            </div>

            {/* Right: Atmospheric Composition */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-900 dark:text-white">
                <Wind className="w-6 h-6 text-emerald-600 dark:text-cyan-400" /> 
                Exosphere Composition
              </h3>
              {[
                { name: "Oxygen (O2)", value: "42%", desc: "The most abundant element in Mercury's extremely thin exosphere." },
                { name: "Sodium (Na)", value: "29%", desc: "Creates a glowing tail behind the planet due to solar wind." },
                { name: "Hydrogen (H2)", value: "22%", desc: "Captured from the solar wind sweeping past the planet." },
                { name: "Helium (He)", value: "6%", desc: "Radiogenic helium released from the planet's crust." },
              ].map((gas, index) => (
                <div 
                  key={index} 
                  onClick={() => setActiveGas(activeGas === index ? null : index)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
                    activeGas === index 
                      ? "bg-emerald-50 dark:bg-cyan-950 border-emerald-400 dark:border-cyan-500 shadow-md" 
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span className="text-slate-800 dark:text-white">{gas.name}</span>
                    <span className="text-emerald-600 dark:text-cyan-400">{gas.value}</span>
                  </div>
                  <div className={`overflow-hidden transition-all duration-300 ${activeGas === index ? "max-h-24 mt-3 opacity-100" : "max-h-0 opacity-0"}`}>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{gas.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 7. FUTURE COLONIZATION (Centered Layout) ================= */}
        <section className="fade-up pt-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center justify-center gap-3 px-6 py-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-4">
              <Hexagon className="w-5 h-5 text-emerald-600 dark:text-cyan-400" />
              <span className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-sm">Future Colonization</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
              Underground Habitats
            </h2>
            
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg font-medium max-w-2xl mx-auto">
              While challenging, colonizing Mercury offers unique advantages. Polar craters contain permanently shadowed regions with water ice, and vast underground lava tubes could protect future colonists from radiation and extreme surface heat.
            </p>

            {/* Featured Centered Image/Banner for Colonization */}
            <div className="relative w-full h-[300px] md:h-[450px] mt-10 rounded-[2rem] overflow-hidden bg-slate-900 border-4 border-white dark:border-slate-800 shadow-2xl flex items-center justify-center group">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-10" />
              
              {/* Optional Placeholder for an actual illustration */}
              <div className="absolute inset-0 bg-slate-800 opacity-50 group-hover:scale-105 transition-transform duration-700" />
              
              <div className="z-20 text-center px-4 transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                <Hexagon className="w-16 h-16 text-emerald-500 dark:text-cyan-400 mx-auto mb-4 opacity-80" />
                <h3 className="text-3xl font-black text-white mb-2 tracking-wide">Polar Crater Bases</h3>
                <p className="text-slate-300 font-medium">Safe havens sheltered from the sun</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 8. BOTTOM ACTION BUTTON ================= */}
        <div className="flex justify-center mt-20 fade-up pb-10">
          <a 
            href="https://science.nasa.gov/mercury/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="px-10 py-4 bg-emerald-600 hover:bg-emerald-700 dark:bg-cyan-500 dark:hover:bg-cyan-600 text-white dark:text-slate-950 font-bold rounded-2xl shadow-[0_10px_30px_rgba(5,150,105,0.3)] dark:shadow-[0_10px_30px_rgba(6,182,212,0.3)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 text-lg"
          >
            <Info className="w-6 h-6" />
            Learn About Mercury Missions
          </a>
        </div>

      </div>
    </div>
  );
}