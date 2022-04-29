import youtube from 'youtube-sr';
import mountSong from '../helper/mountSong';
import MusicException from '../class/MusicException';
import spotify from './processLinkSpotify';

const createSongs = async (message) => {
  let playlist = [];
  let songs = [];

  const validateWhichPlatform  = {
    isYoutube: (plataform) =>  plataform === 'www.youtube.com',
    isSpotify: (plataform) =>  plataform === 'open.spotify.com',
  }

  const musicMessage = message.content.split(" ");
  

  const plataform = musicMessage[1].split("/");

  if(validateWhichPlatform.isYoutube(plataform[2])) {
    await youtube.getVideo(musicMessage[1]).then((music) => {
      songs.push(mountSong(music));
    }).catch(() => {
      throw new MusicException("Não foi possível encontrar a música!");
    });
  }

  else if(validateWhichPlatform.isSpotify(plataform[2])) {
    await spotify(message, musicMessage).then((response) => {
      playlist = response.playlist;
      songs = response.songs;
    });
  } else {
    musicMessage.shift();

    let text = musicMessage.join(" ");

    await youtube.searchOne(text).then((music) => {
      songs.push(mountSong(music));
    });
  }

  return { songs, playlist };
}

export default createSongs;