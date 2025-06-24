
const axios = require("axios");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

module.exports.config = {
    name: "ai",
    version: "1.0.0",
    hasPermission: 0,
    credits: "ChatGPT + Ayesha Bot",
    description: "AI Urdu voice reply using OpenAI",
    commandCategory: "ai",
    usages: "[question]",
    cooldowns: 2,
};

module.exports.run = async function({ api, event, args }) {
    const question = args.join(" ");
    if (!question) return api.sendMessage("⛔ براہ کرم کوئی سوال درج کریں جیسے: .ai آپ کیسے ہیں؟", event.threadID, event.messageID);

    const replyText = `آپ نے پوچھا: ${question}۔ میں بالکل ٹھیک ہوں، شکریہ!`; // Static reply, can be made dynamic with GPT if needed

    const filePath = path.join(__dirname, "reply.mp3");

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/audio/speech",
            {
                model: "tts-1",
                input: replyText,
                voice: "nova"
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                },
                responseType: "stream"
            }
        );

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        writer.on("finish", () => {
            api.sendMessage({
                body: "🎧 یہ رہا آپ کا اردو میں جواب:",
                attachment: fs.createReadStream(filePath)
            }, event.threadID, () => fs.unlinkSync(filePath));
        });

    } catch (error) {
        console.error("❌ Voice generation error:", error.message);
        return api.sendMessage("⚠️ آواز پیدا کرنے میں مسئلہ ہوا۔ براہ کرم بعد میں کوشش کریں۔", event.threadID, event.messageID);
    }
};
