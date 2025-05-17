const { AttachmentBuilder } = require('discord.js');
const Jimp = require('jimp');

module.exports = {
  name: 'edit',
  description: 'Adds text to an attached or replied image',
  async execute(message, args) {
    if (!args.length) {
      return message.reply('Please provide the text. Example: `.edit DILRI`');
    }

    const text = args.join(' ');
    let imageUrl = null;

    // Check if current message has attachment
    if (message.attachments.size > 0) {
      imageUrl = message.attachments.first().url;
    }

    // If no attachment, check if it's a reply to a message with an image
    else if (message.reference) {
      const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);
      if (repliedMessage.attachments.size > 0) {
        imageUrl = repliedMessage.attachments.first().url;
      }
    }

    if (!imageUrl) {
      return message.reply('Please attach an image or reply to a message with an image.');
    }

    try {
      const image = await Jimp.read(imageUrl);
      const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);

      const textWidth = Jimp.measureText(font, text);
      const x = (image.bitmap.width - textWidth) / 2;
      const y = image.bitmap.height - 100;

      image.print(font, x, y, text);

      const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);
      const attachment = new AttachmentBuilder(buffer, { name: 'edited.jpg' });

      await message.reply({ content: 'Here is your edited image:', files: [attachment] });
    } catch (error) {
      console.error(error);
      message.reply('Failed to edit the image.');
    }
  }
};
