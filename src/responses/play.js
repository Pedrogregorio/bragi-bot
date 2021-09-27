import { MessageEmbed } from 'discord.js';

const playingMusic = async (server, title) => {
  const playMusic = new MessageEmbed()
    .setColor('#008486')
    .setDescription(`Tocando a musica: **${title}** :musical_note:`)
  await server.textChannel.send({ embed: playMusic });
  return;
}

export default playingMusic;