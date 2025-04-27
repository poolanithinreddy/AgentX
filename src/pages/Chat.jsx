import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMicrophone, FaPaperPlane, FaStop } from 'react-icons/fa';
import './Chat.css';

export default function Chat() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('agentx_user');

  const [historyMap, setHistoryMap] = useState({ agentx: [], ageny: [], agentz: [] });
  const [liveMessages, setLiveMessages] = useState([]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedAgent, setSelectedAgent] = useState('agentx');
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const spokeFromMicRef = useRef(false);
  const cursorLightRef = useRef(null);
  const particlesContainerRef = useRef(null);

  // Initialize cursor and particle effects
  useEffect(() => {
    // Create cursor light element
    const cursorLight = document.createElement('div');
    cursorLight.className = 'cursor-light';
    document.body.appendChild(cursorLight);
    cursorLightRef.current = cursorLight;

    // Create particles container
    const particles = document.createElement('div');
    particles.className = 'particles';
    document.body.appendChild(particles);
    particlesContainerRef.current = particles;

    // Cursor light effect
    const handleMouseMove = (e) => {
      cursorLight.style.left = `${e.clientX}px`;
      cursorLight.style.top = `${e.clientY}px`;
    };

    // Particles effect
    const createParticles = () => {
      const particleCount = 30;
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.width = `${Math.random() * 10 + 2}px`;
        particle.style.height = particle.style.width;
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        particle.style.animation = `float-up ${Math.random() * 10 + 10}s linear infinite`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particles.appendChild(particle);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    createParticles();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      // Clean up when component unmounts
      if (cursorLightRef.current) {
        document.body.removeChild(cursorLightRef.current);
      }
      if (particlesContainerRef.current) {
        document.body.removeChild(particlesContainerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!userEmail) {
      navigate('/login');
      return;
    }
    fetchHistory();
  }, [userEmail, navigate]);

  useEffect(() => {
    setLiveMessages([]);
  }, [selectedAgent]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [liveMessages, selectedAgent]);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/chat/getHistory/${userEmail}`);
      if (res.ok) {
        const fullHistory = await res.json();
        const map = { agentx: [], ageny: [], agentz: [] };
        for (const msg of fullHistory || []) {
          const agent = msg.agent || 'agentx';
          if (map[agent]) {
            map[agent].push(msg);
          }
        }
        setHistoryMap(map);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  const sendMessage = async (text = input) => {
    if (!text.trim()) return;

    const timestamp = new Date().toISOString();
    const userMessage = { role: 'user', content: text, agent: selectedAgent, timestamp };
    const updatedLiveMessages = [...liveMessages, userMessage];

    setLiveMessages(updatedLiveMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, agent: selectedAgent }),
      });

      const data = await res.json();
      const botReply = {
        role: 'assistant',
        content: data.reply || "Something went wrong 😢",
        agent: selectedAgent,
        timestamp: new Date().toISOString(),
      };

      const finalLiveMessages = [...updatedLiveMessages, botReply];
      setLiveMessages(finalLiveMessages);

      const combinedHistory = [
        ...(historyMap[selectedAgent] || []),
        ...finalLiveMessages,
      ];

      await saveHistory(selectedAgent, combinedHistory);
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveHistory = async (agent, agentHistory) => {
    const finalHistory = {
      agentx: agent === 'agentx' ? agentHistory : historyMap.agentx,
      ageny: agent === 'ageny' ? agentHistory : historyMap.ageny,
      agentz: agent === 'agentz' ? agentHistory : historyMap.agentz,
    };

    const combinedAllAgents = [
      ...finalHistory.agentx,
      ...finalHistory.ageny,
      ...finalHistory.agentz,
    ];

    try {
      await fetch('http://localhost:5000/api/chat/saveHistory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, history: combinedAllAgents }),
      });
      setHistoryMap(finalHistory);
    } catch (err) {
      console.error('Error saving chat history:', err);
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice recognition not supported!');
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      spokeFromMicRef.current = true;
      setListening(false);
      setTimeout(() => sendMessage(transcript), 200);
    };

    recognition.onerror = (event) => {
      console.error('Speech Recognition Error:', event);
      setListening(false);
    };

    recognition.onend = () => setListening(false);

    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
    if (input.trim()) {
      setTimeout(() => sendMessage(input), 100);
    }
  };

  const logout = () => {
    localStorage.removeItem('agentx_user');
    localStorage.removeItem('agentx_name');
    navigate('/login');
  };

  const getAgentLabel = (agent) => {
    switch (agent) {
      case 'agentx': return 'Emotional Support (Supportive Coach 🌟)';
      case 'ageny': return 'Gym Trainer (Workout Guide 🏋️)';
      case 'agentz': return 'Meditation Guru (Mindfulness 🧘)';
      default: return 'Agent';
    }
  };

  const renderFormattedContent = (content) => {
    const formatted = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>'); // Italic

    return (
      <div
        dangerouslySetInnerHTML={{ __html: formatted.replace(/\n/g, '<br/>') }}
      />
    );
  };

  return (
    <div className="chat-outer-wrapper">
      <div className="chat-window glass">
        {/* Header */}
        <div className="chat-header">
          <div className="agentx-brand">
            <img src="/icon.png" alt="AgentX" className="agentx-icon" />
            <h2>{getAgentLabel(selectedAgent)}</h2>
          </div>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>

        {/* Agent Selector */}
        <div className="agent-selector-bar">
          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="agent-select"
          >
            <option value="agentx">Emotional Support (Supportive Coach 🌟)</option>
            <option value="ageny">Gym Trainer (Workout Guide 🏋️)</option>
            <option value="agentz">Meditation Guru (Mindfulness 🧘)</option>
          </select>
        </div>

        {/* Tabs */}
        <div className="tab-bar">
          <button className={`tab ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>Chat</button>
          <button className={`tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>History</button>
        </div>

        {/* Main Content */}
        {activeTab === 'chat' ? (
          <div className="chat-messages">
            {liveMessages.map((msg, i) => (
              <div key={i} className={`message-row ${msg.role}`}>
                {msg.role === 'assistant' && <img src="/icon.png" alt="AgentX" className="avatar" />}
                <div className={`message-bubble ${msg.role}`}>
                  {renderFormattedContent(msg.content)}
                </div>
              </div>
            ))}

            {loading && (
              <div className="message-row assistant">
                <img src="/icon.png" alt="AgentX" className="avatar" />
                <div className="message-bubble assistant loading-bubble">
                  <span className="loading-dots"><span>.</span><span>.</span><span>.</span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="history-content">
            {(historyMap[selectedAgent] || []).map((msg, i) => (
              <div key={i} className="history-item">
                <strong>{msg.role === 'user' ? 'You:' : `${getAgentLabel(selectedAgent)}:`}</strong> {msg.content}
              </div>
            ))}
          </div>
        )}

        {/* Input Section */}
        <div className="chat-input-container">
          {!listening ? (
            <button className="icon-btn" onClick={startListening}><FaMicrophone /></button>
          ) : (
            <button className="icon-btn" onClick={stopListening}><FaStop /></button>
          )}
          <input
            type="text"
            placeholder={`Ask ${getAgentLabel(selectedAgent)} something...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button className="icon-btn send" onClick={() => sendMessage()}>
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
}
