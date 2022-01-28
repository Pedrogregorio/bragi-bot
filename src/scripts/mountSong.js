import youtube from 'youtube-sr';
import ytdl from 'ytdl-core';
import spotifyApi from 'spotify-url-info';
import axios from 'axios';
import messageEmbed from '../responses/messageEmbed';

const createSongs = async (message) => {
  let playlist = [];
  let songs = []

  const content = message.content.split(" ");
  

  const plataform = content[1].split("/");
  let music;

  if(plataform[2] === 'www.youtube.com') {
    const songInfo = await ytdl.getInfo(content[1]);
    music = await youtube.searchOne(songInfo.videoDetails.title)
    songs.push(mountSong(music));
  }

  else if(plataform[2] === 'open.spotify.com') {
    const songInfo = await spotifyApi.getPreview(content[1]);

    if (songInfo.type === 'track') { 
      music = await youtube.searchOne(`${songInfo.artist} ${songInfo.title}`)
      songs.push(mountSong(music));
    }

    else if (songInfo.type === 'playlist' || songInfo.type === 'album') {
      messageEmbed(message, 'Processando playlist `' + songInfo.title + '`')

      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      
      const { data: { access_token } } = await axios.post(
        process.env.GET_TOKEN_SPOTIFY, 
        params, { headers: { 'Authorization': `Basic ${process.env.CODE_AUTORIZATON_SPOTIFY}` } }
      ).catch((e) => messageEmbed(message, `desculpe mas ocorreu um erro: ${e.message}`));

      if (songInfo.type === 'playlist') {
        const newPlayListSpotify = await axios({
          method: 'GET',
          url: `${process.env.URL_API_SPOTIFY}/playlists/${plataform[4]}/tracks`,
          headers: { 'Authorization': `Bearer ${access_token}` }
        }).catch((e) => messageEmbed(message, `desculpe mas ocorreu um erro com essa playlist: ${e.message}`) );
        newPlayListSpotify.data.tracks.items.forEach((element) => {
          playlist.push({
            name: element.track.name,
            artist: element.track.artists[0].name,
          })
        })
  
        await youtube.searchOne(`${playlist[0].artist} ${playlist[0].name}`).then((music) => {
          songs.push(mountSong(music));
        });
        playlist.shift()
      } else {
        const newPlayListSpotify = await axios({
          method: 'GET',
          url: `${process.env.URL_API_SPOTIFY}/albums/${plataform[4]}/tracks`,
          headers: { 'Authorization': `Bearer ${access_token}` }
        }).catch((e) => messageEmbed(message, 'desculpe mas ocorreu um erro com esse album') );
        newPlayListSpotify.data.items.forEach((element) => {
          playlist.push({
            name: element.name,
            artist: element.artists[0].name,
          })
        })
  
        await youtube.searchOne(`${playlist[0].artist} ${playlist[0].name}`).then((music) => {
          songs.push(mountSong(music));
        });
        playlist.shift()
      }
    }
  } else {
    content.shift()
    let text = content;
    let music = await youtube.searchOne(`${text.join(' ')}`)
    songs.push(mountSong(music));
  }
  return { songs, playlist };
}

function mountSong(music) {
  return {
    url: music?.url,
    icon: music?.channel.icon.url,
    thumbnail: music?.thumbnail.url,
    title: music?.title,
    author: music?.channel.name,
    duration: music?.duration,
    durationFormatted: music?.durationFormatted,
    yut: true
  };
}

export default createSongs;