import { useEffect, useMemo, useRef, useState } from "react";

const ATM_BASE = [

  {
    id: 1,
    name: "ATM A",
    className: "atm red",
  },
  {
    id: 2,
    name: "ATM B",
    className: "atm yellow",
  },
  {
    id: 3,
    name: "ATM C",
    className: "atm green",
  },
];

const STATUS = {
  working: {
    label: "Operational",
    detail: "Ready for customers",
  },
  lowCash: {
    label: "Low Cash",
    detail: "May run out soon",
  },
  failed: {
    label: "Out of Service",
    detail: "Do not use",
  },
};

function randomizeAtms() {
  const order = ["working", "lowCash", "failed"].sort(
    () => Math.random() - 0.5
  );

  return ATM_BASE.map((atm, index) => ({
    ...atm,
    status: order[index],
    attempted: false,
    working: order[index] === "working",
    risk:
      order[index] === "working"
        ? "Recommended by AIAP"
        : order[index] === "lowCash"
        ? "Cash may deplete"
        : "High failure risk",
  }));
}

function LunchRushGame() {
  const [aiapMode, setAiapMode] = useState(false);
  const [stress, setStress] = useState(20);
  const [timeLeft, setTimeLeft] = useState(45);
  const initialTimeRef = useRef(45);
  const stressRef = useRef(stress);
  const timeLeftRef = useRef(timeLeft);
  const usedAtmsRef = useRef(0);
  const aiapModeRef = useRef(false);


  const [cash, setCash] = useState(false);

  const [message, setMessage] = useState(
    "Start the demo and choose an ATM before your lunch break disappears."
  );
  const [gameStatus, setGameStatus] = useState("ready");
  const [atms, setAtms] = useState(() => randomizeAtms());

  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    try {
      const raw = window.localStorage.getItem("aiap_best_score");
      const parsed = raw ? Number(raw) : 0;
      return Number.isFinite(parsed) ? parsed : 0;
    } catch {
      return 0;
    }
  });

  const [usedAtms, setUsedAtms] = useState(0);


  const bestScoreRef = useRef(bestScore);

  useEffect(() => {
    bestScoreRef.current = bestScore;
  }, [bestScore]);

  useEffect(() => {
    if (gameStatus !== "playing") return;

    const timer = window.setInterval(() => {
      setTimeLeft((current) => {
        // Keep refs in sync to avoid stale closure issues.
        timeLeftRef.current = current;

        if (current <= 1) {
          window.clearInterval(timer);
          const finalTime = current;
          const base = 250;
          const timeBonus = Math.round(finalTime * 7);
          const stressPenalty = Math.round(stressRef.current * 2.2);
          const attemptPenalty = Math.max(
            0,
            (usedAtmsRef.current - 1) * 35
          );
          const aiapPenalty = aiapModeRef.current ? 30 : 0;
          const timeBasedScore = Math.max(
            0,
            base + timeBonus - stressPenalty - attemptPenalty - aiapPenalty
          );
          setScore(timeBasedScore);

          try {
            const nextBest = Math.max(
              bestScoreRef.current,
              timeBasedScore
            );
            if (nextBest !== bestScoreRef.current) {
              window.localStorage.setItem(
                "aiap_best_score",
                String(nextBest)
              );
              setBestScore(nextBest);
            }
          } catch {
            // ignore localStorage errors
          }

          setGameStatus("lost");
          setMessage(
            "Time ran out. AIAP would have guided the customer to a working ATM."
          );
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [gameStatus]);

  const recommendedAtm = useMemo(
    () => atms.find((atm) => atm.working),
    [atms]
  );

  function startGame() {
    setAtms(randomizeAtms());
    setStress(20);
    setTimeLeft(45);
    setCash(false);
    setScore(0);
    setUsedAtms(0);
    initialTimeRef.current = 45;

    stressRef.current = 20;
    timeLeftRef.current = 45;
    usedAtmsRef.current = 0;
    aiapModeRef.current = aiapMode;

    setMessage(
      "Lunch rush started. Find a working ATM before time or stress runs out."
    );
    setGameStatus("playing");
  }

  useEffect(() => {
    aiapModeRef.current = aiapMode;
  }, [aiapMode]);

  function visitATM(atm) {
    if (gameStatus !== "playing") return;

    const currentStress = stressRef.current;
    const currentTimeLeft = timeLeftRef.current;
    const currentUsedAtms = usedAtmsRef.current;
    const currentAiapMode = aiapModeRef.current;

    const penalty = atm.working ? 0 : currentAiapMode ? 18 : 28;
    const nextStress = atm.working
      ? Math.max(currentStress - 12, 0)
      : Math.min(currentStress + penalty, 100);

    const nextTimeLeft = Math.max(
      currentTimeLeft - (currentAiapMode ? 8 : 10),
      0
    );
    const nextUsedAtms = currentUsedAtms + 1;


    setStress(nextStress);
    setTimeLeft(nextTimeLeft);
    setUsedAtms(nextUsedAtms);
    setAtms((current) =>
      current.map((item) =>
        item.id === atm.id ? { ...item, attempted: true } : item
      )
    );

    // Scoring model:
    // - reward success
    // - reward remaining time and lower stress
    // - penalize extra attempts and whether AIAP was used
    const successBase = 1000;
    const timeBonus = Math.round(nextTimeLeft * 8);
    const stressBonus = Math.round((100 - nextStress) * 6);
    const attemptPenalty = Math.max(0, (nextUsedAtms - 1) * 60);
    const aiapPenalty = aiapMode ? 80 : 0;
    const computedScore =
      successBase + timeBonus + stressBonus - attemptPenalty - aiapPenalty;

    if (atm.working) {
      setCash(true);
      setScore(computedScore);
      stressRef.current = nextStress;
      timeLeftRef.current = nextTimeLeft;
      usedAtmsRef.current = nextUsedAtms;
      setGameStatus("won");
      setMessage(
        `Success! ${atm.name} is operational. AIAP helped you stay on schedule.`
      );

      try {
        const nextBest = Math.max(bestScore, computedScore);
        if (nextBest !== bestScore) {
          window.localStorage.setItem("aiap_best_score", String(nextBest));
          setBestScore(nextBest);
        }
      } catch {
        // ignore localStorage errors
      }

      return;
    }



    if (nextStress >= 100 || nextTimeLeft <= 0) {
      stressRef.current = nextStress;
      timeLeftRef.current = nextTimeLeft;
      usedAtmsRef.current = nextUsedAtms;

      const base = 350;
      const timeBonus = Math.round(nextTimeLeft * 5);
      const stressPenalty = Math.round(nextStress * 2);
      const attemptPenalty = Math.max(0, (nextUsedAtms - 1) * 45);
      const aiapPenalty = aiapMode ? 30 : 0;
      const computedScore =
        Math.max(0, base + timeBonus - stressPenalty - attemptPenalty - aiapPenalty);

      setScore(computedScore);
      setGameStatus("lost");
      setMessage(
        `${atm.name} failed and stress peaked. A real customer would be frustrated.`
      );
      return;
    }


    setMessage(
      `${atm.name} is not working. Keep hunting — AIAP can help reduce the guesswork.`
    );
  }

  function resetGame() {
    setAtms(randomizeAtms());
    setStress(20);
    setTimeLeft(45);
    setCash(false);
    setScore(0);
    setUsedAtms(0);
    setGameStatus("ready");
    setMessage(
      "Ready for a new demo. Turn on AIAP to reveal the best ATM choice."
    );
  }

  return (
    <section className="game-section" id="demo">
      <div className="section-label">Interactive Demo</div>

      <h2>Lunch Rush ATM Challenge</h2>

      <p>
        Experience how AIAP turns an uncertain ATM hunt into a predictable
        customer experience.
      </p>

      {gameStatus === "ready" && (
        <div className="game-instructions">
          <strong>How to play</strong>
          <ul>
            <li>Click Start Demo to begin the lunch rush.</li>
            <li>Choose an ATM and see if it is operational.</li>
            <li>Enable AIAP to reveal the recommended ATM choice.</li>
            <li>Beat the clock and keep stress below 100%.</li>
          </ul>
        </div>
      )}

      <div className="game-buttons">
        <button className="primary-btn" onClick={startGame}>
          {gameStatus === "playing" ? "Restart Demo" : "Start Demo"}
        </button>

        <button
          className={`secondary-btn ${aiapMode ? "active" : ""}`}
          onClick={() => setAiapMode((current) => !current)}
          disabled={gameStatus !== "playing"}
        >
          {aiapMode ? "AIAP Assistance On" : "Enable AIAP"}
        </button>

        <button className="secondary-btn" onClick={resetGame}>
          Reset
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Time Left</span>
          <strong>{timeLeft}s</strong>
        </div>

        <div className="stat-card">
          <span>Stress</span>
          <strong>{stress}%</strong>
        </div>

        <div className="stat-card">
          <span>Outcome</span>
          <strong>
            {gameStatus === "won"
              ? "Success"
              : gameStatus === "lost"
              ? "Missed"
              : "In Progress"}
          </strong>
        </div>
      </div>

      {(gameStatus === "won" || gameStatus === "lost") && (
        <div className="recap" aria-live="polite">
          <div className="recap-inner">
            <div className="recap-badge">
              {gameStatus === "won" ? "✅ Success" : "❌ Missed"}
            </div>
            <h3>Demo Recap</h3>
            <p className="recap-text">
              Score: <strong>{score}</strong>
              {bestScore ? (
                <>
                  {" "}• Best: <strong>{bestScore}</strong>
                </>
              ) : null}
            </p>
            <p className="recap-text subtle">
              AIAP mode: <strong>{aiapMode ? "On" : "Off"}</strong> • Attempts:{" "}
              <strong>{usedAtms}</strong>
            </p>
            <div className="recap-actions">
              <button className="primary-btn" onClick={resetGame}>
                Play Again
              </button>
              <button
                className="secondary-btn"
                onClick={() => {
                  setAiapMode(true);
                }}
              >
                Enable AIAP
              </button>
            </div>
          </div>
        </div>
      )}


      <div className="meter">
        <div style={{ width: `${stress}%` }} />
      </div>

      <div className="demo-info">
        {gameStatus === "playing" && (
          <p>
            {aiapMode
              ? `AIAP recommends ${recommendedAtm.name}.`
              : "AIAP is disabled — ATM statuses are hidden until you enable it."}
          </p>
        )}
      </div>

      <div className="atm-grid">
        {atms.map((atm) => {
          const label = aiapMode
            ? STATUS[atm.status].label
            : atm.attempted
            ? STATUS[atm.status].label
            : "Status unknown";

          return (
            <button
              key={atm.id}
              className={`${atm.className} ${
                aiapMode && atm.working ? "recommended" : ""
              } ${atm.attempted ? "attempted" : ""}`}
              onClick={() => visitATM(atm)}
              disabled={cash || gameStatus !== "playing" || atm.attempted}
            >
              <span>🏧</span>
              <strong>{atm.name}</strong>
              <small>{label}</small>
              {aiapMode && atm.attempted && (
                <small>{STATUS[atm.status].detail}</small>
              )}
            </button>
          );
        })}
      </div>

      <div className={`game-message ${gameStatus}`}>
        {message}
      </div>
    </section>
  );
}

export default LunchRushGame;
