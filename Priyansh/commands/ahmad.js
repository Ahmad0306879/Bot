const geminiControl = require("../../geminiAutoReply");

module.exports.config = {
  name: "ahmad",
  version: "1.0",
  hasPermission: 0,
  credits: "ChatGPT",
  description: "Enable or disable Gemini auto-reply",
  commandCategory: "system",
  usages: "ahmad [on/off]",
  cooldowns: 3
};

module.exports.run = async function ({ api, event, args }) {
  const type = args[0];
  if (type === "on") {
    geminiControl.enable();
    return api.sendMessage("Gemini auto-reply is now ON.", event.threadID, event.messageID);
  } else if (type === "off") {
    geminiControl.disable();
    return api.sendMessage("Gemini auto-reply is now OFF.", event.threadID, event.messageID);
  } else {
    return api.sendMessage("Use `.ahmad on` or `.ahmad off`", event.threadID, event.messageID);
  }
};
