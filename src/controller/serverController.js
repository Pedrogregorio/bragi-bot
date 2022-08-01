import basicMessage from "../responses/basicMessage";

const serverController = async (message, random = false) => {
  const serverQueue = message.client.queue.get(message.guild.id);

  if (serverQueue) {
    if (!random) return serverQueue;

    serverQueue.random = !serverQueue.random;

    basicMessage(message, `Modo aleatório ${serverQueue.random ? "ativado" : "desativado"}`);

    return serverQueue;
  }

  await message.client.queue.set(message.guild.id, {
    textChannel: message.channel,
    voiceChannel: message.member.voice.channel,
    connection: await message.member.voice.channel.join(),
    songs: [],
    volume: 5,
    playing: true,
    random,
  })

  basicMessage(message, 'Modo aleatório ativado');

  return message.client.queue.get(message.guild.id);
}

export default serverController;