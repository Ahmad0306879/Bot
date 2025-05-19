module.exports.config = {
  name: "insta",
  version: "1.0.0",
  hasPermission: 0,
  credits: "You",
  description: "Fetches Instagram profile picture",
  commandCategory: "tools",
  usages: "[username]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const axios = require("axios");

  if (!args[0]) return api.sendMessage("Please enter an Instagram username.\nExample: .insta virat.kohli", event.threadID);

  const username = args[0];
  const url = `https://www.instagram.com/${username}/?__a=1&__d=dis`;

  try {
    const res = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const user = res.data.graphql.user;
    const profilePicUrl = user.profile_pic_url_hd;

    const caption =
      `Instagram Profile: ${user.full_name || username}\n` +
      `Username: @${username}\n` +
      `Followers: ${user.edge_followed_by.count}\n` +
      `Following: ${user.edge_follow.count}\n` +
      `Private: ${user.is_private ? "Yes" : "No"}\n` +
      `Verified: ${user.is_verified ? "Yes" : "No"}`;

    api.sendMessage({
      body: caption,
      attachment: await global.utils.getStreamFromURL(profilePicUrl)
    }, event.threadID, event.messageID);

  } catch (e) {
    console.error(e);
    return api.sendMessage("User not found or account is private.", event.threadID);
  }
};
