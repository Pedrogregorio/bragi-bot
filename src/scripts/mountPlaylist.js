import youtube from 'youtube-sr';

const mountPlaylist = async (play) => {
  let playlist;
  await youtube.searchOne(`${play.track.artists[0].name} ${play.track.name}`).then((music) => { 
     playlist = {  
      title: play.track.name,
      url: music.url
    }
  });
  return playlist
}

export default mountPlaylist;