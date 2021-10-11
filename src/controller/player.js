import nextMusic from "../comands/nextMusic";
import createSongs from "../scripts/mountSong";

const runPlay = async (message) => {
  const serverQueue = message.client.queue.get(message.guild.id);
  const voiceChannel = message.member.voice.channel
  const { songs, playlist } = await createSongs(message);
  const server = {
    textChannel: message.channel,
    voiceChannel: message.member.voice.channel,
    connection: null,
    songs: [],
    volume: 5,
    playing: true
  }
  if (!serverQueue) {
    try {
      server.songs.push(...songs)
      server.connection = await voiceChannel.join()
      message.client.queue.set(message.guild.id, server)
    } catch (error) {
      console.log(error.message)
    }
    if (playlist.length > 0) {
      server.songs.push(...playlist);
    }
    nextMusic(message);
  } else {
    if (playlist.length > 0) {
      try {
        serverQueue.songs.push(...songs);
        serverQueue.songs.push(...playlist);
        message.channel.send('Músicas adicionadas à fila');
      } catch (error) {
        console.log(error.message);
      }
    } else {
      serverQueue.songs.push(...songs);
      return message.channel.send('Música adicionada à fila');
    }
  }
}

export default runPlay;