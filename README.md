# 🌟 AgentX – Your AI Life Copilot

> Empowering Focus. Enhancing Productivity. Supporting Mental Wellness.

AgentX is a next-gen, emotionally-intelligent AI agent built to support focus, emotional growth, and wellness. Designed during the **Microsoft AI Agents Hackathon**, it leverages the best of **Microsoft Azure** — including **Azure AI Foundry**, **Azure CosmosDB**, and **Azure App Services** — to deliver an impactful, personalized experience.

---

## 🚀 What is AgentX?

AgentX helps users — especially neurodivergent individuals — lead more balanced, productive lives by combining empathetic AI chat, real-time emotion tracking, and personalized focus sessions.

### Key Functionalities
- 🌟 **Supportive AI Chat**: Engage with 3 AI guides (Emotional Support, Gym Coach, Mindfulness Guru)
- ⏰ **Focus Coaching**: Track timed productivity sessions with journaling and summaries
- 💪 **Mood Tracking**: Record and visualize daily emotional patterns
- 🔐 **Secure Data**: Per-user CosmosDB records, no sharing or external access

> Built with empathy, deployed on Azure, and powered by DeepSeek via Azure AI Foundry.

---

## 🛠️ Tech Stack

| Layer       | Technologies Used                                  |
|------------|------------------------------------------------------|
| Frontend   | React.js (Vite), TailwindCSS, Framer Motion          |
| Backend    | Node.js, Express.js (Hosted on **Azure App Services**) |
| Database   | **Azure CosmosDB (NoSQL)** – stores per-user chat and focus sessions |
| AI Models  | **DeepSeek Model** via Azure AI Foundry (Chat + Guidance) |
| Hosting    | **Frontend on Firebase/Vercel** → https://agentx1.web.app |

---

## ⚙️ Architecture Diagram

```
[ React + Vite Frontend (Firebase Hosting) ]
               |
               v
[ Node.js + Express Backend (Azure App Services) ]
               |
               v
+--------------------------------------------+
|                Microsoft Azure              |
|--------------------------------------------|
| - Azure CosmosDB (chat & focus history)     |
| - Azure AI Foundry (DeepSeek Chat Model)     |
| - Azure Identity / App Service (Hosting)    |
+--------------------------------------------+
```

> Modular, cloud-native, and built for real-time human-AI wellness support.

---

## 📂 Features

- ✅ Emotionally-aware AI chat with 3 personas (Supportive Coach, Gym Trainer, Meditation Guru)
- ✅ Chat history stored securely in CosmosDB with per-user separation
- ✅ Total focus time calculation and timestamped productivity sessions
- ✅ Mood graph visualization and journaling
- ✅ Hosted frontend at: https://agentx1.web.app
- ✅ Fully responsive, mobile-friendly UI with dark mode

---

## 🧠 Responsible AI

AgentX adheres to Microsoft’s Responsible AI practices:
- ⛔️ No diagnosis or medical advice
- 🔒 All user data is private (stored per email in CosmosDB)
- 📊 Disclaimers and empathetic tone baked into all agent replies
- 🫫 Human-in-the-loop interactions encouraged via journaling and mood check-ins

---

## 🗃️ Screenshots

| Homepage | Focus Tracker | AI Chat | Dashboard |
|----------|----------------|---------|-----------|
| ![](screenshots/home.png) | ![](screenshots/focus.png) | ![](screenshots/chat.png) | ![](screenshots/dashboard.png) |

> All screens support light/dark mode and are optimized for accessibility.

---

## 🛠️ Getting Started

### 1. Clone Repo
```bash
git clone https://github.com/poolanithinreddy/AgentX.git
cd AgentX
```

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Setup Backend
```bash
cd server
npm install
npm run dev
```
Server will run at `http://localhost:5000`

### 4. Environment Variables
Inside `server/.env`:
```ini
PORT=5000
COSMOS_ENDPOINT=your_cosmosdb_endpoint
COSMOS_KEY=your_cosmos_key
AZURE_OPENAI_DEPLOYMENT_NAME=deepseek-deployment
AGENTX_API_KEY=your_azure_ai_key
AGENTX_ENDPOINT=https://your-deepseek-endpoint.openai.azure.com/
```
> ❌ Never commit this file publicly

---

## 🚧 Development Notes

### Security
- ⚡ API sanitization for inputs
- ✅ CosmosDB document validation
- ⛔️ .env isolation of secrets

### Testing
- Basic chat mocks available for local testing
- Manual end-to-end tests completed on Azure

### Roadmap
- ✔ Semantic Kernel agent orchestration (next phase)
- ✔ Journaling insights + timeline
- ✔ Mobile PWA version
- ✔ Expanded mental health check-ins

---

## 🤝 Contributing
We welcome contributions!
- Fork the repo
- Create a feature branch
- Submit a PR with a clear description

---

## 📚 License
MIT License — free for personal and commercial use with attribution.

---

## ✨ Why It Matters

> Created for the **Microsoft AI Agents Hackathon**, AgentX is more than a productivity tool — it's a compassionate AI companion built with **Microsoft Azure’s best technologies**.

- Aligns with **Best Overall Agent**, **Best Azure AI Agent Service**
- Built using **Azure AI Foundry (DeepSeek)** + **Azure CosmosDB** + **Azure App Hosting**
- Clean architecture, real user data tracking, and end-to-end emotional awareness

---

## 🌟 Give us a Star
If you believe in building emotionally-aware technology that supports humans in meaningful ways — please consider giving AgentX a ⭐. Let’s build a future where AI empowers emotional wellness.

---

*Made with ❤️ during the Microsoft AI Agents Hackathon*

