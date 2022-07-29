import serverController from "../controller/serverController";
import basicMessage from "../responses/basicMessage";

const clean = async (message) => {
  const serverQueue = await serverController(message);

  if (serverQueue?.songs.length > 1) {
    serverQueue.songs.forEach((_, index) => {
      if (index !== 0) {
        serverQueue.songs.splice(index)
      }
    });
    return basicMessage(message, "Sua lista agora está vazia!");
  }
  return basicMessage(message, "Sua lista já está vazia!");
}

export default clean;