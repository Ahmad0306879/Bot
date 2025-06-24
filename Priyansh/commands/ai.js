const gTTS = require('google-tts-api');
const fs = require('fs');
const https = require('https');
const path = require('path');

module.exports = {
  config: {
    name: "ai",
    aliases: [],
    description: "AI ka voice reply",
    usage: ".ai <sawal>"
  },

  async run({ api, event, args }) {
    const prompt = args.join(" ");
    if (!prompt) return api.sendMessage("💬 Sawal likho, jaise: .ai tum kon ho?", event.threadID);

    try {
      // 🔊 Text-to-voice banayein
      const url = gTTS.getAudioUrl(prompt, {
        lang: 'ur', // 'en', 'hi' bhi use kar sakte ho
        slow: false
      });

      const filePath = path.join(__dirname, "tts.mp3");
      const file = fs.createWriteStream(filePath);

      https.get(url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close(() => {
            api.sendMessage({ attachment: fs.createReadStream(filePath) }, event.threadID);
          });
        });
      });

    } catch (e) {
      api.sendMessage("❌ Voice reply fail hogya.", event.threadID);
      console.error(e.message);
    }
  }
};
