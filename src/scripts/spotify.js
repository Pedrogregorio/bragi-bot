import youtube from 'youtube-sr';
import spotifyApi from 'spotify-url-info';
import axios from 'axios';
import messageEmbed from '../responses/messageEmbed';
import mountSong from './mountSong';

const spotify = async (message, musicMessage) => {
  let playlist = [];
  let songs = [];
  let music;

  const validateSongType = {
    isTrack: (songType) => songType === 'track',
    isPlaylist: (songType) => songType === 'playlist',
    isAlbum: (songType) => songType === 'album',
  }

  const fetchSong = async (infos) => {
    return await axios({
      method: 'GET',
      url: `${process.env.URL_API_SPOTIFY}/${infos.type}/${infos.id}/tracks`,
      headers: { 'Authorization': `Bearer ${infos.token}` }
    }).catch((e) => messageEmbed(message, `desculpe mas ocorreu um erro com ${type}: ${e.message}`) );
  }

  const songInfo = await spotifyApi.getPreview(musicMessage[1]);
  if (validateSongType.isTrack(songInfo.type)) { 
    music = await youtube.searchOne(`${songInfo.artist} ${songInfo.title}`)
    songs.push(mountSong(music));
  }
  
  else if (validateSongType.isPlaylist(songInfo.type) || validateSongType.isAlbum(songInfo.type)) {
    messageEmbed(message, 'Processando playlist `' + songInfo.title + '`')

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    
    const { data: { access_token } } = await axios.post(
      process.env.GET_TOKEN_SPOTIFY, 
      params,
      { headers: { 'Authorization': `Basic ${process.env.CODE_AUTORIZATON_SPOTIFY}` } }
    ).catch((e) => messageEmbed(message, `desculpe mas ocorreu um erro: ${e.message}`));

    let idPlaylist = musicMessage[1].split('/')[4];

    if (validateSongType.isPlaylist(songInfo.type)) {
      const { data: { tracks } } = await fetchSong({
        id: idPlaylist,
        type: 'playlists',
        token: access_token
      });

      tracks.items.forEach((element) => {
        playlist.push({
          name: element.track.name,
          artist: element.track.artists[0].name,
        })
      })

      await youtube.searchOne(`${playlist[0].artist} ${playlist[0].name}`).then((music) => songs.push(mountSong(music)));
      playlist.shift();
    } else {

      const { data: { items } } = await fetchSong({
        id: idPlaylist,
        type: 'albums',
        token: access_token
      });

      items.forEach((element) => {
        playlist.push({
          name: element.name,
          artist: element.artists[0].name,
        })
      })

      await youtube.searchOne(`${playlist[0].artist} ${playlist[0].name}`).then((music) => songs.push(mountSong(music)));
      playlist.shift()
    }
  }
  return { songs, playlist };
}

export default spotify;