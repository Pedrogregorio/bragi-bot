const stop = (message) => {
  const serverQueue = message.client.queue.get(message.guild.id);
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
  serverQueue.voiceChannel.leave();
  message.client.queue.delete(message.guild.id);
}

export default stop;