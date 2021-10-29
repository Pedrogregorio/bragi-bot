import { MessageEmbed } from 'discord.js';

const basicMessage = async (server, title) => {
  const playMusic = new MessageEmbed()
    .setColor('#62f8fb')
    .setDescription(`**${title}**`)
  await server.textChannel.send({ embed: playMusic });
  return;
}

export default basicMessage;