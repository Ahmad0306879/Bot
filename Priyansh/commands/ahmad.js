const geminiControl = require("../../geminiAutoReply");

module.exports = {
  config: {
    name: "ahmad",
    aliases: [],
    description: "Enable or disable Gemini auto-reply",
    usage: ".ahmad on/off",
    cooldown: 3,
  },

  run: async function ({ api, event, args }) {
    const action = args[0];

    if (action === "on") {
      geminiControl.enable();
      return api.sendMessage("Gemini auto-reply is now ON.", event.threadID);
    } else if (action === "off") {
      geminiControl.disable();
      return api.sendMessage("Gemini auto-reply is now OFF.", event.threadID);
    } else {
      return api.sendMessage("Usage: .ahmad on OR .ahmad off", event.threadID);
    }
  }
};
