/*

PRIYANSH FULL COMPLETE

With Gemini Auto-Reply Integration ==================== */


const { readdirSync, readFileSync, writeFileSync, existsSync, unlinkSync, rm } = require("fs-extra"); const { join, resolve } = require("path"); const { execSync } = require('child_process'); const chalk = require('chalk'); const logger = require("./utils/log.js"); const login = require("fca-priyansh"); const axios = require("axios"); const listPackage = JSON.parse(readFileSync('./package.json')).dependencies; const listbuiltinModules = require("module").builtinModules;

console.log(chalk.bold.hex("#00ffff").bold("[ PRIYANSH RAJPUT (PRIYANSH) ] » ") + chalk.bold.hex("#00ffff").bold("Initializing variables..."));

//==================== Global Variables ====================// const GEMINI_API_KEY = "AIzaSyDrpsAH4u0LRQeeV5tWYTILetz8-Xj9YXU"; const autoReplyFile = "./autoReplyState.json"; const ADMIN_ID = "100024385579728";

// Load current auto-reply state let autoReplyState = { enabled: false }; if (existsSync(autoReplyFile)) { autoReplyState = JSON.parse(readFileSync(autoReplyFile, "utf8")); }

//==================== Command handling for enabling/disabling auto-reply ====================// function handleCommand(message) { if (message.body === ".ahmad on" && message.senderID === ADMIN_ID) { autoReplyState.enabled = true; writeFileSync(autoReplyFile, JSON.stringify(autoReplyState)); global.client.api.sendMessage("Gemini auto-reply is now ON.", message.threadID); console.log("[DEBUG] Auto-reply is now ON."); return true; } if (message.body === ".ahmad off" && message.senderID === ADMIN_ID) { autoReplyState.enabled = false; writeFileSync(autoReplyFile, JSON.stringify(autoReplyState)); global.client.api.sendMessage("Gemini auto-reply is now OFF.", message.threadID); console.log("[DEBUG] Auto-reply is now OFF."); return true; } return false; }

//==================== Gemini auto-reply handler ====================// async function handleGeminiAutoReply(message) { if (!autoReplyState.enabled || !message.body || typeof message.body !== "string") return;

console.log("[DEBUG] Message Received:", message.body);

try { const response = await axios.post( https://generativelanguage.googleapis.com/v1beta2/models/gemini-pro:predict?key=${GEMINI_API_KEY}, { prompt: { text: message.body }, temperature: 0.7, max_tokens: 150 } );

console.log("[DEBUG] API Response:", response.data);

const reply = response.data.candidates?.[0]?.output || "Sorry, I couldn't understand.";
global.client.api.sendMessage(reply, message.threadID, message.messageID);

} catch (err) { console.error("[DEBUG] Gemini API Error:", err.response?.data || err.message); global.client.api.sendMessage("Gemini API se response nahi mila. Please try again later.", message.threadID, message.messageID); } }

//==================== Main listener ====================// function listenerCallback(error, message) { if (error) { console.error("Listener Error:", error); return; }

console.log("[DEBUG] Listener Triggered:", message.body);

// Handle commands first if (handleCommand(message)) return;

// If no command, proceed with Gemini auto-reply handleGeminiAutoReply(message); }

module.exports = listenerCallback;

