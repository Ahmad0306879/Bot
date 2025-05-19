const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "insta",
  version: "1.0.1",
  hasPermission: 0,
  credits: "ChatGPT",
  description: "Get Instagram profile info and DP",
  commandCategory: "tools",
  usages: "[username]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const username = args[0];
  if (!username) return api.sendMessage("Usage: .insta username", event.threadID, event.messageID);

  const cachePath = path.join(__dirname, "..", "cache", `${username}.jpg`);

  try {
    const res = await axios.get(`https://www.instagram.com/${username}/?__a=1&__d=1`, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    // Try different paths as per latest format
    const user = res.data?.items?.[0] || res.data?.graphql?.user || res.data?.user;
    if (!user) throw new Error("User data not found");

    const fullName = user.full_name || 'N/A';
    const bio = user.biography || 'No bio';
    const followers = user.follower_count || user.edge_followed_by?.count || 'N/A';
    const following = user.following_count || user.edge_follow?.count || 'N/A';
    const posts = user.media_count || user.edge_owner_to_timeline_media?.count || 'N/A';
    const profilePic = user.hd_profile_pic_url_info?.url || user.profile_pic_url_hd || user.profile_pic_url;

    // Download pic
    const img = await axios.get(profilePic, { responseType: 'arraybuffer' });
    fs.writeFileSync(cachePath, img.data);

    const msg = `📸 Instagram Profile: @${username}\n\n` +
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
    console.error("Insta Error:", err.message);
    api.sendMessage("Instagram username invalid ya Instagram ne public access block kar diya hai.", event.threadID, event.messageID);
  }
};
