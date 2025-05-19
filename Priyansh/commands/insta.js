const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'insta',
  description: 'Get Instagram profile info and DP without API key',
  async run({ message, client, args }) {
    if (!args[0]) return client.sendMessage(message.from, { text: 'Username dena zaroori hai.\nUsage: .insta username' }, { quoted: message });

    const username = args[0].replace('@', '').trim();
    const cachePath = path.join(__dirname, '..', 'cache', `${username}.jpg`);

    try {
      const url = `https://www.instagram.com/${username}/?__a=1&__d=dis`;
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          Accept: 'application/json',
        },
      });

      const user = response.data.graphql.user;
      if (!user) throw new Error('User not found');

      // Profile data
      const profilePicUrl = user.profile_pic_url_hd || user.profile_pic_url;
      const fullName = user.full_name || 'N/A';
      const bio = user.biography || 'No bio';
      const followers = user.edge_followed_by.count;
      const following = user.edge_follow.count;
      const posts = user.edge_owner_to_timeline_media.count;

      // Download DP to cache
      const picResponse = await axios.get(profilePicUrl, { responseType: 'arraybuffer' });
      fs.writeFileSync(cachePath, picResponse.data);

      // Prepare message
      const caption = `📷 *Instagram Profile Info*\n\n` +
                      `👤 Name: ${fullName}\n` +
                      `🔰 Username: @${username}\n` +
                      `📝 Bio: ${bio}\n` +
                      `👥 Followers: ${followers}\n` +
                      `👣 Following: ${following}\n` +
                      `🖼️ Posts: ${posts}`;

      await client.sendMessage(message.from, {
        image: fs.readFileSync(cachePath),
        caption: caption,
        mimetype: 'image/jpeg',
      }, { quoted: message });

      // Delete cached image
      fs.unlinkSync(cachePath);

    } catch (error) {
      console.log('Error fetching Instagram:', error.message);
      client.sendMessage(message.from, { text: 'Instagram user not found or error occurred.' }, { quoted: message });
    }
  }
};
