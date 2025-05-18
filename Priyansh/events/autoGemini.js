const axios = require("axios");

const API_KEY = "AIzaSyDrpsAH4u0LRQeeV5tWYTILetz8-Xj9YXU";
const OWNER_ID = "100024385579728";

module.exports = {
  name: "autoGemini",
  handleEvent: async function ({ api, event }) {
    try {
      const msg = event.body?.trim();
      if (!msg) return;

      // Toggle Logic
      if (event.senderID === OWNER_ID && msg.toLowerCase() === ".gemini on") {
        global.autoGemini = true;
        return api.sendMessage("Gemini auto-reply is now ON.", event.threadID);
      }
      if (event.senderID === OWNER_ID && msg.toLowerCase() === ".gemini off") {
        global.autoGemini = false;
        return api.sendMessage("Gemini auto-reply is now OFF.", event.threadID);
      }

      // Stop if not enabled or message is a command
      if (!global.autoGemini || msg.startsWith(".")) return;

      // Gemini Request
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
        { contents: [{ parts: [{ text: msg }] }] },
        { headers: { "Content-Type": "application/json" } }
      );

      const reply = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No reply.";
      return api.sendMessage(reply, event.threadID, event.messageID);

    } catch (err) {
      console.log("[Gemini Error]:", err.message);
      return; // Don't reply on error, just silently exit
    }
  }
};
