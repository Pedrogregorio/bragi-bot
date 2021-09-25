const Discord = require('discord.js');
const youtube = require('youtube-sr').default;
const ytdl = require('ytdl-core');
const spotifyApi = require('spotify-url-info')
const { token, urlApiSpotify, tokenApiSpotify } = require('../config.json')
const axios = require('axios');

const client = new Discord.Client();
const queue = new Map();
let playlist;

client.once('ready', () => {
  console.log('Bot Online!');
})

client.on('message', (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith('~')) return;
  
  const serverQueue = queue.get(message.guild.id);
  
  if(message.content.startsWith('~play')) {
    joinChannel(message, serverQueue);
  }

  if (message.content.startsWith('~skip')) {
    skipMusic(message, serverQueue);
  }

  if (message.content.startsWith('~list')) {
    queueMusic(message, serverQueue);
  }
})

async function joinChannel(message, serverQueue) {
  const content = message.content.split(" ");
  const voiceChannel = message.member.voice.channel;

  if (!voiceChannel) return message.channel.send("*você precisa estar em um canal de voz para tocar musica!*");
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "Preciso das permissões para entrar e falar no seu canal de voz!"
    );
  }
  const plataform = content[1].split("/");
  let song;
  let music;
  let type;
  const queueContruct = {
    textChannel: message.channel,
    voiceChannel: voiceChannel,
    connection: null,
    songs: [],
    volume: 5,
    playing: true
  };

  if(plataform[2] === 'www.youtube.com') {
    const songInfo = await ytdl.getInfo(content[1]);
    
    song = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
    };
    type = 'track'
  } else if(plataform[2] === 'open.spotify.com') {
    const songInfo = await spotifyApi.getPreview(content[1]);

    if (songInfo.type === 'track') music = await youtube.searchOne(`${songInfo.artist} ${songInfo.title}`)
    song = {
      url: music?.url,
      title: music?.title,
    }
    type = 'track'

    if (songInfo.type === 'playlist' || songInfo.type === 'album') {
      message.channel.send('Processando playlist :laughing:')
      
      type = 'playlist'
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      
      const { data: { access_token } } = await axios.post(
        'https://accounts.spotify.com/api/token', params, {
        headers: { 'Authorization': `Basic ${tokenApiSpotify}` }
      }).catch((e) => message.channel.send(`desculpe mas ocorreu um erro: ${e.message}`));

      const newPlayListSpotify = await axios({
        method: 'GET',
        url: `${urlApiSpotify}${plataform[4]}/tracks`,
        headers: { 'Authorization': `Bearer ${access_token}` }
      }).catch((e) => message.channel.send(`desculpe mas ocorreu um erro: ${e.message}`) );
      playlist = newPlayListSpotify.data.tracks.items

      await youtube.searchOne(`${playlist[0].track.artists[0].name} ${playlist[0].track.name}`).then((music) => {
        queueContruct.songs.push({ 
          title: playlist[0].track.name,
          url: music.url
        });
      });
      playlist.shift()
    }
  }

  if (!serverQueue) {
    queue.set(message.guild.id, queueContruct);
    if (type === 'track') {
      queueContruct.songs.push(song);
    }
    try {
      const connection = await voiceChannel.join()
      queueContruct.connection = connection;
      playYoutube(message.guild, queueContruct.songs[0], type === 'playlist');
    } catch (err) {
      queue.delete(message.guild.id);
      return message.channel.send(`Desculpe, mas ocorreu um erro: ${err.message}`);
    }

  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} Adicionado a lista`);
  }
}

async function finishLine(serverQueue) {
  for(const play of playlist) {
    await youtube.searchOne(`${play.track.artists[0].name} ${play.track.name}`).then((music) => {
      serverQueue.songs.push({ 
        title: play.track.name,
        url: music.url
      });
    });
  }
}

function queueMusic(message, serverQueue) {
  let msg = '';
  serverQueue.songs.forEach((song, index) => {
    if (index === 10) return msg = msg + `More...\n`
    if (index > 10) return msg;
    msg = msg + `**${index} - ${song.title} ** :musical_note:\n`
  });
  const exampleEmbed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Playlist')
    .setDescription(`${msg}`)
  message.channel.send({ embed: exampleEmbed });
}

function skipMusic(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "Você tem que pertencer ao canal para pular a musica!"
    );
  if (!serverQueue) return message.channel.send("Nao há nehuma musica para ser pulada!");
  serverQueue.songs.shift();
  playYoutube(message.guild, serverQueue.songs[0]);
}

function playYoutube(guild, song) {
  const serverQueue = queue.get(guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      playYoutube(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));

  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  const playMusic = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setDescription(`Tocando a musica: **${song.title}** :musical_note:`)
    serverQueue.textChannel.send({ embed: playMusic });
  if (playlist.length > 0) finishLine(serverQueue);
}

client.login(token);