const axios = require("axios");

module.exports = {
  config: {
    name: "insta",
    aliases: [],
    version: "1.0",
    author: "You",
    role: 0,
    shortDescription: "Get Instagram profile picture",
    longDescription: "Fetches HD Instagram profile picture by username",
    category: "tools",
    guide: {
      en: ".insta [username]"
    }
  },

  onStart: async function ({ message, args }) {
    const username = args[0];
    if (!username) return message.reply("Please provide an Instagram username.\nExample: .insta virat.kohli");

    const url = `https://www.instagram.com/${username}/?__a=1&__d=dis`;

    try {
      const res = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      });

      const user = res.data.graphql.user;
      const profilePicUrl = user.profile_pic_url_hd;

      const imageBuffer = await axios.get(profilePicUrl, { responseType: "stream" });

      const caption = `Instagram Profile: ${user.full_name || username}
Username: @${username}
Followers: ${user.edge_followed_by.count}
Following: ${user.edge_follow.count}
Private: ${user.is_private ? "Yes" : "No"}
Verified: ${user.is_verified ? "Yes" : "No"}`;

      message.reply({
        body: caption,
        attachment: imageBuffer.data
      });

    } catch (err) {
      console.error(err);
      message.reply("Error: Username not found or account is private.");
    }
  }
};
