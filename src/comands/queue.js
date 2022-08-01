import serverController from "../controller/serverController";
import listMusics from "../responses/list";

const queueMusic = async (message) => {
  const serverQueue = await serverController(message);

  let msg = '';

  serverQueue.songs.forEach((song, index) => {
    if (index === 10) return msg = msg + `More...\n`
    if (index > 10) return msg;
    if (!song?.isYoutube) {
      msg = msg + `${index + 1} - ${song.name} ${ index === 0? ':play_pause:' : ':musical_note:' }\n`
    } else {
      msg = msg + `${index + 1} - ${song.title} ${ index === 0? ':play_pause:' : ':musical_note:' }\n`
    }
  });

  if (serverQueue.songs.length < 1) msg = 'Lista vazia'
  listMusics(message, msg);
}

export default queueMusic;