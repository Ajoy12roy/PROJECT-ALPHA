"use client";

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Info, Rocket } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinSectionRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const planets = [
    { name: 'Mercury', color: '#8C7853', size: 60, description: 'The smallest and closest planet to the Sun', temp: '430°C', distance: '57.9M km' },
    { name: 'Venus', color: '#FFC649', size: 90, description: 'The hottest planet with extreme greenhouse effect', temp: '464°C', distance: '108.2M km' },
    { name: 'Earth', color: '#0EA5E9', size: 95, description: 'Our home, the only known planet with life', temp: '15°C', distance: '149.6M km' },
    { name: 'Mars', color: '#FF6B35', size: 75, description: 'The Red Planet with potential for past life', temp: '-63°C', distance: '227.9M km' },
    { name: 'Jupiter', color: '#C88B3A', size: 160, description: 'The largest planet with the Great Red Spot', temp: '-110°C', distance: '778.5M km' },
    { name: 'Saturn', color: '#FAD5A5', size: 140, description: 'The ringed giant with spectacular ice rings', temp: '-140°C', distance: '1.4B km' },
    { name: 'Uranus', color: '#4FD0E7', size: 110, description: 'The tilted ice giant rotating on its side', temp: '-195°C', distance: '2.9B km' },
    { name: 'Neptune', color: '#4166F5', size: 105, description: 'The windiest planet in our solar system', temp: '-200°C', distance: '4.5B km' },
  ];

  const handlePlanetClick = (planetName: string) => {
    router.push(`/planet/${planetName.toLowerCase()}`);
  };

  useGSAP(() => {
    // ১. যেকোনো পজিশনে স্ক্রল থামালে প্রতিটি উপাদানের জন্য কাস্টম আল্ট্রা-স্মুথ ফ্লোটিং লুপ
    planets.forEach((_, i) => {
      // ইনফো কার্ড ফ্লোট
      gsap.to(`.planet-wrapper-${i} .info-smooth-float`, {
        y: -5,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.1
      });
      // স্ট্যাটাস কার্ড ফ্লোট
      gsap.to(`.planet-wrapper-${i} .stats-smooth-float`, {
        y: 4,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.2
      });
      // বাটন ফ্লোট
      gsap.to(`.planet-wrapper-${i} .btn-smooth-float`, {
        y: -3,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.15
      });
      // প্ল্যানেট স্ফিয়ার ফ্লোট
      gsap.to(`.planet-wrapper-${i} .visual-smooth-float`, {
        y: -6,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.25
      });
    });

    // ২. অরবিট রিংগুলোর নিজস্ব গতিতে ঘূর্ণন
    gsap.to(".vivid-orbit-1", { rotation: 360, duration: 75, repeat: -1, ease: "none" });
    gsap.to(".vivid-orbit-2", { rotation: -360, duration: 55, repeat: -1, ease: "none" });
    gsap.to(".vivid-orbit-3", { rotation: 360, duration: 65, repeat: -1, ease: "none" });
    gsap.to(".vivid-orbit-4", { rotation: -360, duration: 85, repeat: -1, ease: "none" });

    // ৩. মূল স্ক্রল অ্যানিমেশন টাইমলাইন (Master Scroll Setup)
    const masterTl = gsap.timeline();

    masterTl.to(".main-hero-trigger", { autoAlpha: 0, y: -70, duration: 1.5 })
            .to(".solar-bg-system", { opacity: 0.45, scale: 0.92, duration: 1.5 }, "-=1.5");

    // ৪. প্রতিটি গ্রহের উপাদানের স্ক্রল ট্র্যাকিং এন্ট্রি ও এক্সিট
    planets.forEach((planet, i) => {
      const pattern = i % 3;
      let entryProps = {};
      let exitProps = {};

      if (pattern === 0) {
        entryProps = { y: "85vh", autoAlpha: 0, scale: 0.9 };
        exitProps = { y: "-85vh", autoAlpha: 0, scale: 0.9 };
      } else if (pattern === 1) {
        entryProps = { x: "-100vw", autoAlpha: 0, scale: 0.9 };
        exitProps = { x: "100vw", autoAlpha: 0, scale: 0.9 };
      } else {
        entryProps = { x: "100vw", autoAlpha: 0, scale: 0.9 };
        exitProps = { x: "-100vw", autoAlpha: 0, scale: 0.9 };
      }

      const elements = [
        `.planet-wrapper-${i} .part-card-info`,
        `.planet-wrapper-${i} .part-card-stats`,
        `.planet-wrapper-${i} .part-card-btn`,
        `.planet-wrapper-${i} .part-card-visual`
      ];

      masterTl.fromTo(elements, 
        { ...entryProps },
        { x: 0, y: 0, autoAlpha: 1, scale: 1, duration: 2.8, ease: "power4.out", stagger: 0.25 }
      )
      .to({}, { duration: 2.2 }) 
      .to(elements, 
        { ...exitProps, duration: 2.5, ease: "power3.in", stagger: 0.18 }
      );
    });

    // ৫. ScrollTrigger Binding
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "+=1200%", 
      pin: pinSectionRef.current,
      scrub: 1.2,
      animation: masterTl,
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative bg-[#F4F6F9] dark:bg-[#020617] text-slate-900 dark:text-white transition-colors duration-500 font-sans selection:bg-sky-200">
      
      {/* ১. পিনড ভিউপোর্ট ইকোরিস্টেম */}
      <div ref={pinSectionRef} className="w-full h-screen overflow-hidden relative flex items-center justify-center">
        
        {/* --- সোলার মডেল ব্যাকগ্রাউন্ড --- */}
        <div className="solar-bg-system absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-700 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-blue-50 via-[#F4F6F9] to-[#F4F6F9] dark:from-sky-950/20 dark:via-[#020617] dark:to-[#020617]"></div>
          
          {/* Glowing Sun Core */}
          <div className="absolute w-28 h-28 md:w-36 md:h-36 rounded-full bg-linear-to-br from-yellow-300 via-amber-400 to-orange-500 shadow-[0_0_80px_rgba(245,158,11,0.5)]">
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,var(--tw-gradient-stops))] from-white/60 to-transparent animate-pulse"></div>
          </div>
          
          {/* Orbit Rings */}
          <div className="vivid-orbit-1 absolute w-70 h-70 md:w-100 md:h-100 rounded-full border-2 border-teal-400 dark:border-teal-500/20 border-dashed opacity-80"></div>
          <div className="vivid-orbit-2 absolute w-110 h-110 md:w-145 md:h-145 rounded-full border-2 border-sky-400 dark:border-sky-500/20 opacity-80 shadow-[inset_0_0_20px_rgba(56,189,248,0.15)]"></div>
          <div className="vivid-orbit-3 absolute w-150 h-150 md:w-195 md:h-195 rounded-full border-2 border-indigo-400 dark:border-indigo-500/20 border-dashed opacity-70"></div>
          <div className="vivid-orbit-4 absolute w-190 h-190 md:w-245 md:h-245 rounded-full border-2 border-fuchsia-400 dark:border-fuchsia-500/10 opacity-60"></div>
        </div>

        {/* --- মেইন হিরো ইন্ট্রো হেডার --- */}
        <div className="main-hero-trigger absolute top-[15%] z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-black text-slate-800 dark:text-white mb-4 tracking-tight uppercase drop-shadow-sm">
            THE SEARCH FOR <span className="text-sky-500">LIFE</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-white/60 font-medium max-w-2xl leading-relaxed">
            Explore the cosmos and discover the possibility of life beyond Earth
          </p>
          <div className="flex flex-col items-center gap-2 text-sky-500 dark:text-sky-400/50 animate-bounce mt-12">
            <span className="text-xs font-bold tracking-widest uppercase">Scroll to explore</span>
            <ChevronDown className="w-6 h-6" />
          </div>
        </div>

        {/* --- স্বতন্ত্র উপাদান অ্যানিমেশন লেয়ার --- */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          {planets.map((planet, index) => (
            <div 
              key={planet.name} 
              className={`planet-wrapper-${index} absolute top-0 left-0 w-full h-full flex items-center justify-center px-4 md:px-12 pointer-events-none`}
            >
              <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center pointer-events-auto">
                
                {/* বাম পাশের কলাম */}
                <div className="flex flex-col justify-center space-y-6">
                  
                  {/* উপাদান ১: টাইটেল ও ডেসক্রিপশন কার্ড */}
                  <div className="part-card-info opacity-0 invisible bg-white/40 dark:bg-slate-900/30 border border-white/80 dark:border-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
                    <div className="info-smooth-float">
                      <div className="inline-block px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 mb-4 text-xs font-bold tracking-widest uppercase">
                        Planet {index + 1} of 8
                      </div>
                      <h2 className="text-5xl md:text-7xl font-black text-slate-800 dark:text-white mb-3 uppercase tracking-tight">
                        {planet.name}
                      </h2>
                      <p className="text-lg text-slate-600 dark:text-white/70 leading-relaxed font-medium">
                        {planet.description}
                      </p>
                    </div>
                  </div>

                  {/* উপাদান ২: স্ট্যাটাস গ্রিড কার্ড */}
                  <div className="part-card-stats opacity-0 invisible">
                    <div className="stats-smooth-float grid grid-cols-2 gap-4">
                      <div className="bg-white/50 dark:bg-slate-900/20 border border-white/90 dark:border-white/10 backdrop-blur-md rounded-2xl p-5 shadow-sm">
                        <div className="text-slate-500 dark:text-white/40 text-[10px] uppercase tracking-wider mb-1 font-bold">Temperature</div>
                        <div className="text-slate-800 dark:text-white font-extrabold text-xl md:text-2xl">{planet.temp}</div>
                      </div>
                      <div className="bg-white/50 dark:bg-slate-900/20 border border-white/90 dark:border-white/10 backdrop-blur-md rounded-2xl p-5 shadow-sm">
                        <div className="text-slate-500 dark:text-white/40 text-[10px] uppercase tracking-wider mb-1 font-bold">Distance from Sun</div>
                        <div className="text-slate-800 dark:text-white font-extrabold text-xl md:text-2xl">{planet.distance}</div>
                      </div>
                    </div>
                  </div>

                  {/* উপাদান ৩: ফাংশনাল এক্সপ্লোর বাটন */}
                  <div className="part-card-btn opacity-0 invisible">
                    <div className="btn-smooth-float">
                      <button
                        onClick={() => handlePlanetClick(planet.name)}
                        className="px-8 py-4 rounded-full bg-sky-500 hover:bg-sky-600 dark:bg-sky-500/20 dark:hover:bg-sky-400 text-white dark:text-sky-400 dark:hover:text-slate-950 font-bold text-sm transition-all duration-300 shadow-md flex items-center gap-2 group border border-transparent dark:border-sky-400/30 pointer-events-auto"
                      >
                        <Info className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Explore {planet.name}
                      </button>
                    </div>
                  </div>

                </div>

                {/* ডান পাশের কলাম: উপাদান ৪ - প্ল্যানেট ভিজ্যুয়াল স্ফিয়ার */}
                <div className="part-card-visual opacity-0 invisible flex items-center justify-center">
                  <div className="visual-smooth-float">
                    <div className="planet-core-mesh relative group cursor-pointer" onClick={() => handlePlanetClick(planet.name)}>
                      <div
                        className="rounded-full relative overflow-hidden transition-transform duration-500 group-hover:scale-105"
                        style={{
                          width: planet.size * 2.6,
                          height: planet.size * 2.6,
                          backgroundColor: planet.color,
                          boxShadow: `inset -20px -20px 40px rgba(0,0,0,0.3), 0 20px 50px ${planet.color}40`,
                        }}
                      >
                        {/* Generative Textures */}
                        {planet.name === 'Earth' && (
                          <>
                            <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 rounded-[40%_60%] bg-green-500/50 blur-[0.5px]"></div>
                            <div className="absolute bottom-1/4 right-1/4 w-1/4 h-1/3 rounded-[50%_40%] bg-green-600/40 blur-[0.5px]"></div>
                          </>
                        )}
                        {planet.name === 'Mars' && (
                          <div className="absolute top-1/3 left-1/3 w-14 h-14 rounded-full bg-black/15 blur-sm"></div>
                        )}
                        {planet.name === 'Jupiter' && (
                          <>
                            <div className="absolute top-1/4 left-0 right-0 h-3 bg-orange-900/15 blur-[0.5px]"></div>
                            <div className="absolute top-1/2 left-0 right-0 h-4 bg-white/20 blur-[0.5px]"></div>
                          </>
                        )}
                        <div className="absolute inset-0 bg-linear-to-br from-white/30 to-black/50 rounded-full pointer-events-none mix-blend-overlay"></div>
                      </div>

                      {/* Saturn Rings */}
                      {planet.name === 'Saturn' && (
                        <div
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-10 border-[#FAD5A5]/70 rounded-full pointer-events-none"
                          style={{
                            width: planet.size * 4,
                            height: planet.size * 1.1,
                            transform: 'translate(-50%, -50%) rotate(-18deg)',
                          }}
                        ></div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ২. আইসোলেটেড ফাইনাল হাব */}
      <section className="isolated-final-hub min-h-screen w-full relative flex items-center justify-center bg-slate-100 dark:bg-[#070b1e] border-t border-slate-200 dark:border-white/5 z-40 px-4 py-20">
        <div className="text-center max-w-4xl mx-auto flex flex-col items-center">
          <div className="p-4 rounded-full bg-white dark:bg-sky-900/30 border border-sky-100 dark:border-sky-200/20 mb-6 shadow-sm">
            <Rocket className="w-10 h-10 text-sky-500" />
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black text-slate-800 dark:text-white mb-6 uppercase tracking-tight">
            Begin Your <span className="text-sky-500">Journey</span>
          </h2>
          
          <p className="text-lg md:text-xl text-slate-500 dark:text-white/60 max-w-2xl mb-12 font-medium leading-relaxed">
            Select any planet to explore detailed space mission and astronomy research
          </p>
          
          {/* Quick-Navigation Links */}
          <div className="flex flex-wrap gap-4 justify-center max-w-3xl">
            {planets.map((planet) => (
              <button
                key={`hub-${planet.name}`}
                onClick={() => handlePlanetClick(planet.name)}
                className="px-6 py-3 text-sm md:text-base rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white hover:bg-sky-500 hover:text-white hover:border-transparent font-bold transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1"
              >
                {planet.name}
              </button>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}