import type { Metadata } from "next";
import PlanetPage, { type PlanetPageProps } from "@/app/planet/PlanetPage";

export const metadata: Metadata = {
  title: "Neptune | Project ALPHA",
  description: "Explore Neptune: the distant ice giant with supersonic winds, a cobalt-blue atmosphere, and a captured moon.",
};

const neptuneData: Omit<PlanetPageProps, "planetName" | "visualExtras"> = {
  heroTag: "The Windy Blue World",
  heroTitle: "NEPTUNE :",
  heroAccent: "The Distant Ice Giant",
  heroDescription: "Neptune hides fierce storms and a deep blue atmosphere rich in methane. Its distant orbit and magnetic tilt reveal a world shaped by internal heat and captured icy moons.",
  stats: [
    { iconName: "Thermometer", value: "-214°C", label: "Average Temperature", detail: "Coldest of the known planets." },
    { iconName: "Mountain", value: "11.15 m/s²", label: "Surface Gravity", detail: "Strong gravity over its ice-rich interior." },
    { iconName: "Clock", value: "16.1 hrs", label: "Rotation Period", detail: "A relatively fast day for an ice giant." },
    { iconName: "Orbit", value: "14 Moons", label: "Satellite Family", detail: "Led by Triton, a retrograde captured moon." },
  ],
  overviewText: "Neptune is the eighth planet from the Sun, known for supersonic winds reaching over 2,000 km/h and a deep blue appearance from atmospheric methane. It emits more heat than it receives and hosts a system of narrow rings and 14 moons, including the geologically active Triton.",
  videoSrc: "/videos/neptune-overview.mp4",
  missions: [
    { year: "1977", name: "Voyager 2 Launch", type: "Interplanetary Probe" },
    { year: "1989", name: "Voyager 2 Flyby", type: "Neptune Encounter" },
    { year: "1990", name: "Hubble Deep Survey", type: "Space Telescope" },
    { year: "2001", name: "Ring Composition Studies", type: "Ground-Based Observations" },
    { year: "2013", name: "Ice Giant System Planning", type: "Mission Concept" },
    { year: "2026", name: "Neptune Odyssey Study", type: "Flagship Mission Study" },
    { year: "2038", name: "Future Ice Giant Mission", type: "Exploration Concept" },
  ],
  papers: [
    { id: 1, title: "Neptune's Great Dark Spot", author: "Smith, B. A., et al.", date: "1989", journal: "Science", link: "https://www.science.org/doi/10.1126/science.246.4936.1458" },
    { id: 2, title: "Methane in Neptune's Atmosphere", author: "Owen, T., et al.", date: "1991", journal: "Nature", link: "https://www.nature.com/articles/353244a0" },
    { id: 3, title: "Triton: A Captured Kuiper Belt Object", author: "McKinnon, W. B.", date: "1995", journal: "Nature", link: "https://www.nature.com/articles/377123a0" },
    { id: 4, title: "Neptune's Ring Arcs", author: "Porco, C. C., et al.", date: "1995", journal: "Nature", link: "https://www.nature.com/articles/377585a0" },
    { id: 5, title: "Interior Models of Ice Giants", author: "Nettelmann, N., et al.", date: "2013", journal: "Icarus", link: "https://www.sciencedirect.com/science/article/pii/S0019103512002271" },
  ],
  atmospherePoints: [
    { x: 0, label: "Cloud", main: 80.0, secondary: 19.0, tertiary: 1.5 },
    { x: 20, label: "Upper", main: 79.5, secondary: 19.5, tertiary: 1.6 },
    { x: 40, label: "Mid", main: 80.3, secondary: 18.7, tertiary: 1.0 },
    { x: 60, label: "Lower", main: 79.8, secondary: 19.1, tertiary: 1.1 },
    { x: 80, label: "Deep", main: 80.1, secondary: 18.8, tertiary: 1.1 },
    { x: 100, label: "Mantle", main: 80.0, secondary: 19.0, tertiary: 1.0 },
  ],
  gasSummary: [
    { label: "Hydrogen", value: "~80%", color: "#60a5fa" },
    { label: "Helium", value: "~19%", color: "#3b82f6" },
    { label: "Methane", value: "~1.5%", color: "#0ea5e9" },
  ],
  habitatScore: "4%",
  habitatLabel: "Subsystem Habitability",
  environmentTitle: "Ice Giant Climate",
  environmentDescription: "Neptune's deep atmosphere and extreme winds create a challenging environment that teaches us about planetary dynamics far from the Sun.",
  calloutTitle: "Neptune's Extreme Winds",
  calloutDescription: "Neptune's atmosphere hosts some of the fastest winds in the solar system, driven by internal heat and a faint but active ring system.",
  buttonText: "Learn About Neptune Missions",
  modelLink: "https://eyes.nasa.gov/apps/solar-system/#/neptune",
  showFaq: false,
  showReferences: false,
  faq: [
    { question: "Why is Neptune so blue?", answer: "Neptune's blue color is caused by methane absorbing red light and scattering blue wavelengths from sunlight." },
    { question: "What makes Triton unusual?", answer: "Triton orbits backward, suggesting it was captured by Neptune's gravity from the Kuiper Belt." },
    { question: "Does Neptune have a solid surface?", answer: "Neptune lacks a true solid surface; it transitions from a gaseous envelope into an ice-rich interior." },
  ],
  references: [
    { label: "NASA Neptune Exploration", link: "https://solarsystem.nasa.gov/planets/neptune/overview/" },
    { label: "Voyager 2 Neptune Flyby", link: "https://voyager.jpl.nasa.gov/mission/neptune/" },
  ],
  palette: {
    tagBg: "#22d3ee",
    tagShadow: "rgba(14, 165, 233, 0.35)",
    accent: "#0ea5e9",
    accentText: "#7dd3fc",
    icon: "text-sky-500 dark:text-cyan-400",
    secondaryIcon: "text-cyan-400 dark:text-sky-300",
    graph1: "#60a5fa",
    graph2: "#3b82f6",
    graph3: "#0ea5e9",
    calloutFrom: "#0f172a",
    calloutTo: "#0ea5e9",
    ringGlow: "rgba(14, 165, 233, 0.2)",
  },
};

function NeptunePage() {
  return (
    <PlanetPage
      planetName="Neptune"
      {...neptuneData}
      visualExtras={
        <>
          <div className="absolute inset-0 rounded-full bg-white/20 blur-3xl mix-blend-screen" />
          <div className="absolute top-16 left-12 w-24 h-24 rounded-full border border-white/20 opacity-80" />
          <div className="absolute bottom-12 right-14 w-16 h-16 rounded-full border border-cyan-300/30 opacity-60" />
        </>
      }
    />
  );
}

export default NeptunePage;
