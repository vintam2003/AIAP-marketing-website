const PLATFORM_LINK = "https://aiap.up.railway.app/";

function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-left">
          <div className="section-label">
            ATM Intelligence & Availability Platform
          </div>

          <h1>
            Predicting ATM failures before customers experience them.
          </h1>

          <p>
            AIAP helps banks monitor ATM health, predict failures,
            forecast cash depletion, and guide customers to reliable
            ATMs in real time.
          </p>

          <div className="hero-buttons">
            <a href="#demo" className="primary-btn">
              Play Demo
            </a>

            <a
              href={PLATFORM_LINK}
              target="_blank"
              rel="noreferrer"
              className="secondary-btn"
            >
              Launch Full Platform
            </a>
          </div>
        </div>

        <div className="hero-right">
          <div className="dashboard-card">
            <span>Fleet Health</span>
            <strong>87%</strong>
            <p>12 ATMs monitored in real time</p>
          </div>

          <div className="status-card green">
            ATM C available
          </div>

          <div className="status-card yellow">
            ATM B low cash warning
          </div>

          <div className="status-card red">
            ATM A failure risk
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;