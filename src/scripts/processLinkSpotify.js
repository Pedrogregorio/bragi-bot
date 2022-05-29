import youtube from 'youtube-sr';
import spotifyApi from 'spotify-url-info';
import axios from 'axios';
import messageEmbed from '../responses/messageEmbed';
import mountSong from '../helper/mountSong';
import MusicException from '../class/MusicException';

let playlist = [];
let songs = [];
let music;

const processLinkSpotify = async (message, musicMessage) => {
  const validateSongType = {
    isTrack: (songType) => songType === 'track',
    isPlaylist: (songType) => songType === 'playlist',
    isAlbum: (songType) => songType === 'album',
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
    ).catch((e) => {
      throw new MusicException(`desculpe mas ocorreu um erro: ${e.message}`);
    });

    let idPlaylist = musicMessage[1].split('/')[4];

    if (validateSongType.isPlaylist(songInfo.type)) {
      await processPlaylistSpotify(idPlaylist, access_token);
    } else {
      await processAlbumSpotify(idPlaylist, access_token);
    }
  }

  return { songs, playlist };
}

async function fetchSong (infos) {
  return await axios({
    method: 'GET',
    url: `${process.env.URL_API_SPOTIFY}/${infos.type}/${infos.id}/tracks`,
    headers: { 'Authorization': `Bearer ${infos.token}` }
  }).then((response) => {
    return response.data;
  }).catch(() => {
    throw new MusicException(`desculpe mas ocorreu um erro com ${infos.type}`);
  });
}

async function processPlaylistSpotify(idPlaylist, accessToken) {
  const infos = {
    id: idPlaylist,
    type: 'playlists',
    token: accessToken
  }

  const { tracks } = await fetchSong(infos);

  tracks.items.forEach((element) => {
    playlist.push({
      name: element.track.name,
      artist: element.track.artists[0].name,
    })
  })

  await youtube.searchOne(`${playlist[0].artist} ${playlist[0].name}`).then((music) => {
    songs.push(mountSong(music))
    playlist.shift();
  }).catch(() => {
    throw new MusicException('Não foi possivel encontrar a música!');
  });
}

async function processAlbumSpotify(idPlaylist, accessToken) {
  const { items } = await fetchSong({
    id: idPlaylist,
    type: 'albums',
    token: accessToken
  });

  items.forEach((element) => {
    playlist.push({
      name: element.name,
      artist: element.artists[0].name,
    })
  })

  await youtube.searchOne(`${playlist[0].artist} ${playlist[0].name}`).then((music) => {
    songs.push(mountSong(music))
    playlist.shift()
  }).catch(() => {
    throw new MusicException('Não foi possivel encontrar a música!');
  });
}

export default processLinkSpotify;