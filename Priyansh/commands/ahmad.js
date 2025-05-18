const axios = require("axios");

// Gemini API key
const API_KEY = "AIzaSyDrpsAH4u0LRQeeV5tWYTILetz8-Xj9YXU";

// Bot owner ID (change this to your real Facebook UID)
const ownerID = "100024385579728";

// Keep track of auto-reply status
global.autoReplyOn = global.autoReplyOn || false;

module.exports = {
  config: {
    name: "ahmad",
    version: "1.0",
    author: "ChatGPT",
    countDown: 3,
    role: 0,
    shortDescription: "Gemini auto-reply ON/OFF",
    guide: {
      en: ".ahmad on/off"
    }
  },

  onStart: async function ({ api, event, args }) {
    const senderID = event.senderID;
    const status = args[0];

    if (senderID !== ownerID) {
      return api.sendMessage("Yeh command sirf bot owner chala sakta hai.", event.threadID, event.messageID);
    }

    if (status === "on") {
      global.autoReplyOn = true;
      return api.sendMessage(
        "Auto-reply activated.\nAb mai aapke har message ka jawab de sakta hoon.\nKuch bhi poochh sakte hain.",
        event.threadID, event.messageID
      );
    } else if (status === "off") {
      global.autoReplyOn = false;
      return api.sendMessage(
        "Auto-reply deactivated.\nAb mai aapke har message ka jawab nahi de sakta.",
        event.threadID, event.messageID
      );
    } else {
      return api.sendMessage("Sahi use karo: .ahmad on / .ahmad off", event.threadID, event.messageID);
    }
  },

  onChat: async function ({ api, event }) {
    const msg = event.body;
    const sender = event.senderID;

    // Don't reply if off or empty message
    if (!global.autoReplyOn || !msg || msg.startsWith(".")) return;

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
      api.sendMessage("Gemini API se reply nahi aaya.", event.threadID, event.messageID);
    }
  }
};
