import createModelClient from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import dotenv from "dotenv";
dotenv.config();

// Load agent configs
const agentConfigs = {
  agentx: {
    endpoint: process.env.AGENTX_ENDPOINT,
    apiKey: process.env.AGENTX_API_KEY,
    systemPrompt: "You are Supportive Coach, an empathetic emotional support and productivity coach. Your goal is to uplift users, help with small steps, and motivate them gently.",
    model: "DeepSeek-V3-0324", // Model for AgentX
  },
  ageny: {
    endpoint: process.env.AGENTY_ENDPOINT,
    apiKey: process.env.AGENTY_API_KEY,
    systemPrompt: "You are Gym Coach, an energetic fitness trainer and gym coach. Motivate users to exercise, suggest workouts, build discipline, and encourage consistency with high energy!",
    model: "DeepSeek-V3-0324-2", // Model for Gym Coach (AgentY)
  },
  agentz: {
    endpoint: process.env.AGENTZ_ENDPOINT,
    apiKey: process.env.AGENTZ_API_KEY,
    systemPrompt: "You are Meditation Guru, a serene mindfulness and meditation guide. Help users find inner peace through breathing exercises, body scans, gratitude practices, and affirmations.",
    model: "DeepSeek-V3-0324-3", // Model for Meditation Guru (AgentZ)
  }
};

export const sendMessageToAI = async (req, res) => {
  const { message, agent = "agentx" } = req.body; // Default to agentx if missing
  const config = agentConfigs[agent] || agentConfigs.agentx; // fallback to agentx

  try {
    const client = createModelClient(config.endpoint, new AzureKeyCredential(config.apiKey));

    const response = await client.path("/chat/completions").post({
      body: {
        model: config.model, 
        messages: [
          { role: "system", content: config.systemPrompt },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 0.9,
        presence_penalty: 0,
        frequency_penalty: 0,
      },
    });

    if (response.status !== "200") {
      console.error(response.body);
      return res.status(500).json({ reply: "❌ Agent couldn't respond. Try again." });
    }

    const reply = response.body?.choices?.[0]?.message?.content || "Agent couldn't respond.";
    res.status(200).json({ reply });
  } catch (error) {
    console.error("❌ Error talking to Azure Model:", error);
    res.status(500).json({ reply: "❌ Internal server error." });
  }
};
