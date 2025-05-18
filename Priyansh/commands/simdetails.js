const axios = require("axios");

module.exports = {
  config: {
    name: "simdetails",
    version: "1.1",
    author: "ChatGPT",
    description: "Respond to 'simdetails 03XXXXXXXXX' without prefix",
    dependencies: {}
  },

  run: async function ({ event, api }) {
    const body = event.body?.trim();

    if (!body?.toLowerCase().startsWith("simdetails 03")) return;

    const number = body.split(" ")[1];
    if (!number || !/^03\d{9}$/.test(number)) {
      return api.sendMessage("Please enter a valid number like:\nsimdetails 03001234567", event.threadID, event.messageID);
    }

    // Convert 03 to 923 format
    const formatted = "92" + number.slice(1);

    const url = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://fam-official.serv00.net/sim/api.php?num=${formatted}`)}`;

    try {
      const response = await axios.get(url);
      const result = JSON.parse(response.data.contents);

      if (result.status === "success" && Array.isArray(result.data) && result.data.length > 0) {
        let msg = "SIM Owner Details:\n\n";
        result.data.forEach((user, i) => {
          msg += `Owner ${i + 1}:\n`;
          msg += `Name: ${user.Name || "N/A"}\n`;
          msg += `Mobile: ${user.Mobile || "N/A"}\n`;
          msg += `CNIC: ${user.CNIC || "N/A"}\n`;
          msg += `Operator: ${user.Operator || "N/A"}\n`;
          msg += `Address: ${user.Address || "N/A"}\n`;
          msg += `----------------------\n`;
        });
        api.sendMessage(msg, event.threadID, event.messageID);
      } else {
        api.sendMessage("No data found for this number.", event.threadID, event.messageID);
      }
    } catch (err) {
      console.error("SIM API error:", err.message);
      api.sendMessage("API error occurred. Try again later.", event.threadID, event.messageID);
    }
  }
};
