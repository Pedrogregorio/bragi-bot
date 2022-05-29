import basicMessage from "../responses/basicMessage";

const clean = (message) => {
  const serverQueue = message.client.queue.get(message.guild.id);
  if (!message.member.voice.channel)
    return basicMessage(
      message,
      "Você tem que pertencer ao canal para fazer essa ação!"
    );
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