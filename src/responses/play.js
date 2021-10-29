import { MessageEmbed } from 'discord.js';

const playingMusic = async (server, title) => {
  server.textChannel.messages.cache.forEach(msg => {
    if (msg.author.username === 'bragi' && msg.embeds.length > 0) {
      if (msg.embeds[0].title === 'Tocando a musica:') return msg.delete();
    }
  });;
  const playMusic = new MessageEmbed()
    .setColor('#62f8fb')
    .setTitle('Tocando a musica:')
    .setDescription('`'+ title +'` :musical_note:')
  await server.textChannel.send({ embed: playMusic });
  return;
}

export default playingMusic;