const axios = require("axios");
const API_KEY = "AIzaSyDrpsAH4u0LRQeeV5tWYTILetz8-Xj9YXU";

// Auto-reply flag
global.autoGemini = global.autoGemini || false;

module.exports = {
  config: {
    name: "geminiAutoReply",
    version: "1.0",
    author: "ChatGPT",
    description: "Gemini auto-reply on/off and response"
  },

  run: async function ({ event, api }) {
    const msg = event.body?.toLowerCase();

    // On Command
    if (msg === ".ahmad on") {
      global.autoGemini = true;
      return api.sendMessage("Gemini auto-reply is ON.", event.threadID, event.messageID);
    }

    // Off Command
    if (msg === ".ahmad off") {
      global.autoGemini = false;
      return api.sendMessage("Gemini auto-reply is OFF.", event.threadID, event.messageID);
    }

    // If auto mode is OFF, do nothing
    if (!global.autoGemini) return;

    // Don't respond to other bot commands
    if (msg.startsWith(".")) return;

    // Gemini API Call
    try {
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
        {
          contents: [{ parts: [{ text: msg }] }]
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const reply = res.data.candidates?.[0]?.content?.parts?.[0]?.text || "Mujhe samajh nahi aaya.";
      api.sendMessage(reply, event.threadID, event.messageID);
    } catch (err) {
      console.error("Gemini Error:", err.message);
      api.sendMessage("Gemini se reply nahi mil saka.", event.threadID, event.messageID);
    }
  }
};
