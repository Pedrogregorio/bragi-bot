const stop = (message) => {
  message.react('👋')
  const serverQueue = message.client.queue.get(message.guild.id);
  serverQueue.songs = [];
  serverQueue.voiceChannel.leave();
  message.client.queue.delete(message.guild.id);
}

export default stop;