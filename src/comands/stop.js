const stop = (message) => {
  const serverQueue = message.client.queue.get(message.guild.id);
  if (!message.member.voice.channel)
    return basicMessage(
      serverQueue,
      "Você tem que pertencer ao canal para pular a música!"
    );
  message.react('👋')
  serverQueue.songs = [];
  serverQueue.voiceChannel.leave();
  message.client.queue.delete(message.guild.id);
}

export default stop;