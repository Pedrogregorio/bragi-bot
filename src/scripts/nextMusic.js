import playSongs from "../comands/play";
import mountPlaylist from "./mountPlaylist"

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
      if (aux >= 20) {
        stopInterval()
        server.voiceChannel.leave();
        message.client.queue.delete(message.guild.id);
        return;
      }
    }, 3000)
    function stopInterval() { clearInterval(interval); }
  } else {
    try {
      if (!server.songs[0]?.yut) await mountPlaylist(message)
      playSongs(message, server.songs[0])
    } catch (error) {
      console.log(error.message)
      skipMusic(message);
    }
  }
}

export default nextMusic;