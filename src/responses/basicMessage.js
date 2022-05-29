import { MessageEmbed } from 'discord.js';

const basicMessage = async (message, title) => {
  const playMusic = new MessageEmbed()
    .setColor('#62f8fb')
    .setDescription(`**${title}**`)
  await message.channel.send({ embed: playMusic });
  return;
}

export default basicMessage;