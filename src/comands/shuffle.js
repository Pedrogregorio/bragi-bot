import serverController from "../controller/serverController";
import basicMessage from "../responses/basicMessage";

const shuffleSongs = async (message) => {
  const server = await serverController(message);
  if (server.songs.length <= 0) return basicMessage(server, 'Lista vazia')
  const currentSong = server.songs.shift();

  server.songs = server.songs.sort();
  server.songs.unshift(currentSong);
  basicMessage(message, 'Lista embaralhada')
}

export default shuffleSongs;