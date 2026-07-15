import type { Metadata } from "next";
import PlanetPage, { type PlanetPageProps } from "@/app/planet/PlanetPage";

export const metadata: Metadata = {
  title: "Saturn | Project ALPHA",
  description: "Dive into Saturn: the ringed gas giant with shimmering ice bands and a rich moon system.",
};

const saturnData: Omit<PlanetPageProps, "planetName" | "visualExtras"> = {
  heroTag: "The Ringed Giant",
  heroTitle: "SATURN :",
  heroAccent: "The Golden Titan",
  heroDescription: "A majestic gas giant wrapped in icy rings and a cloud deck rich in hydrogen. Saturn's low density belies a powerful magnetosphere and a family of volatile moons.",
  stats: [
    { iconName: "Thermometer", value: "-139°C", label: "Average Temperature", detail: "Temperatures vary across cloud layers." },
    { iconName: "Mountain", value: "10.44 m/s²", label: "Surface Gravity", detail: "Strong gravity at the cloud tops." },
    { iconName: "Clock", value: "10.7 hrs", label: "Day Length", detail: "One rapid rotation around its axis." },
    { iconName: "Orbit", value: "83 Moons", label: "Moons & Rings", detail: "Including Titan, Enceladus, and icy ring shepherds." },
  ],
  overviewText: "Saturn is the sixth planet from the Sun, known for the most extensive and complex ring system in the solar system. Its thick atmosphere is mostly hydrogen and helium, punctuated by storms, hexagonal polar jets, and dynamic banded weather. Saturn's largest moon, Titan, hides a methane cycle, while Enceladus ejects ice grains from an internal ocean.",
  videoSrc: "/videos/saturn-overview.mp4",
  missions: [
    { year: "1979", name: "Pioneer 11 Flyby", type: "First Saturn Encounter" },
    { year: "1980", name: "Voyager 1", type: "Flyby" },
    { year: "1981", name: "Voyager 2", type: "Flyby" },
    { year: "1997", name: "Cassini–Huygens Launch", type: "Orbiter Mission" },
    { year: "2004", name: "Cassini Orbit Insertion", type: "Saturn System Study" },
    { year: "2015", name: "Cassini Grand Finale", type: "Ring Dive" },
    { year: "2027", name: "Dragonfly to Titan", type: "Future Mission" },
  ],
  papers: [
    { id: 1, title: "Cassini's Legacy at Saturn", author: "Porco, C. C., et al.", date: "2019", journal: "Science", link: "https://www.science.org/doi/10.1126/science.aax6461" },
    { id: 2, title: "Titan's Methane Cycle", author: "Stofan, E. R., et al.", date: "2007", journal: "Nature", link: "https://www.nature.com/articles/nature06494" },
    { id: 3, title: "Saturn's Ring Particle Dynamics", author: "Hedman, M. M., et al.", date: "2013", journal: "The Astrophysical Journal", link: "https://iopscience.iop.org/article/10.1088/0004-637X/775/1/51" },
    { id: 4, title: "Enceladus: An Ocean World", author: "Porco, C. C., et al.", date: "2006", journal: "Science", link: "https://www.science.org/doi/10.1126/science.1139505" },
    { id: 5, title: "Saturn's Hexagonal Jet Stream", author: "Godfrey, D.", date: "1988", journal: "Icarus", link: "https://www.sciencedirect.com/science/article/pii/0019103588901022" },
  ],
  atmospherePoints: [
    { x: 0, label: "Cloud", main: 96.3, secondary: 3.25, tertiary: 0.45 },
    { x: 20, label: "Upper", main: 96.1, secondary: 3.3, tertiary: 0.5 },
    { x: 40, label: "Mid", main: 96.4, secondary: 3.2, tertiary: 0.4 },
    { x: 60, label: "Lower", main: 96.2, secondary: 3.3, tertiary: 0.45 },
    { x: 80, label: "Deep", main: 96.3, secondary: 3.25, tertiary: 0.45 },
    { x: 100, label: "Core", main: 96.3, secondary: 3.25, tertiary: 0.45 },
  ],
  gasSummary: [
    { label: "Hydrogen", value: "~96%", color: "#fbbf24" },
    { label: "Helium", value: "~3%", color: "#f59e0b" },
    { label: "Methane", value: "~0.5%", color: "#f97316" },
  ],
  habitatScore: "10%",
  habitatLabel: "Probe Viability",
  environmentTitle: "Gas Giant Atmosphere",
  environmentDescription: "Saturn's brutal pressure and cold make it impossible for humans, but perfect for studying giant planet physics and ring-moon interactions.",
  calloutTitle: "Saturn's Noble Rings",
  calloutDescription: "Saturn's ring system is the most extensive in the solar system, containing ice, rock, and thousands of shepherd moons that sculpt its structure.",
  buttonText: "Learn About Saturn Missions",
  modelLink: "https://eyes.nasa.gov/apps/solar-system/#/saturn",
  showFaq: false,
  showReferences: false,
  faq: [
    { question: "Why does Saturn appear flattened?", answer: "Saturn spins rapidly, causing its equator to bulge and giving the planet an oblate shape." },
    { question: "How do Saturn's rings form?", answer: "The rings are made of ice and rock, likely from disrupted moons or cometary debris captured by Saturn's gravity." },
    { question: "Could Titan support life?", answer: "Titan's surface liquids and organic chemistry make it a prime target for prebiotic chemistry, though conditions differ greatly from Earth." },
  ],
  references: [
    { label: "NASA Cassini Mission", link: "https://solarsystem.nasa.gov/missions/cassini/overview/" },
    { label: "Saturn Facts - NASA Solar System Exploration", link: "https://solarsystem.nasa.gov/planets/saturn/overview/" },
  ],
  palette: {
    tagBg: "#f59e0b",
    tagShadow: "rgba(245, 158, 11, 0.35)",
    accent: "#d97706",
    accentText: "#fde047",
    icon: "text-amber-500 dark:text-amber-400",
    secondaryIcon: "text-orange-400 dark:text-amber-300",
    graph1: "#fbbf24",
    graph2: "#f97316",
    graph3: "#c2410c",
    calloutFrom: "#78350f",
    calloutTo: "#f59e0b",
    ringGlow: "rgba(249, 115, 22, 0.25)",
  },
};

function SaturnPage() {
  return (
    <PlanetPage
      planetName="Saturn"
      {...saturnData}
      visualExtras={
        <>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[100px] rounded-full border border-[#fbbf24]/40 blur-xl" style={{ transform: "translate(-50%, -43%) rotate(18deg)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[390px] h-[90px] rounded-full border border-[#f59e0b]/15" style={{ transform: "translate(-50%, -44%) rotate(18deg)" }} />
        </>
      }
    />
  );
}

export default SaturnPage;
