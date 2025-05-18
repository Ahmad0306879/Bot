module.exports = {
  name: "gemini",
  description: "Toggle Gemini Auto Reply",
  version: "1.0",
  author: "ChatGPT",
  cooldown: 2,
  role: 0,
  guide: {
    en: ".gemini on / .gemini off"
  },

  run: async function ({ api, event, args }) {
    const ownerID = "100024385579728"; // ← Apna UID confirm karein

    if (event.senderID !== ownerID)
      return api.sendMessage("Yeh command sirf owner chala sakta hai.", event.threadID, event.messageID);

    if (args[0] === "on") {
      global.autoGemini = true;
      return api.sendMessage("Gemini Auto-reply is now *enabled*.", event.threadID, event.messageID);
    }

    if (args[0] === "off") {
      global.autoGemini = false;
      return api.sendMessage("Gemini Auto-reply is now *disabled*.", event.threadID, event.messageID);
    }

    return api.sendMessage("Use: .gemini on / .gemini off", event.threadID, event.messageID);
  }
};
