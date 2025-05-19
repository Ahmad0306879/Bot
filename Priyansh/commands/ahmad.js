const autoReplyControl = require("../../geminiAutoReply");

module.exports.config = {
  name: "ahmad",
  version: "1.0",
  hasPermission: 0,
  credits: "ChatGPT",
  description: "Enable/disable auto-reply using free public AI API",
  commandCategory: "system",
  usages: "ahmad [on/off]",
  cooldowns: 3
};

module.exports.run = async function ({ api, event, args }) {
  const action = args[0];
  if (action === "on") {
    autoReplyControl.enable();
    return api.sendMessage("Auto-reply is now ON (Free AI).", event.threadID, event.messageID);
  } else if (action === "off") {
    autoReplyControl.disable();
    return api.sendMessage("Auto-reply is now OFF.", event.threadID, event.messageID);
  } else {
    return api.sendMessage("Please use: .ahmad on or .ahmad off", event.threadID, event.messageID);
  }
};
