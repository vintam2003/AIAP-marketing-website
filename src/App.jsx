import "./styles/global.css";
import "./styles/navbar.css";
import "./styles/hero.css";
import "./styles/sections.css";
import "./styles/game.css";

import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import ProblemSection from "./components/ProblemSection.jsx";
import LunchRushGame from "./components/LunchRushGame.jsx";
import Features from "./components/Features.jsx";
import Models from "./components/Models.jsx";
import Benefits from "./components/Benefits.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <ProblemSection />
      <LunchRushGame />
      <Features />
      <Models />
      <Benefits />
      <Footer />
    </>
  );
}

export default App;