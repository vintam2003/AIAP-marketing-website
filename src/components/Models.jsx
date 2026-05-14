const MODELS = [
  {
    title: "ATM Intelligence",
    description:
      "Detects availability signals and recommends operational endpoints under time constraints.",
  },
  {
    title: "Risk-Aware Recommendations",
    description:
      "Balances speed with failure probability—so the best choice is also the safest one.",
  },
  {
    title: "Operational Feedback Loop",
    description:
      "Continuously improves guidance based on outcomes and system conditions.",
  },
];

function Models() {
  return (
    <section className="section" id="models">
      <div className="section-label">Models</div>
      <h2>AIAP turns signals into recommendations</h2>
      <p>
        Our models are designed to reduce guesswork during peak demand. They
        translate uncertainty into clear next steps.
      </p>

      <div className="feature-grid">
        {MODELS.map((m) => (
          <div className="feature-card" key={m.title}>
            <h3>{m.title}</h3>
            <p>{m.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Models;

