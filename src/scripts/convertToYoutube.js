import youtube from 'youtube-sr';
import mountSong from '../helper/mountSong';
import MusicException from '../class/MusicException';

const mountPlaylist = async (message) => {
  const server = message.client.queue.get(message.guild.id);
  await youtube.searchOne(`${server.songs[0].artist} ${server.songs[0].name}`).then((music) => {
    server.songs.shift();
    server.songs.unshift(mountSong(music));
  }).catch(() => {
    throw new MusicException("Não foi possível encontrar a música!");
  });
}

export default mountPlaylist;