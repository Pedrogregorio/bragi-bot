import youtube from 'youtube-sr';
import ytdl from 'ytdl-core';
import mountSong from './mountSong';
import spotify from './spotify';

const createSongs = async (message) => {
  let playlist = [];
  let songs = [];

  const validateWhichPlatform  = {
    isYoutube: (plataform) =>  plataform === 'www.youtube.com',
    isSpotify: (plataform) =>  plataform === 'open.spotify.com',
  }

  const musicMessage = message.content.split(" ");
  

  const plataform = musicMessage[1].split("/");
  let music;

  if(validateWhichPlatform.isYoutube(plataform[2])) {
    const songInfo = await ytdl.getInfo(musicMessage[1]);
    music = await youtube.searchOne(songInfo.videoDetails.title)
    songs.push(mountSong(music));
  }

  else if(validateWhichPlatform.isSpotify(plataform[2])) {
    await spotify(message, musicMessage).then((response) => {
      playlist = response.playlist;
      songs = response.songs;
    });
  } else {
    musicMessage.shift()
    let text = musicMessage;
    let music = await youtube.searchOne(`${text.join(' ')}`)
    songs.push(mountSong(music));
  }
  return { songs, playlist };
}

export default createSongs;