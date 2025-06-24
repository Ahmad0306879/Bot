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
    usage: ".ai <message>"
  },

  async run({ api, event, args }) {
    const prompt = args.join(" ");
    if (!prompt) return api.sendMessage("⚠️ Sawal likho jaise: .ai tum kon ho?", event.threadID);

    try {
      // ✅ STEP 1: Get AI Response from OpenAI
      const ai = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }]
        },
        {
          headers: {
            Authorization: `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`, // 🔁 Yahan apni OpenAI key daalein
            "Content-Type": "application/json"
          }
        }
      );

      const reply = ai.data.choices[0].message.content;

      // ✅ STEP 2: Convert AI reply to Voice
      const url = gTTS.getAudioUrl(reply, {
        lang: "ur", // 🔁 Zubaan change kar sakte ho: 'en', 'hi' etc.
        slow: false
      });

      const filePath = path.join(__dirname, "ai_voice.mp3");
      const file = fs.createWriteStream(filePath);

      https.get(url, (res) => {
        res.pipe(file);
        file.on("finish", () => {
          file.close(() => {
            api.sendMessage({ attachment: fs.createReadStream(filePath) }, event.threadID, () => {
              fs.unlinkSync(filePath); // auto delete file
            });
          });
        });
      });

    } catch (e) {
      console.error("❌ Error:", e.message);
      api.sendMessage("⚠️ AI se jawab ya voice nahi ban saka.", event.threadID);
    }
  }
};
