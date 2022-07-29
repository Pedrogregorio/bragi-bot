const serverController = async (message) => {
  const serverQueue = message.client.queue.get(message.guild.id);

  if (serverQueue) return serverQueue;

  const server = message.client.queue.set(message.guild.id, {
    textChannel: message.channel,
    voiceChannel: message.member.voice.channel,
    connection: null,
    songs: [],
    volume: 5,
    playing: true,
    random: false
  })

  server.connection = await message.member.voice.channel.join()

  return message.client.queue.get(message.guild.id);
}

export default serverController;