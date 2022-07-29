const serverController = async (message) => {
  const serverQueue = message.client.queue.get(message.guild.id);

  if (serverQueue) return serverQueue;

  await message.client.queue.set(message.guild.id, {
    textChannel: message.channel,
    voiceChannel: message.member.voice.channel,
    connection: await message.member.voice.channel.join(),
    songs: [],
    volume: 5,
    playing: true,
    random: false
  })

  return message.client.queue.get(message.guild.id);
}

export default serverController;