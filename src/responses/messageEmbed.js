import { MessageEmbed } from 'discord.js';

const messageEmbed = async (message, title) => {
  const playMusic = new MessageEmbed()
    .setColor('#59636b')
    .setDescription(`${title}`)
  await message.channel.send({ embed: playMusic });
  return;
}

export default messageEmbed;