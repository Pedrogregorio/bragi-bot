import basicMessage from "../responses/basicMessage";

const shuffleSongs = (message) => {
  const server = message.client.queue.get(message.guild.id)
  if (server.songs.length <= 0) return basicMessage(server, 'Lista vazia')
  const currentSong = server.songs.shift();

  server.songs = server.songs.sort();
  server.songs.unshift(currentSong);
  basicMessage(server, 'Lista embaralhada')
}

export default shuffleSongs;