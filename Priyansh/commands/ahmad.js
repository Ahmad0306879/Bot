module.exports = {
  config: {
    name: "ahmad",
    version: "1.0",
    author: "ChatGPT",
    countDown: 2,
    role: 0,
    shortDescription: "Toggle Gemini Auto Reply",
    guide: {
      en: ".ahmad on / .ahmad off"
    }
  },

  onStart: async function ({ api, event, args }) {
    const ownerID = "100024385579728"; // ← yahan apna UID lagao
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
