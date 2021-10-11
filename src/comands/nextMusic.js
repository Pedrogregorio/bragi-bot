import playSongs from "./play";
import mountPlaylist from "../scripts/mountPlaylist"

const nextMusic = async (message) => {
  const server = message.client.queue.get(message.guild.id)
  if (!server.songs.length > 0) {
    setTimeout(()=>{
      try {
        if (!server) return
        server.voiceChannel.leave();
        message.client.queue.delete(message.guild.id);
        return;
      } catch (error) {
        console.log(error.message)
      }
    }, 60000)
  } else {
    try {
      let music;
      if (!server.songs[0]?.yut) {
        music = await mountPlaylist(server.songs[0])
        playSongs(message, music)
      }else {
        playSongs(message, server.songs[0])
      }
    } catch (error) {
      console.log(error.message)
    }
  }
}

export default nextMusic;