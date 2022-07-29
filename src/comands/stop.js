import serverController from "../controller/serverController";

const stop = async (message) => {
  const serverQueue = await serverController(message);

  message.react('👋')
  serverQueue.songs = [];
  serverQueue.voiceChannel.leave();
  message.client.queue.delete(message.guild.id);
}

export default stop;