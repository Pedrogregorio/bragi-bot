import ytdl from "ytdl-core";
import playingMusic from "../responses/play";
import skip from "./skip";

const playSongs = (message, song) => {
  const server = message.client.queue.get(message.guild.id)
  const dispatcher = server.connection
  .play(ytdl(song.url, { filter: "audioonly", quality: 'highestaudio', highWaterMark: 1 << 25 }))
  .on("finish", () => {
    skip(message);
  })
  .on("error", (error) => {
    try {
      dispatcher.destroy();
    } catch (err) {
      console.log(err.message);
    }
    skip(message);
  });
  dispatcher.setVolumeLogarithmic(server.volume / 5);
  playingMusic(message, song.title);
}

export default playSongs;