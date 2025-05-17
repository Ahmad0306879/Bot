const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');

module.exports = {
  name: "edit",
  description: "Edit image with custom name overlay",
  async execute(message, args) {
    if (args.length === 0) {
      return message.reply("Please provide a name. Example: .edit DILRI");
    }

    const name = args.join(" ");
    const attachments = message.attachments;

    if (attachments.size === 0) {
      return message.reply("Please attach an image with your command.");
    }

    const imageUrl = attachments.first().url;

    try {
      const image = await Jimp.read(imageUrl);
      const font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);

      // Positioning text in center bottom
      const textWidth = Jimp.measureText(font, name);
      const textHeight = Jimp.measureTextHeight(font, name, image.bitmap.width);
      const x = (image.bitmap.width / 2) - (textWidth / 2);
      const y = image.bitmap.height - textHeight - 30;

      image.print(font, x, y, name);

      const outputPath = path.join(__dirname, "output.jpg");
      await image.writeAsync(outputPath);

      await message.reply({
        content: "Here is your edited image:",
        files: [outputPath]
      });

      // Clean up
      fs.unlinkSync(outputPath);
    } catch (error) {
      console.error(error);
      message.reply("Failed to edit the image.");
    }
  }
};
