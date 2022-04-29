import nextMusic from "../scripts/nextMusic";
import basicMessage from "../responses/basicMessage";
import createSongs from "../scripts/createSongs";
import messageEmbed from "../responses/messageEmbed";

const play = async (message) => {
  try {
    const serverQueue = message.client.queue.get(message.guild.id);

    const voiceChannel = message.member.voice.channel

    const data = await createSongs(message);

    const { songs, playlist } = data;

    if (!songs || !playlist) return data; 
    const server = {
      textChannel: message.channel,
      voiceChannel: message.member.voice.channel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    }

    if (!serverQueue) {
      server.songs.push(...songs)
      server.connection = await voiceChannel.join()
      message.client.queue.set(message.guild.id, server)

      if (playlist.length > 0) server.songs.push(...playlist);

      nextMusic(message);
    } else {
      serverQueue.textChannel.messages.cache.forEach(msg => {
        if (msg.embeds[0]?.description === '**Músicas adicionadas à fila**' || msg.embeds[0]?.description === "**Música adicionada à fila**") return msg.delete();
      });;

      if (playlist.length > 0) {
        serverQueue.songs.push(...songs);
        serverQueue.songs.push(...playlist);

        basicMessage(serverQueue, 'Músicas adicionadas à fila');
      } else {
        serverQueue.songs.push(...songs);

        return basicMessage(serverQueue, 'Música adicionada à fila');
      }
    }
  } catch (error) {
    messageEmbed(message, error.message);

    return (error.message);
  }
}

export default play;