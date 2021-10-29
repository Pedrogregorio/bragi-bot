import listMusics from "../responses/list";

const queueMusic = (message) => {
  const serverQueue = message.client.queue.get(message.guild.id);
  let msg = '';
  serverQueue.songs.forEach((song, index) => {
    if (index === 10) return msg = msg + `More...\n`
    if (index > 10) return msg;
    if (!song?.yut) {
      msg = msg + `${index + 1} - ${song.name} ${ index === 0? ':play_pause:' : ':musical_note:' }\n`
    } else {
      msg = msg + `${index + 1} - ${song.title} ${ index === 0? ':play_pause:' : ':musical_note:' }\n`
    }
  });
  if (serverQueue.songs.length < 1) msg = 'Lista vazia' 
  listMusics(message, msg);
}

export default queueMusic;