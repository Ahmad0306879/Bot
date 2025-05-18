module.exports = {
  config: {
    name: "gemini",
    version: "1.0.0",
    author: "ChatGPT",
    role: 0,
    cooldown: 2,
    shortDescription: "Toggle Gemini Auto Reply",
    guide: {
      en: ".gemini on / .gemini off"
    }
  },

  run: async function ({ api, event, args }) {
    const ownerID = "100024385579728"; // Apna UID yahan confirm karo

    if (event.senderID !== ownerID)
      return api.sendMessage("Sirf owner is command ko chala sakta hai.", event.threadID, event.messageID);

    if (args[0] === "on") {
      global.autoGemini = true;
      return api.sendMessage("Gemini auto-reply *enabled* ho gaya hai.", event.threadID, event.messageID);
    }

    if (args[0] === "off") {
      global.autoGemini = false;
      return api.sendMessage("Gemini auto-reply *disabled* ho gaya hai.", event.threadID, event.messageID);
    }

    return api.sendMessage("Sahi syntax: .gemini on / .gemini off", event.threadID, event.messageID);
  }
};
