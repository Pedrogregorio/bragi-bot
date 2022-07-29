import serverController from "../controller/serverController";
import nextMusic from "../scripts/nextMusic";

const skip = async (message) => {
  const serverQueue = await serverController(message);

  if (!serverQueue) return;
  message.react('👌');
  if (!serverQueue.songs[0].loop) serverQueue.songs.shift();
  nextMusic(message);
}

export default skip;