import playSongs from "../comands/play";
import convertToYoutube from "./convertToYoutube"
import MusicException from "../class/MusicException";
import skip from "../comands/skip";

const nextMusic = async (message) => {
  const server = message.client.queue.get(message.guild.id)

  if (!server.songs.length > 0) {
    if (!server) return
    let aux = 0
    let interval = setInterval(() => {
      aux++
      if (server.songs.length > 0) {
        stopInterval()
        return nextMusic(message)
      }
      if (aux >= 50) {
        stopInterval()
        server.voiceChannel.leave();
        message.client.queue.delete(message.guild.id);
        return;
      }
    }, 3000)
    function stopInterval() { clearInterval(interval); }
  } else {
    if (!server.songs[0]?.yut) {
      await convertToYoutube(message).then(() => {
        playSongs(message, server.songs[0])
      }).catch((error) => {
        skip(message);

        throw new MusicException(error.message);
      })
    } else {
      playSongs(message, server.songs[0])
    }
  }
}

export default nextMusic;