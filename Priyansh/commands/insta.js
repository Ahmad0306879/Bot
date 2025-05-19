const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "insta",
  version: "1.0.0",
  hasPermission: 0,
  credits: "YourName",
  description: "Fetch Instagram user info and profile picture",
  commandCategory: "utility",
  usages: "[username]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const username = args[0];
  if (!username) return api.sendMessage("Please provide an Instagram username.\nUsage: .insta username", event.threadID, event.messageID);

  const cachePath = path.join(__dirname, "..", "cache", `${username}.jpg`);

  try {
    const url = `https://www.instagram.com/${username}/?__a=1&__d=dis`;
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const user = response.data.graphql.user;
    const fullName = user.full_name || 'N/A';
    const bio = user.biography || 'No bio';
    const followers = user.edge_followed_by.count;
    const following = user.edge_follow.count;
    const posts = user.edge_owner_to_timeline_media.count;
    const profilePicUrl = user.profile_pic_url_hd;

    const img = await axios.get(profilePicUrl, { responseType: 'arraybuffer' });
    fs.writeFileSync(cachePath, Buffer.from(img.data, 'utf-8'));

    const msg = `📸 Instagram Profile of @${username}\n\n` +
                `👤 Name: ${fullName}\n` +
                `📝 Bio: ${bio}\n` +
                `👥 Followers: ${followers}\n` +
                `👣 Following: ${following}\n` +
                `🖼️ Posts: ${posts}`;

    api.sendMessage({
      body: msg,
      attachment: fs.createReadStream(cachePath)
    }, event.threadID, () => fs.unlinkSync(cachePath), event.messageID);

  } catch (err) {
    console.log("Insta Error:", err.message);
    api.sendMessage("Failed to fetch Instagram profile. Maybe username is incorrect or Instagram changed API.", event.threadID, event.messageID);
  }
};
