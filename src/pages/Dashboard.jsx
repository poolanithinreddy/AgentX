import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import './Dashboard.css';

const mockEmotionData = [
  { time: '9 AM', mood: 6 },
  { time: '11 AM', mood: 8 },
  { time: '1 PM', mood: 5 },
  { time: '3 PM', mood: 7 },
  { time: '5 PM', mood: 9 },
  { time: '7 PM', mood: 6 },
];

export default function Dashboard() {
  const [daySummary, setDaySummary] = useState({
    emotionAvg: 7.1, // Static for now
    focusTotal: 0,
    focusSessions: [],
  });

  const userEmail = localStorage.getItem('agentx_user');

  useEffect(() => {
    if (userEmail) {
      fetchFocusData();
    }
  }, [userEmail]);

  const fetchFocusData = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/focus/getSessions/${userEmail}`);
      if (res.ok) {
        const data = await res.json();
        console.log("✅ Focus sessions fetched:", data);

        const totalFocusMinutes = data.reduce((sum, session) => sum + (session.duration / 60), 0);

        setDaySummary({
          emotionAvg: 7.1,
          focusTotal: Math.round(totalFocusMinutes),
          focusSessions: data.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt)), // Latest first
        });
      } else {
        console.error('❌ Failed to fetch focus sessions.');
      }
    } catch (error) {
      console.error('❌ Error fetching focus data:', error.message);
    }
  };

  return (
    <div className="dashboard-container">
      <motion.h2
        className="dashboard-title"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        📊 Your Daily Summary
      </motion.h2>

      <div className="dashboard-grid">
        {/* Mood Tracker */}
        <motion.div
          className="dashboard-card glassmorphic"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="card-title">Mood Tracker 😌</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={mockEmotionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2c2c2c" />
              <XAxis dataKey="time" stroke="#888" />
              <YAxis domain={[0, 10]} stroke="#888" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="card-meta">
            Average Mood Score: <strong>{daySummary.emotionAvg}/10</strong>
          </p>
        </motion.div>

        {/* Focus Sessions */}
        <motion.div
          className="dashboard-card glassmorphic"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="card-title">Focus Sessions ⏱️</h3>
          <ul className="focus-list">
            {daySummary.focusSessions.map((item, idx) => (
              <li key={idx} className="focus-item">
                <span>{new Date(item.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span>{Math.round(item.duration / 60)} min</span>
              </li>
            ))}
          </ul>
          <p className="card-meta">
            Total Focus Time: <strong>{daySummary.focusTotal} mins</strong>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
