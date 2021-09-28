import youtube from 'youtube-sr';

const mountPlaylist = async (play) => {
  let playlist;
  try {
    await youtube.searchOne(`${play.track.artists[0].name} ${play.track.name}`).then((music) => { 
       playlist = {  
        title: play.track.name,
        url: music.url
      }
    });
  } catch (error) {
    console.log(error.message)
  }
  return playlist
}

export default mountPlaylist;