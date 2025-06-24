const https = require("https");
const fs = require("fs");
const path = require("path");
const axios = require("https"); // using Node's https here to avoid axios install

const COHERE_API_KEY = "cti7tCsv9yhYRsfj7AnUVB2l28Bh3twdpXQE7Usr";

module.exports.config = {
  name: "ai",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Cohere + Online TTS",
  description: "Ultra-simple Urdu AI",
  commandCategory: "ai",
  usages: "[question]",
  cooldowns: 2,
};

module.exports.run = async function ({ api, event, args }) {
  const msg = args.join(" ");
  if (!msg) return api.sendMessage("⛔ Sawal likho: .ai tum kon ho", event.threadID);

  const filePath = path.join(__dirname, "voice.mp3");

  try {
    // Step 1: CoHere reply
    const cohereRes = await fetch("https://api.cohere.ai/v1/chat", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${COHERE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: msg,
        model: "command-r-plus",
        temperature: 0.7,
        preamble: "آپ ایک اردو بولنے والے مددگار اسسٹنٹ ہیں جو ہمیشہ اردو میں جواب دیتا ہے۔"
      })
    });

    const data = await cohereRes.json();
    const reply = data.text;

    // Step 2: Generate voice using free online API
    const ttsURL = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(reply)}&tl=ur&client=tw-ob`;

    const file = fs.createWriteStream(filePath);
    https.get(ttsURL, function (response) {
      response.pipe(file);
      file.on("finish", () => {
        file.close(() => {
          api.sendMessage({
            body: "🎧 Ye raha Urdu jawab:",
            attachment: fs.createReadStream(filePath)
          }, event.threadID, () => fs.unlinkSync(filePath));
        });
      });
    });

  } catch (err) {
    console.error("❌ Error:", err.message);
    api.sendMessage("⚠️ Koi masla hua voice banate waqt.", event.threadID);
  }
};
