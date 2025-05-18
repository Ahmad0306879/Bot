const axios = require("axios");

const API_KEY = "AIzaSyDrpsAH4u0LRQeeV5tWYTILetz8-Xj9YXU"; // ← Yahan apna Gemini API key confirm karein

module.exports = {
  name: "autoGemini",
  description: "Gemini Auto Reply on every message when enabled",
  author: "ChatGPT",
  version: "1.0.0",

  handleEvent: async function ({ api, event }) {
    const msg = event.body;
    if (!msg || msg.startsWith(".")) return;
    if (!global.autoGemini) return;

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
      console.log("Gemini API Error:", err.message);
      api.sendMessage("Gemini se reply nahi mila.", event.threadID, event.messageID);
    }
  }
};
