import youtube from 'youtube-sr';

const mountPlaylist = async (play) => {
  let playlist;
  try {
    await youtube.searchOne(`${play.artist} ${play.name}`).then((music) => { 
       playlist = {  
        title: play.name,
        url: music.url
      }
    });
  } catch (error) {
    console.log(error.message)
  }
  return playlist
}

export default mountPlaylist;