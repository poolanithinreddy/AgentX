import { useState, useEffect } from "react";
import { FaPause, FaPlay, FaRedo } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import "./Focus.css";

export default function Focus() {
  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("Focus");
  const userEmail = localStorage.getItem('agentx_user');

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prev) => {
          if (prev <= 1) {
            handleEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleEnd = async () => {
    setIsRunning(false);

    await saveFocusSession(mode, mode === "Focus" ? 1500 : 300);

    const nextMode = mode === "Focus" ? "Break" : "Focus";
    setMode(nextMode);
    setTime(nextMode === "Focus" ? 25 * 60 : 5 * 60);
  };

  const resetTimer = async () => {
    setIsRunning(false);

    if (time !== (mode === "Focus" ? 1500 : 300)) {
      // Save only if some time was spent
      await saveFocusSession(mode, mode === "Focus" ? (1500 - time) : (300 - time));
    }

    setTime(mode === "Focus" ? 25 * 60 : 5 * 60);
  };

  const saveFocusSession = async (completedMode, duration) => {
    try {
      await fetch('http://localhost:5000/api/focus/saveSession', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: uuidv4(),
          email: userEmail,
          mode: completedMode,
          duration: duration,
          completedAt: new Date().toISOString(),
        }),
      });
      console.log("✅ Focus session saved!");
    } catch (err) {
      console.error("❌ Error saving focus session:", err);
    }
  };

  const formatTime = (t) => {
    const m = Math.floor(t / 60).toString().padStart(2, "0");
    const s = (t % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const percentage = mode === "Focus"
    ? ((1500 - time) / 1500) * 100
    : ((300 - time) / 300) * 100;

  return (
    <div className="focus-container">
      <div className="focus-glass">
        {/* Progress Ring */}
        <div className="progress-ring">
          <svg viewBox="0 0 100 100" className="progress-svg">
            <circle cx="50" cy="50" r="45" className="progress-bg" />
            <circle
              cx="50"
              cy="50"
              r="45"
              className="progress-fg"
              style={{
                strokeDasharray: "282",
                strokeDashoffset: `${282 - (282 * percentage) / 100}`,
              }}
            />
          </svg>
        </div>

        {/* Timer */}
        <div className="timer-display">{formatTime(time)}</div>

        {/* Status */}
        <div className="focus-status">
          <h2>{mode === "Focus" ? "🧘 You’re in Focus Mode" : "🌴 Take a Short Break"}</h2>
          <p>AgentX: You're doing amazing. Stay grounded. ✨</p>
        </div>

        {/* Controls */}
        <div className="focus-buttons">
          <button onClick={() => setIsRunning(!isRunning)} className="btn-glow">
            {isRunning ? <FaPause /> : <FaPlay />}
          </button>
          <button onClick={resetTimer} className="btn-reset">
            <FaRedo />
          </button>
        </div>

        <button
          onClick={() => alert('Safe Zone Coming Soon!')}
          className="safe-zone-btn"
        >
          Feeling overwhelmed? Enter Safe Zone
        </button>
      </div>
    </div>
  );
}
