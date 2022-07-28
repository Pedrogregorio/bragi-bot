const stop = (message) => {
  const serverQueue = message.client.queue.get(message.guild.id);

  message.react('👋')
  serverQueue.songs = [];
  serverQueue.voiceChannel.leave();
  message.client.queue.delete(message.guild.id);
}

export default stop;