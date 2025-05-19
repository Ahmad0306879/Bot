const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

module.exports.config = {
  name: "sticker",
  version: "1.0.0",
  hasPermission: 0,
  credits: "ChatGPT",
  description: "Convert image to sticker",
  commandCategory: "image",
  usages: "[reply to image]",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const { messageReply, threadID, messageID } = event;

  if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
    return api.sendMessage("Reply to an image to make a sticker.", threadID, messageID);
  }

  const attachment = messageReply.attachments[0];
  if (attachment.type !== 'photo') {
    return api.sendMessage("Only images are supported.", threadID, messageID);
  }

  const url = attachment.url;
  const inputPath = path.join(__dirname, "..", "cache", `${Date.now()}_input.jpg`);
  const outputPath = path.join(__dirname, "..", "cache", `${Date.now()}_sticker.png`);

  const axios = require('axios');

  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    fs.writeFileSync(inputPath, Buffer.from(response.data, "utf-8"));

    // Resize to sticker size and convert to PNG
    await sharp(inputPath)
      .resize(512, 512, { fit: 'cover' })
      .png()
      .toFile(outputPath);

    api.sendMessage({
      body: "Here's your sticker!",
      attachment: fs.createReadStream(outputPath)
    }, threadID, () => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    }, messageID);

  } catch (err) {
    console.error("Sticker error:", err);
    api.sendMessage("Failed to create sticker.", threadID, messageID);
  }
};
