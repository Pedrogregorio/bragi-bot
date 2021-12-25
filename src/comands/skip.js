import basicMessage from "../responses/basicMessage";
import nextMusic from "../scripts/nextMusic";

const skip = (message) => {
  const serverQueue = message.client.queue.get(message.guild.id);
  if (!message.member.voice.channel)
    return basicMessage(
      serverQueue,
      "Você tem que pertencer ao canal para pular a música!"
    );
  if (!serverQueue) return;
  message.react('👌')
  serverQueue.songs.shift();
  nextMusic(message);
}

export default skip;