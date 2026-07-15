import type { Metadata } from "next";
import PlanetPage, { type PlanetPageProps } from "@/app/planet/PlanetPage";

export const metadata: Metadata = {
  title: "Jupiter | Project ALPHA",
  description: "Discover Jupiter: the largest planet in the Solar System, ruled by giant storms, intense magnetism, and a dramatic moon system.",
};

const jupiterData: Omit<PlanetPageProps, "planetName" | "visualExtras"> = {
  heroTag: "The Gas Giant King",
  heroTitle: "JUPITER :",
  heroAccent: "Solar System's Colossal Giant",
  heroDescription: "Jupiter is a majestic gas giant with raging storms, powerful magnetism, and a ringed halo. Its Great Red Spot, dozens of moons, and deep hydrogen-helium atmosphere make it the system's ultimate giant.",
  stats: [
    { iconName: "Thermometer", value: "-145°C", label: "Average Temperature", detail: "Cloud tops are bitterly cold despite internal heat." },
    { iconName: "Mountain", value: "24.79 m/s²", label: "Gravity", detail: "More than twice Earth's surface gravity." },
    { iconName: "Clock", value: "9.9 hrs", label: "Rotation Period", detail: "The fastest planetary rotation in the Solar System." },
    { iconName: "Orbit", value: "95 Moons", label: "Satellite Family", detail: "Including volcanic Io, icy Europa, and giant Ganymede." },
  ],
  overviewText: "Jupiter is the fifth planet from the Sun and the largest in our Solar System. Its massive atmosphere is dominated by hydrogen and helium, punctuated by colorful cloud bands and the Great Red Spot. Jupiter generates more heat than it receives from the Sun and shepherds a complex system of rings and moons.",
  videoSrc: "/videos/jupiter-overview.mp4",
  missions: [
    { year: "1973", name: "Pioneer 10", type: "First Jupiter Flyby" },
    { year: "1974", name: "Pioneer 11", type: "Ring and Magnetosphere Study" },
    { year: "1979", name: "Voyager 1", type: "Jupiter Encounter" },
    { year: "1979", name: "Voyager 2", type: "Jupiter System Survey" },
    { year: "1995", name: "Galileo Orbiter", type: "Jovian System Explorer" },
    { year: "2016", name: "Juno", type: "Polar Orbiter" },
    { year: "2030", name: "Europa Clipper", type: "Icy Moon Pathfinder" },
  ],
  papers: [
    { id: 1, title: "Jupiter's Internal Structure Inferred from Juno", author: "Bolton, S. J., et al.", date: "2017", journal: "Science", link: "https://www.science.org/doi/10.1126/science.aal2108" },
    { id: 2, title: "The Dynamics of Jupiter's Great Red Spot", author: "Simon, A. A., et al.", date: "2018", journal: "Nature", link: "https://www.nature.com/articles/s41586-018-0504-2" },
    { id: 3, title: "Atmospheric Composition and Clouds on Jupiter", author: "Atreya, S. K., et al.", date: "1999", journal: "Planetary and Space Science", link: "https://www.sciencedirect.com/science/article/pii/S0032063398001927" },
    { id: 4, title: "Magnetosphere of Jupiter", author: "Khurana, K. K., et al.", date: "2004", journal: "Journal of Geophysical Research", link: "https://agupubs.onlinelibrary.wiley.com/doi/10.1029/2003JA010282" },
    { id: 5, title: "Jupiter's Ring System", author: "Showalter, M. R., et al.", date: "2007", journal: "Icarus", link: "https://www.sciencedirect.com/science/article/pii/S0019103506005063" },
  ],
  atmospherePoints: [
    { x: 0, label: "Upper", main: 88.5, secondary: 10.2, tertiary: 1.3 },
    { x: 20, label: "Cloud", main: 89.0, secondary: 10.0, tertiary: 1.0 },
    { x: 40, label: "Mid", main: 88.8, secondary: 10.1, tertiary: 1.1 },
    { x: 60, label: "Lower", main: 89.2, secondary: 9.9, tertiary: 0.9 },
    { x: 80, label: "Deep", main: 88.9, secondary: 10.1, tertiary: 1.0 },
    { x: 100, label: "Core", main: 88.7, secondary: 10.2, tertiary: 1.1 },
  ],
  gasSummary: [
    { label: "Hydrogen", value: "~89.8%", color: "#f59e0b" },
    { label: "Helium", value: "~10.2%", color: "#f97316" },
    { label: "Methane", value: "~0.3%", color: "#c2410c" },
  ],
  habitatScore: "6%",
  habitatLabel: "Deep Atmosphere",
  environmentTitle: "Jupiter’s Extreme Atmosphere",
  environmentDescription: "The intense radiation belts and high pressures make Jupiter inhospitable, yet its magnetic field and meteorology are the best laboratory for giant planet physics.",
  calloutTitle: "The Great Red Spot",
  calloutDescription: "A storm larger than Earth and older than modern telescopes, driven by Jupiter's immense winds.",
  buttonText: "Learn About Jupiter Missions",
  modelLink: "https://eyes.nasa.gov/apps/solar-system/#/jupiter",
  faq: [
    { question: "What is the Great Red Spot?", answer: "The Great Red Spot is a massive, long-lived high-pressure storm in Jupiter's atmosphere." },
    { question: "Does Jupiter have a solid surface?", answer: "Jupiter is a gas giant with no solid surface; its atmosphere transitions into liquid metallic hydrogen deep below." },
    { question: "Could Jupiter's moons harbor life?", answer: "Moons like Europa and Ganymede are leading astrobiology targets because they may host subsurface oceans." },
  ],
  references: [
    { label: "NASA Jupiter Overview", link: "https://solarsystem.nasa.gov/planets/jupiter/overview/" },
    { label: "Juno Mission", link: "https://www.nasa.gov/mission_pages/juno/main/index.html" },
  ],
  palette: {
    tagBg: "#f97316",
    tagShadow: "rgba(249, 115, 22, 0.35)",
    accent: "#d97706",
    accentText: "#fbbf24",
    icon: "text-amber-500 dark:text-orange-300",
    secondaryIcon: "text-orange-400 dark:text-amber-300",
    graph1: "#f59e0b",
    graph2: "#f97316",
    graph3: "#c2410c",
    calloutFrom: "#a16207",
    calloutTo: "#f59e0b",
    ringGlow: "rgba(249, 115, 22, 0.22)",
  },
};

function JupiterPage() {
  return (
    <PlanetPage
      planetName="Jupiter"
      {...jupiterData}
      visualExtras={
        <>
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),transparent_40%)]" />
          <div className="absolute top-20 left-10 w-24 h-24 rounded-full bg-orange-200/20 blur-3xl" />
          <div className="absolute bottom-12 right-16 w-28 h-28 rounded-full bg-yellow-200/15 blur-3xl" />
          <div className="absolute inset-x-14 top-28 h-12 rounded-full bg-gradient-to-r from-orange-500/20 via-transparent to-slate-900/10 blur-xl" />
        </>
      }
    />
  );
}

export default JupiterPage;
