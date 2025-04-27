// src/pages/Signup.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Same CSS file - clean reuse

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert('Please fill all fields!');
      return;
    }

    try {
      const res = await fetch('https://agentx-backend-gyhjh6epgyafftey.canadacentral-01.azurewebsites.net/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Signup successful! Please login.');
        navigate('/login');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h2>Create Your AgentX Account 🚀</h2>
        <input
          type="text"
          placeholder="Enter Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Enter Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSignup}>Signup</button>
        <button
          className="secondary"
          onClick={() => navigate('/login')}
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}
