import { MessageEmbed } from 'discord.js';
import basicMessage from './basicMessage';
import skip from '../comands/skip';
import stop from '../comands/stop';
import pauseSong from '../comands/pause';

const playingMusic = async (message, title) => {
  const server = message.client.queue.get(message.guild.id);
  server.textChannel.messages.cache.forEach(msg => {
    if (msg.author.username === 'bragi' && msg.embeds.length > 0) {
      if (msg.embeds[0].title === 'Tocando a musica:') return msg.delete();
    }
  });
  const playMusic = new MessageEmbed()
    .setColor('#62f8fb')
    .setTitle('Tocando a musica:')
    .addFields(
      { name: 'Duração', value: server.songs[0].durationFormatted },
    )
    .setDescription('`'+ title +'` :musical_note:')
    .setThumbnail(server.songs[0].thumbnail)
  
  let playMessage = await server.textChannel.send({ embed: playMusic });
  
  await playMessage.react("⏭");
  await playMessage.react("⏯");
  await playMessage.react("🔇");
  await playMessage.react("⏹");

  const filter = (reaction, user) => user.id !== playMessage.client.user.id;
  let collector = playMessage.createReactionCollector(filter, {
    time: 600000
  });

  function canModifyQueue(member) {
    return member.voice.channelID === member.guild.voice.channelID
  }

  collector.on("collect", (reaction, user) => {
    if (!server) return;
    const member = playMessage.guild.member(user);

    switch (reaction.emoji.name) {
      case "⏭":
        server.playing = true;
        reaction.users.remove(user).catch(console.error);
        if (!canModifyQueue(member)) return basicMessage(message, 'Você não tem permissão');
        skip(message);

        collector.stop();
        break;

      case "⏯":
        reaction.users.remove(user).catch(console.error);
        if (!canModifyQueue(member)) return basicMessage(message, 'Você não tem permissão');
        pauseSong(message);
        break;

      case "🔇":
        reaction.users.remove(user).catch(console.error);
        if (!canModifyQueue(member)) return basicMessage(message, 'Você não tem permissão');
        server.muted = !server.muted;
        if (server.muted) {
          server.connection.dispatcher.setVolumeLogarithmic(0);
        } else {
          server.connection.dispatcher.setVolumeLogarithmic(server.volume / 100);
        }
        break;

      case "⏹":
        reaction.users.remove(user).catch(console.error);
        if (!canModifyQueue(member)) return basicMessage(message, 'Você não tem permissão');
        stop(message);
        collector.stop();
        break;

      default:
        reaction.users.remove(user).catch(console.error);
        break;
    }
  });

  return;
}

export default playingMusic;