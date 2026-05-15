const BENEFITS = [
  {
    title: "Fewer Failed Attempts",
    description:
      "Customers choose the right endpoint sooner, reducing time wasted on non-operational options.",
  },
  {
    title: "Lower Operational Stress",
    description:
      "AIAP guidance decreases peak-time chaos by standardizing the path customers follow.",
  },
  {
    title: "Faster Throughput",
    description:
      "Better routing means more successful transactions per hour—especially during lunch rushes.",
  },
];

function Benefits() {
  return (
    <section className="section" id="benefits">
      <div className="container">
        <div className="section-label">Benefits</div>
        <h2>Outcomes your business can feel</h2>
        <p>
          AIAP reduces uncertainty at the moment it matters, turning friction into
          predictable customer experiences.
        </p>

        <div className="benefit-grid">
          {BENEFITS.map((b) => (
            <div className="benefit-card" key={b.title}>
              <h3>{b.title}</h3>
              <p>{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Benefits;

