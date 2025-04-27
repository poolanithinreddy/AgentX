// server/index.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { CosmosClient } from "@azure/cosmos";
import chatRoutes from './routes/chatRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Cosmos DB Setup
const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;

if (!endpoint || !key) {
  throw new Error('❌ Missing Cosmos DB configuration in environment variables!');
}

const client = new CosmosClient({ endpoint, key });
const database = client.database('AgentX-DB');
const userContainer = database.container('Users');
const chatContainer = database.container('ChatHistory');
const focusContainer = database.container('FocusSessions');

// Chat Routes (for /api/chat endpoints)
app.use('/api/chat', chatRoutes);

// Signup Route
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const { resource: existingUser } = await userContainer.item(email, email).read();
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }
  } catch (err) {
    // It's okay if user doesn't exist
  }

  try {
    await userContainer.items.create({ id: email, email, password, name });
    res.status(201).json({ message: "Signup successful." });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ message: "Signup failed." });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const { resource: user } = await userContainer.item(email, email).read();
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (user.password !== password) {
      return res.status(401).json({ message: "Incorrect password." });
    }
    res.status(200).json({ message: "Login successful.", name: user.name });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: "Login failed." });
  }
});

// Save Chat History Route
app.post('/api/chat/saveHistory', async (req, res) => {
  const { email, history } = req.body;
  if (!email || !history) {
    return res.status(400).json({ message: 'Missing email or history.' });
  }

  try {
    await chatContainer.items.upsert({
      id: email,
      email,
      history, // history = [{ role, content, agent, timestamp }]
      timestamp: new Date().toISOString(),
    });
    res.status(200).json({ message: 'History saved successfully.' });
  } catch (error) {
    console.error('Save history error:', error.message);
    res.status(500).json({ message: 'Error saving chat history.' });
  }
});

// Get Chat History Route
app.get('/api/chat/getHistory/:email', async (req, res) => {
  const { email } = req.params;
  if (!email) {
    return res.status(400).json({ message: 'Missing email.' });
  }

  try {
    const { resource } = await chatContainer.item(email, email).read();
    if (!resource) {
      return res.status(404).json({ message: 'No chat history found.' });
    }
    res.status(200).json(resource.history);
  } catch (error) {
    console.error('Get history error:', error.message);
    res.status(500).json({ message: 'Error fetching chat history.' });
  }
});

// Save Focus Session Route
app.post('/api/focus/saveSession', async (req, res) => {
  const { id, email, mode, duration, completedAt } = req.body;
  if (!id || !email || !mode || !duration || !completedAt) {
    return res.status(400).json({ message: 'Missing fields.' });
  }

  try {
    await focusContainer.items.create({ id, email, mode, duration, completedAt });
    res.status(201).json({ message: 'Focus session saved successfully.' });
  } catch (error) {
    console.error('Save focus session error:', error.message);
    res.status(500).json({ message: 'Error saving focus session.' });
  }
});

// Get Focus Sessions Route
app.get('/api/focus/getSessions/:email', async (req, res) => {
  const { email } = req.params;
  if (!email) {
    return res.status(400).json({ message: 'Missing email.' });
  }

  try {
    const query = {
      query: "SELECT * FROM c WHERE c.email = @email",
      parameters: [{ name: "@email", value: email }],
    };
    const { resources } = await focusContainer.items.query(query).fetchAll();
    res.status(200).json(resources);
  } catch (error) {
    console.error('Get focus sessions error:', error.message);
    res.status(500).json({ message: 'Error fetching focus sessions.' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
