const FEATURES = [
  {
    title: "Reliable Decisions",
    description:
      "AIAP evaluates uncertainty and recommends the most available option—so customers stop guessing.",
  },
  {
    title: "Guided Customer Flow",
    description:
      "Turn stressful moments into clear steps. AIAP reduces friction while keeping operations predictable.",
  },
  {
    title: "Actionable Availability",
    description:
      "Know which locations are working and which are degrading before they impact your lunch rush.",
  },
];

function Features() {
  return (
    <section className="section" id="features">
      <div className="section-label">Features</div>
      <h2>Predictable customer outcomes—even when availability is uncertain</h2>
      <p>
        AIAP helps you convert real-world uncertainty into a guided experience.
        The result: fewer failed attempts, less frustration, and better throughput.
      </p>

      <div className="feature-grid">
        {FEATURES.map((f) => (
          <div className="feature-card" key={f.title}>
            <h3>{f.title}</h3>
            <p>{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;

