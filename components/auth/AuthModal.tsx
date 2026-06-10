"use client";

import { useState, useEffect, useRef } from "react";
import { Rocket, X, Mail, Lock, User as UserIcon } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userData: any) => void;
}

type AuthView = "login" | "register" | "forgot";

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [view, setView] = useState<AuthView>("login");
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [stars, setStars] = useState<{ id: number; top: string; left: string; delay: string; duration: string }[]>([]);

  const rocketCanvasRef = useRef<HTMLCanvasElement>(null);

 
  useEffect(() => {
    if (isOpen) {
      const generatedStars = Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 3}s`,
        duration: `${2 + Math.random() * 3}s`,
      }));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStars(generatedStars);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const canvas = rocketCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 60;
    canvas.height = 60;
    let particles: any[] = [];
    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (Math.random() < 0.7) {
        particles.push({
          x: 30 + (Math.random() - 0.5) * 3,
          y: 35,
          vx: (Math.random() - 0.5) * 0.5,
          vy: 1.5 + Math.random() * 1.5,
          size: 2 + Math.random() * 2,
          alpha: 1,
          maxLife: 15,
          life: 0,
          color: Math.random() > 0.5 ? "#ef4444" : "#f97316" // 
        });
      }

      particles = particles.filter((p) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha = 1 - p.life / p.maxLife;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        return p.life < p.maxLife;
      });

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = view === "login" ? "/api/auth/login" : "/api/auth/register";
    const payload = view === "login" ? { email: formData.email, password: formData.password } : formData;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      if (view === "login") {
        onLoginSuccess(data.user);
        onClose();
      } else {
        setView("login");
        alert("Registration successful! Please login.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050505] overflow-hidden">
      
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute w-1 h-1 bg-white rounded-full opacity-0 animate-pulse"
          style={{
            top: star.top,
            left: star.left,
            animationDuration: star.duration,
            animationDelay: star.delay,
            boxShadow: "0 0 4px #fff, 0 0 8px #fff"
          }}
        />
      ))}

      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-rocket {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float-rocket 3s ease-in-out infinite; }
      `}} />

     
      <div 
        className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border-2 border-emerald-500/50 bg-[#022c22]/80 p-8 shadow-[0_0_50px_rgba(16,185,129,0.3)] backdrop-blur-2xl"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-emerald-300/60 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center mb-6">
        
          <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-[#064e3b]/80 border-2 border-emerald-400/60 shadow-[0_0_25px_rgba(16,185,129,0.5)] animate-float">
            <Rocket className="w-7 h-7 text-emerald-400 -rotate-45 relative z-10" />
            <canvas ref={rocketCanvasRef} className="absolute pointer-events-none z-0" style={{ top: 0, left: 0 }} />
          </div>
          <h2 className="mt-4 text-2xl font-black tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {view === "login" && "Welcome Back"}
            {view === "register" && "Create Account"}
            {view === "forgot" && "Reset Password"}
          </h2>
        </div>

        {error && <div className="mb-4 text-xs font-semibold p-3 text-red-200 bg-red-900/50 rounded-xl text-center border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {view === "register" && (
            <div className="relative">
              <UserIcon className="absolute top-3.5 left-4 w-5 h-5 text-emerald-300/70" />
              <input
                type="text"
                placeholder="Full Name"
                required
                className="w-full pl-12 pr-4 py-3 text-sm rounded-xl border border-emerald-500/40 bg-[#064e3b]/60 text-white outline-none focus:border-emerald-300 focus:bg-[#064e3b]/80 transition-all placeholder:text-emerald-200/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute top-3.5 left-4 w-5 h-5 text-emerald-300/70" />
            <input
              type="email"
              placeholder="Email Address"
              required
              className="w-full pl-12 pr-4 py-3 text-sm rounded-xl border border-emerald-500/40 bg-[#064e3b]/60 text-white outline-none focus:border-emerald-300 focus:bg-[#064e3b]/80 transition-all placeholder:text-emerald-200/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {view !== "forgot" && (
            <div className="relative">
              <Lock className="absolute top-3.5 left-4 w-5 h-5 text-emerald-300/70" />
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full pl-12 pr-4 py-3 text-sm rounded-xl border border-emerald-500/40 bg-[#064e3b]/60 text-white outline-none focus:border-emerald-300 focus:bg-[#064e3b]/80 transition-all placeholder:text-emerald-200/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          )}

          {view === "login" && (
            <div className="text-right">
              <button type="button" onClick={() => setView("forgot")} className="text-xs font-semibold text-emerald-300 hover:text-white transition-colors">
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 text-sm font-bold text-[#022c22] rounded-xl bg-gradient-to-r from-emerald-400 to-green-400 shadow-[0_0_20px_rgba(52,211,153,0.5)] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 hover:shadow-[0_0_30px_rgba(52,211,153,0.8)]"
          >
            {loading ? "Processing..." : view === "login" ? "Sign In" : view === "register" ? "Register" : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-emerald-100/70">
          {view === "login" ? (
            <p>Don&apos;t have an account? <button onClick={() => setView("register")} className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors">Sign Up</button></p>
          ) : (
            <p>Already have an account? <button onClick={() => setView("login")} className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors">Sign In</button></p>
          )}
        </div>
      </div>
    </div>
  );
}