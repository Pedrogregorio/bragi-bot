import youtube from 'youtube-sr';

const mountPlaylist = async (playlist) => {
  let newPlaylist = [];
  for(const play of playlist) {
    await youtube.searchOne(`${play.track.artists[0].name} ${play.track.name}`).then((music) => { 
      newPlaylist.push({  
        title: play.track.name,
        url: music.url
      });
    });
  }
  return newPlaylist
}

export default mountPlaylist;