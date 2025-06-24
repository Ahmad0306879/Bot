const axios = require("axios");
const gTTS = require("google-tts-api");
const fs = require("fs");
const https = require("https");
const path = require("path");

module.exports = {
  config: {
    name: "ai",
    aliases: [],
    description: "AI ka jawab voice mein dega",
    usage: ".ai <sawal>"
  },

  async run({ api, event, args }) {
    const prompt = args.join(" ");
    if (!prompt) return api.sendMessage("⚠️ Sawal likho jaise: .ai tum kon ho", event.threadID);

    try {
      // ✅ STEP 1: AI response lo (Direct key use)
      const ai = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }]
        },
        {
          headers: {
            Authorization: `Bearer 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`,
            "Content-Type": "application/json"
          }
        }
      );

      const reply = ai.data.choices[0].message.content;

      // ✅ STEP 2: AI reply ko voice mein convert karo
      const url = gTTS.getAudioUrl(reply, {
        lang: "ur", // 'en' or 'hi' bhi use ho sakta hai
        slow: false
      });

      const filePath = path.join(__dirname, "ai_voice.mp3");
      const file = fs.createWriteStream(filePath);

      https.get(url, (res) => {
        res.pipe(file);
        file.on("finish", () => {
          file.close(() => {
            api.sendMessage({ attachment: fs.createReadStream(filePath) }, event.threadID, () => {
              fs.unlinkSync(filePath); // delete after send
            });
          });
        });
      });

    } catch (err) {
      console.error("❌ Error:", err.message);
      api.sendMessage("⚠️ AI reply ya voice mein problem aayi.", event.threadID);
    }
  }
};
