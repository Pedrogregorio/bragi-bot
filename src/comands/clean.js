import basicMessage from "../responses/basicMessage";

const clean = (message) => {
  const serverQueue = message.client.queue.get(message.guild.id);
  if (serverQueue?.songs.length > 1) {
    serverQueue.songs.forEach((_, index) => {
      if (index !== 0) {
        serverQueue.songs.splice(index)
      }
    });
    return basicMessage(serverQueue, "Sua lista agora está vazia!"); 
  }
  return basicMessage(serverQueue, "Sua lista já está vazia!");
}

export default clean;