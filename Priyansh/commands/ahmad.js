module.exports = {
  name: "ahmad",
  description: "Toggle Gemini Auto Reply",
  version: "1.0",
  author: "ChatGPT",
  cooldown: 2,
  role: 0,
  guide: {
    en: ".ahmad on / .ahmad off"
  },

  run: async function ({ api, event, args }) {
    const ownerID = "100024385579728"; // ← yahan apna UID confirm kar lein
    if (event.senderID !== ownerID)
      return api.sendMessage("Yeh command sirf owner chala sakta hai.", event.threadID, event.messageID);

    if (args[0] === "on") {
      global.autoGemini = true;
      return api.sendMessage("Auto-reply activated. Ab mai aapke har message ka jawab de sakta hoon.", event.threadID, event.messageID);
    }

    if (args[0] === "off") {
      global.autoGemini = false;
      return api.sendMessage("Auto-reply deactivated. Ab mai aapke har message ka jawab nahi de sakta.", event.threadID, event.messageID);
    }

    return api.sendMessage("Use: .ahmad on / .ahmad off", event.threadID, event.messageID);
  }
};
