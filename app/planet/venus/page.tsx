import type { Metadata } from "next";
import PlanetPage, { type PlanetPageProps } from "@/app/planet/PlanetPage";

export const metadata: Metadata = {
  title: "Venus | Project ALPHA",
  description: "Discover Venus: Earth’s twin shrouded in thick clouds and broiling surface temperatures.",
};

const venusData: Omit<PlanetPageProps, "planetName" | "visualExtras"> = {
  heroTag: "Earth's Infernal Twin",
  heroTitle: "VENUS :",
  heroAccent: "The Hottest World",
  heroDescription: "Venus is cloaked in reflective sulfuric clouds with surface pressures 92 times Earth’s. Its runaway greenhouse traps heat above 460°C and hides a volcanic world beneath.",
  stats: [
    { iconName: "Thermometer", value: "462°C", label: "Average Temperature", detail: "Hot enough to melt lead on the surface." },
    { iconName: "Mountain", value: "8.87 m/s²", label: "Surface Gravity", detail: "Roughly 90% of Earth's gravity." },
    { iconName: "Clock", value: "243 days", label: "Rotation Period", detail: "Retrograde spin, opposite Earth’s direction." },
    { iconName: "Orbit", value: "0 Moons", label: "Natural Satellites", detail: "Venus has no known moons." },
  ],
  overviewText: "Venus is the second planet from the Sun and the brightest planet visible from Earth. Beneath a thick CO₂ atmosphere and sulfuric acid clouds, Venus likely hosts a world of volcanic plains and tectonic stresses, offering a dramatic contrast to Earth despite similar size.",
  videoSrc: "/videos/venus-overview.mp4",
  missions: [
    { year: "1962", name: "Mariner 2", type: "First Venus Flyby" },
    { year: "1975", name: "Venera 9", type: "First Surface Images" },
    { year: "1990", name: "Magellan Orbiter", type: "Surface Mapping" },
    { year: "2006", name: "Venus Express", type: "Atmospheric Science" },
    { year: "2015", name: "Akatsuki", type: "Climate Observatory" },
    { year: "2023", name: "DAVINCI+ & VERITAS", type: "Orbiter and Atmospheric Probe" },
    { year: "2028", name: "Future Venus Exploration", type: "Next-Gen Missions" },
  ],
  papers: [
    { id: 1, title: "Venus' Runaway Greenhouse", author: "Ingersoll, A. P.", date: "1969", journal: "Icarus", link: "https://www.sciencedirect.com/science/article/pii/0019103569900370" },
    { id: 2, title: "Surface Composition from Magellan", author: "Ford, P. G., Pettengill, G. H.", date: "1992", journal: "Journal of Geophysical Research", link: "https://agupubs.onlinelibrary.wiley.com/doi/10.1029/92JE00494" },
    { id: 3, title: "Venus Cloud Dynamics and Chemistry", author: "Esposito, L. W., et al.", date: "1984", journal: "Journal of Geophysical Research", link: "https://agupubs.onlinelibrary.wiley.com/doi/10.1029/JD089iD04p05917" },
    { id: 4, title: "Active Volcanism on Venus", author: "Smrekar, S. E., et al.", date: "2010", journal: "Science", link: "https://www.science.org/doi/10.1126/science.1188189" },
    { id: 5, title: "Exoplanet Climate Lessons from Venus", author: "Kane, S. R., et al.", date: "2014", journal: "Astrophysical Journal", link: "https://iopscience.iop.org/article/10.1088/0004-637X/794/1/95" },
  ],
  atmospherePoints: [
    { x: 0, label: "Cloud", main: 96.5, secondary: 3.5, tertiary: 0.15 },
    { x: 20, label: "Upper", main: 96.4, secondary: 3.55, tertiary: 0.15 },
    { x: 40, label: "Mid", main: 96.6, secondary: 3.4, tertiary: 0.15 },
    { x: 60, label: "Lower", main: 96.5, secondary: 3.5, tertiary: 0.15 },
    { x: 80, label: "Surface", main: 96.5, secondary: 3.5, tertiary: 0.15 },
    { x: 100, label: "System", main: 96.5, secondary: 3.5, tertiary: 0.15 },
  ],
  gasSummary: [
    { label: "Carbon Dioxide", value: "~96.5%", color: "#f87171" },
    { label: "Nitrogen", value: "~3.5%", color: "#fbbf24" },
    { label: "Sulfur Dioxide", value: "~0.15%", color: "#fb7185" },
  ],
  habitatScore: "2%",
  habitatLabel: "Surface Environment",
  environmentTitle: "Runaway Greenhouse",
  environmentDescription: "Venus offers a vivid example of how a thick CO₂ atmosphere can trap heat and create an extreme climate, helping us understand planetary habitability.",
  calloutTitle: "The Cloudy Crucible",
  calloutDescription: "Venus' high clouds and volcanic resurfacing make it a key destination for understanding atmospheric chemistry and planetary evolution.",
  buttonText: "Learn About Venus Missions",
  modelLink: "https://eyes.nasa.gov/apps/solar-system/#/venus",
  faq: [
    { question: "Why does Venus rotate backward?", answer: "Venus rotates retrograde, likely due to ancient impacts or atmospheric tides that reversed its spin." },
    { question: "Can life exist in Venus' clouds?", answer: "Some researchers speculate that the upper cloud layers may host microbial life in temperate zones, though evidence remains inconclusive." },
    { question: "Why is Venus so bright in the sky?", answer: "Venus is covered in reflective clouds that make it the brightest planet and often visible at dawn or dusk." },
  ],
  references: [
    { label: "NASA Venus Exploration", link: "https://solarsystem.nasa.gov/planets/venus/overview/" },
    { label: "ESA Venus Express", link: "https://www.esa.int/Science_Exploration/Space_Science/Venus_Express_overview" },
  ],
  palette: {
    tagBg: "#fb7185",
    tagShadow: "rgba(251, 113, 133, 0.35)",
    accent: "#f97316",
    accentText: "#fb7185",
    icon: "text-rose-500 dark:text-amber-300",
    secondaryIcon: "text-orange-400 dark:text-amber-400",
    graph1: "#fb7185",
    graph2: "#fbbf24",
    graph3: "#f97316",
    calloutFrom: "#7c2d12",
    calloutTo: "#f59e0b",
    ringGlow: "rgba(251, 113, 133, 0.2)",
  },
};

function VenusPage() {
  return (
    <PlanetPage
      planetName="Venus"
      {...venusData}
      visualExtras={
        <>
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),transparent_45%)]" />
          <div className="absolute top-16 right-16 w-28 h-28 rounded-full bg-white/15 blur-2xl" />
          <div className="absolute bottom-10 left-14 w-20 h-20 rounded-full bg-orange-200/20 blur-2xl" />
        </>
      }
    />
  );
}

export default VenusPage;
