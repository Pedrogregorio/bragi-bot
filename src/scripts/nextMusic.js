import play from "../comands/play";
import convertToYoutube from "./convertToYoutube"
import MusicException from "../class/MusicException";
import skip from "../comands/skip";
import serverController from "../controller/serverController";
import randomSongs from "../comands/random";

const nextMusic = async (message) => {
  const server = await serverController(message);

  if (!server.songs.length > 0) {
    if (server.random) return randomSongs(message, false);

    if (!server) return
    let timeToLeave = 0
    let interval = setInterval(() => {
      timeToLeave++
      if (server.songs.length > 0) {
        stopInterval()
        return nextMusic(message)
      }
      if (timeToLeave >= 50) {
        stopInterval()
        server.voiceChannel.leave();
        message.client.queue.delete(message.guild.id);
        return;
      }
    }, 3000)
    function stopInterval() { clearInterval(interval); }
  } else {
    if (!server.songs[0]?.isYoutube) {
      await convertToYoutube(message).then(() => {
        play(message, server.songs[0])
      }).catch((error) => {
        skip(message);

        throw new MusicException(error.message);
      })
    } else {
      play(message, server.songs[0])
    }
  }
}

export default nextMusic;