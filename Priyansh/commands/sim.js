const axios = require("axios");

module.exports = {
  config: {
    name: "sim",
    version: "1.0",
    author: "Your Name",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Check SIM owner info"
    },
    longDescription: {
      en: "Check SIM owner details using number"
    },
    category: "utility",
    guide: {
      en: "{pn} <phone_number>"
    }
  },

  onStart: async function ({ api, event, args }) {
    const number = args[0];
    if (!number || !/^03\d{9}$/.test(number)) {
      return api.sendMessage("Please enter a valid Pakistani number e.g., 03001234567", event.threadID, event.messageID);
    }

    const url = `https://api.allorigins.win/get?url=${encodeURIComponent('https://fam-official.serv00.net/sim/api.php?num=' + number)}`;

    try {
      const res = await axios.get(url);
      const data = JSON.parse(res.data.contents);

      if (!data.name) {
        return api.sendMessage("No data found for this number.", event.threadID, event.messageID);
      }

      const reply = `SIM Owner Details:\n\nName: ${data.name}\nCNIC: ${data.cnic}\nAddress: ${data.address}`;
      api.sendMessage(reply, event.threadID, event.messageID);
    } catch (err) {
      api.sendMessage("Error fetching SIM info. Try again later.", event.threadID, event.messageID);
      console.error("SIM API Error:", err.message);
    }
  }
};
