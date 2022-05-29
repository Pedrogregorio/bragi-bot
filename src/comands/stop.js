import basicMessage from "../responses/basicMessage";

const stop = (message) => {
  const serverQueue = message.client.queue.get(message.guild.id);
  if (!message.member.voice.channel)
    return basicMessage(
      message,
      "Você tem que pertencer ao canal para fazer essa ação!"
    );
  message.react('👋')
  serverQueue.songs = [];
  serverQueue.voiceChannel.leave();
  message.client.queue.delete(message.guild.id);
}

export default stop;