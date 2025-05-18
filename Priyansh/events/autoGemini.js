const axios = require("axios");

const API_KEY = "AIzaSyDrpsAH4u0LRQeeV5tWYTILetz8-Xj9YXU"; // ← Yahan apna Gemini API key lagayein
const OWNER_ID = "100024385579728"; // ← Apna Facebook UID lagayein

module.exports = {
  name: "autoGemini",
  version: "1.0.0",
  author: "ChatGPT",
  description: "Gemini Auto Reply & Toggle via message",
  
  handleEvent: async function ({ api, event }) {
    const msg = event.body?.toLowerCase();
    if (!msg) return;

    // Toggle on/off via message
    if (event.senderID === OWNER_ID) {
      if (msg === ".gemini on") {
        global.autoGemini = true;
        return api.sendMessage("Gemini auto-reply *enabled* ho gaya hai.", event.threadID, event.messageID);
      }
      if (msg === ".gemini off") {
        global.autoGemini = false;
        return api.sendMessage("Gemini auto-reply *disabled* ho gaya hai.", event.threadID, event.messageID);
      }
    }

    // Auto reply if enabled
    if (!global.autoGemini) return;
    if (msg.startsWith(".")) return; // skip other commands

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
      api.sendMessage("Gemini se reply nahi mila.", event.threadID, event.messageID);
    }
  }
};
