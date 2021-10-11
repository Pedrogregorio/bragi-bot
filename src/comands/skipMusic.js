import nextMusic from "./nextMusic";

const skipMusic = (message) => {
  const serverQueue = message.client.queue.get(message.guild.id);
  if (!message.member.voice.channel)
    return message.channel.send(
      "Você tem que pertencer ao canal para pular a música!"
    );
  if (!serverQueue) return;
  serverQueue.songs.shift();
  nextMusic(message);
}

export default skipMusic;