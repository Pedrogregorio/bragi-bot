import nextMusic from "../scripts/nextMusic";

const skip = (message) => {
  const serverQueue = message.client.queue.get(message.guild.id);

  if (!serverQueue) return;
  message.react('👌');
  if (!serverQueue.songs[0].loop) serverQueue.songs.shift();
  nextMusic(message);
}

export default skip;