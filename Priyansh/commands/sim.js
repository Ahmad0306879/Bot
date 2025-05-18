const axios = require("axios");

module.exports = {
  config: {
    name: "simdetails",
    version: "1.0",
    author: "ChatGPT",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Get SIM owner info"
    },
    longDescription: {
      en: "Fetch SIM owner details using a number"
    },
    category: "utility",
    guide: {
      en: "{pn} <phone_number>"
    }
  },

  onStart: async function ({ api, event, args }) {
    const number = args[0];
    if (!number || !/^03\d{9}$/.test(number)) {
      return api.sendMessage("Please enter a valid number (e.g., 03001234567)", event.threadID, event.messageID);
    }

    const url = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://fam-official.serv00.net/sim/api.php?num=${number}`)}`;

    try {
      const response = await axios.get(url);
      const result = JSON.parse(response.data.contents);

      if (result.status === "success" && Array.isArray(result.data) && result.data.length > 0) {
        let formattedData = "SIM Owner Info:\n\n";
        result.data.forEach((user, index) => {
          formattedData += `Owner ${index + 1}:\n`;
          formattedData += `Name: ${user.Name || "N/A"}\n`;
          formattedData += `Mobile: ${user.Mobile || "N/A"}\n`;
          formattedData += `CNIC: ${user.CNIC || "N/A"}\n`;
          formattedData += `Operator: ${user.Operator || "N/A"}\n`;
          formattedData += `Address: ${user.Address || "N/A"}\n`;
          formattedData += `--------------------------\n`;
        });

        api.sendMessage(formattedData, event.threadID, event.messageID);
      } else {
        api.sendMessage("X No data found for this number.", event.threadID, event.messageID);
      }
    } catch (error) {
      api.sendMessage(`X API Error: ${error.message}`, event.threadID, event.messageID);
      console.error("SIM Command Error:", error.message);
    }
  }
};
