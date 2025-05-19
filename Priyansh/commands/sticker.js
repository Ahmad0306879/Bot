
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

module.exports.config = {
  name: "sticker",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "ChatGPT",
  description: "Convert image to sticker",
  commandCategory: "image",
  usages: "[reply to an image]",
  cooldowns: 5,
};

module.exports.run = async ({ api, event }) => {
  const { messageReply, threadID, messageID } = event;

  if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
    return api.sendMessage("Please reply to an image.", threadID, messageID);
  }

  const attachment = messageReply.attachments[0];
  if (attachment.type !== "photo") {
    return api.sendMessage("Only photo attachments are supported.", threadID, messageID);
  }

  const imgUrl = attachment.url;
  const cachePath = path.join(__dirname, "..", "..", "cache");
  const inputPath = path.join(cachePath, `input_${Date.now()}.jpg`);
  const outputPath = path.join(cachePath, `output_${Date.now()}.webp`);

  const axios = require("axios");
  const response = await axios.get(imgUrl, { responseType: "arraybuffer" });
  fs.writeFileSync(inputPath, Buffer.from(response.data, "binary"));

  await sharp(inputPath)
    .resize(512, 512, { fit: "inside" })
    .webp()
    .toFile(outputPath);

  const sticker = fs.createReadStream(outputPath);
  api.sendMessage({ attachment: sticker }, threadID, () => {
    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);
  });
};
