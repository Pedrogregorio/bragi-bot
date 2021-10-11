const clean = (message) => {
  const serverQueue = message.client.queue.get(message.guild.id);
  if (serverQueue?.songs.length > 0) {
    serverQueue.songs = [];
    return message.channel.send("Sua lista agora está vazia!"); 
  }
  return message.channel.send("Sua lista já está vazia!");
}

export default clean;