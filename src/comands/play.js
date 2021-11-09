import ytdl from "ytdl-core";
import playingMusic from "../responses/play";
import skipMusic from "./skipMusic";

const playSongs = (message, song) => {
  const server = message.client.queue.get(message.guild.id)
  try {
    const dispatcher = server.connection
    .play(ytdl(song.url, { filter: "audioonly", quality: 'highestaudio', highWaterMark: 1 << 25 }))
    .on("finish", () => {
      skipMusic(message);
    })
    .on("error", (error) => {
      skipMusic(message);
      console.log('403 erroo')
      console.log('===================')
      console.log(error.message)
    });
    dispatcher.setVolumeLogarithmic(server.volume / 5);
    playingMusic(server, song.title);
  } catch (error) {
    skipMusic(message);
  }
}

export default playSongs;