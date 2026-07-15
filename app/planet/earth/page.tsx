import type { Metadata } from "next";
import PlanetPage, { type PlanetPageProps } from "@/app/planet/PlanetPage";

export const metadata: Metadata = {
  title: "Earth | Project ALPHA",
  description: "Explore Earth: the only known habitable planet with a dynamic climate, oceanic systems, and diverse life.",
};

const earthData: Omit<PlanetPageProps, "planetName" | "visualExtras"> = {
  heroTag: "The Blue Marble",
  heroTitle: "EARTH :",
  heroAccent: "Our Home World",
  heroDescription: "Earth is a vibrant and life-sustaining planet with liquid water, a protective atmosphere, and a dynamic climate system shaped by its oceans, continents, and magnetic field.",
  stats: [
    { iconName: "Thermometer", value: "15°C", label: "Average Temperature", detail: "Temperate global climate with wide regional variation." },
    { iconName: "Mountain", value: "9.81 m/s²", label: "Surface Gravity", detail: "The reference gravity for the Solar System." },
    { iconName: "Clock", value: "24 hrs", label: "Rotation Period", detail: "A single Earth day defines diurnal cycles." },
    { iconName: "Orbit", value: "1 Moon", label: "Natural Satellite", detail: "The Moon stabilizes Earth's tilt and tides." },
  ],
  overviewText: "Earth is the third planet from the Sun, the only known place in the universe with complex life. Its breathable nitrogen-oxygen atmosphere, abundant water, and plate tectonics create a richly interconnected planet that supports ecosystems from polar ice to tropical forests.",
  videoSrc: "/videos/earth-overview.mp4",
  missions: [
    { year: "1957", name: "Sputnik 1", type: "First Artificial Satellite" },
    { year: "1969", name: "Apollo 11", type: "First Crew on the Moon" },
    { year: "1998", name: "ISS Assembly", type: "Low Earth Orbit Laboratory" },
    { year: "2000", name: "Landsat 7", type: "Earth Observation" },
    { year: "2006", name: "Aqua", type: "Climate Monitoring" },
    { year: "2020", name: "Sentinel Mission", type: "Atmosphere and Oceans" },
    { year: "2028", name: "Artemis III", type: "Crewed Lunar Return" },
  ],
  papers: [
    { id: 1, title: "Earth's Energy Budget", author: "Trenberth, K. E.", date: "2019", journal: "Nature Climate Change", link: "https://www.nature.com/articles/s41558-019-0518-1" },
    { id: 2, title: "The Role of Oceans in Climate", author: "Levitus, S., et al.", date: "2012", journal: "Science", link: "https://www.science.org/doi/10.1126/science.1210280" },
    { id: 3, title: "Magnetic Field Reversals and Planetary Protection", author: "Valet, J. P.", date: "2003", journal: "Nature", link: "https://www.nature.com/articles/nature02055" },
    { id: 4, title: "Biodiversity and the Human Footprint", author: "Newbold, T., et al.", date: "2015", journal: "Nature", link: "https://www.nature.com/articles/nature15593" },
    { id: 5, title: "Atmospheric Chemistry of the Modern Earth", author: "Seinfeld, J. H., & Pandis, S. N.", date: "2016", journal: "Atmospheric Chemistry and Physics", link: "https://acp.copernicus.org/articles/16/5125/2016/" },
  ],
  atmospherePoints: [
    { x: 0, label: "Troposphere", main: 78.1, secondary: 20.9, tertiary: 0.9 },
    { x: 20, label: "Stratosphere", main: 78.1, secondary: 20.9, tertiary: 0.8 },
    { x: 40, label: "Mesosphere", main: 78.0, secondary: 21.0, tertiary: 0.7 },
    { x: 60, label: "Thermosphere", main: 78.0, secondary: 21.0, tertiary: 0.7 },
    { x: 80, label: "Exosphere", main: 78.0, secondary: 21.0, tertiary: 0.6 },
    { x: 100, label: "Space", main: 77.9, secondary: 21.0, tertiary: 0.6 },
  ],
  gasSummary: [
    { label: "Nitrogen", value: "78.1%", color: "#0ea5e9" },
    { label: "Oxygen", value: "20.9%", color: "#22c55e" },
    { label: "Argon", value: "0.93%", color: "#fbbf24" },
  ],
  habitatScore: "95%",
  habitatLabel: "Surface Habitability",
  environmentTitle: "The Living Planet",
  environmentDescription: "Earth's temperate climate, liquid water, and protective atmosphere create the only known cradle of life in the cosmos.",
  calloutTitle: "Ocean-Atmosphere Engine",
  calloutDescription: "Earth's climate is driven by the interaction of its oceans, atmosphere, and biosphere, making it uniquely resilient and fragile.",
  buttonText: "Learn About Earth Missions",
  modelLink: "https://eyes.nasa.gov/apps/solar-system/#/earth",
  faq: [
    { question: "What makes Earth habitable?", answer: "Liquid water, a stable climate, and a protective atmosphere allow life to thrive on Earth." },
    { question: "Why is Earth's magnetic field important?", answer: "It shields the planet from harmful solar and cosmic radiation and helps retain the atmosphere." },
    { question: "How many moons does Earth have?", answer: "Earth has one natural moon, which stabilizes its tilt and influences tides." },
  ],
  references: [
    { label: "NASA Earth Science", link: "https://science.nasa.gov/earth-science" },
    { label: "NOAA Climate Data", link: "https://www.noaa.gov/climate" },
  ],
  palette: {
    tagBg: "#0ea5e9",
    tagShadow: "rgba(14, 165, 233, 0.35)",
    accent: "#22c55e",
    accentText: "#38bdf8",
    icon: "text-sky-500 dark:text-cyan-300",
    secondaryIcon: "text-emerald-500 dark:text-emerald-400",
    graph1: "#0ea5e9",
    graph2: "#22c55e",
    graph3: "#fbbf24",
    calloutFrom: "#047857",
    calloutTo: "#22c55e",
    ringGlow: "rgba(56, 189, 248, 0.18)",
  },
};

function EarthPage() {
  return (
    <PlanetPage
      planetName="Earth"
      {...earthData}
      showFaq={false}
      showReferences={false}
      visualExtras={
        <>
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.2),transparent_35%)]" />
          <div className="absolute top-16 right-16 w-28 h-28 rounded-full bg-cyan-200/20 blur-3xl" />
          <div className="absolute bottom-12 left-10 w-24 h-24 rounded-full bg-emerald-200/15 blur-3xl" />
          <div className="absolute inset-x-16 top-24 h-10 rounded-full bg-gradient-to-r from-cyan-400/20 via-transparent to-slate-900/10 blur-xl" />
        </>
      }
    />
  );
}

export default EarthPage;
