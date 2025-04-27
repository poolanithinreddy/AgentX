// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please fill all fields!');
      return;
    }

    try {
      const res = await fetch('https://agentx-backend-gyhjh6epgyafftey.canadacentral-01.azurewebsites.net/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('agentx_user', email);
        localStorage.setItem('agentx_name', data.name); // Save name too
        navigate('/chat');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box glass">
        <h2>Login to AgentX 🚀</h2>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        <button onClick={() => navigate('/signup')} style={{ marginTop: '10px', background: 'gray' }}>
          New user? Signup
        </button>
      </div>
    </div>
  );
}
