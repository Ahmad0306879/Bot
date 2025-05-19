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

  onStart: async function({ message, args }) {
    if (args.length === 0) return message.reply("Please provide an Instagram username.\nExample: .insta virat.kohli");

    const username = args[0];
    const url = `https://www.instagram.com/${username}/?__a=1&__d=dis`;

    try {
      const res = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });

      if (!res.data.graphql || !res.data.graphql.user) {
        return message.reply("User not found or profile is private.");
      }

      const user = res.data.graphql.user;
      const profilePicUrl = user.profile_pic_url_hd;

      const caption =
        `Instagram Profile: ${user.full_name || username}\n` +
        `Username: @${username}\n` +
        `Followers: ${user.edge_followed_by.count}\n` +
        `Following: ${user.edge_follow.count}\n` +
        `Private: ${user.is_private ? "Yes" : "No"}\n` +
        `Verified: ${user.is_verified ? "Yes" : "No"}`;

      // Send image by URL (fca-priyansh supports URL attachments)
      await message.reply({
        body: caption,
        attachment: profilePicUrl
      });

    } catch (err) {
      console.error(err);
      return message.reply("Error fetching data. User might not exist or Instagram blocked the request.");
    }
  }
};
