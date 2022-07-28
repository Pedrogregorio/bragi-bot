import { MessageEmbed } from 'discord.js';

const playingMusic = async (message, title) => {
  const server = message.client.queue.get(message.guild.id);
  server.textChannel.messages.cache.forEach(msg => {
    if (msg.author.username === 'bragi' && msg.embeds.length > 0) {
      if (msg.embeds[0].title === 'Tocando a musica:') return msg.delete();
    }
  });
  const playMusic = new MessageEmbed()
    .setColor('#59636b')
    .setTitle('Tocando a musica:')
    .addFields(
      { name: 'Duração', value: server.songs[0].durationFormatted },
    )
    .setDescription('`'+ title +'` :musical_note:')
    .setThumbnail(server.songs[0].thumbnail)

  return await server.textChannel.send({ embed: playMusic });;
}

export default playingMusic;