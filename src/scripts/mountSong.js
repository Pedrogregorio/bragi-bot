import youtube from 'youtube-sr';
import ytdl from 'ytdl-core';
import spotifyApi from 'spotify-url-info';
import axios from 'axios';

const createSongs = async (message) => {
  let playlist = [];
  let songs = []

  const content = message.content.split(" ");
  

  const plataform = content[1].split("/");
  let music;

  if(plataform[2] === 'www.youtube.com') {
    const songInfo = await ytdl.getInfo(content[1]); 
    songs.push({
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
      yut: true
    });
  }

  else if(plataform[2] === 'open.spotify.com') {
    const songInfo = await spotifyApi.getPreview(content[1]);

    if (songInfo.type === 'track') { 
      music = await youtube.searchOne(`${songInfo.artist} ${songInfo.title}`)
      songs.push({
        url: music?.url,
        title: music?.title,
        yut: true
      });
    }

    else if (songInfo.type === 'playlist' || songInfo.type === 'album') {
      message.channel.send('Processando playlist :laughing:')

      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      
      const { data: { access_token } } = await axios.post(
        process.env.GET_TOKEN_SPOTIFY, 
        params, {
          headers: { 'Authorization': `Basic ${process.env.CODE_AUTORIZATON_SPOTIFY}` }
        })
        .catch((e) => message.channel.send(`desculpe mas ocorreu um erro: ${e.message}`));

      const newPlayListSpotify = await axios({
        method: 'GET',
        url: `${process.env.URL_API_SPOTIFY}${plataform[4]}/tracks`,
        headers: { 'Authorization': `Bearer ${access_token}` }
      }).catch((e) => message.channel.send(`desculpe mas ocorreu um erro: ${e.message}`) );
      playlist = newPlayListSpotify.data.tracks.items

      await youtube.searchOne(`${playlist[0].track.artists[0].name} ${playlist[0].track.name}`).then((music) => {
        songs.push({
          title: playlist[0].track.name,
          url: music.url,
          yut: true
        });
      });
      playlist.shift()
    }
  } else {
    return message.channel.send(`desculpe mas desconheço essa plataforma: ${plataform[2]}`);
  }
  return { songs, playlist };
}

export default createSongs;