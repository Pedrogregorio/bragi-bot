import ytdl from "ytdl-core";
import serverController from "../controller/serverController";
import playingMusic from "../responses/play";
import skip from "./skip";

const playSongs = async (message, song) => {
  const server = await serverController(message);

  const dispatcher = server.connection
    .play(ytdl(song.url,
      {
        filter: "audioonly",
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
        maxRetries: 10,
        maxReconnects: 10
      }
    )).on("finish", () => {
      skip(message);
    }).on("error", (error) => {
      console.table({ Erro: error.message });
      skip(message);
    });

  dispatcher.setVolumeLogarithmic(server.volume / 5);

  playingMusic(message, song.title);
}

export default playSongs;