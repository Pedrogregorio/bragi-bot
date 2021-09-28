import 'dotenv/config';
import Discord from 'discord.js';
import createSongs from './scripts/mountSong';
import ytdl from 'ytdl-core';
import playingMusic from './responses/play';
import listMusics from './responses/list';
import mountPlaylist from './scripts/mountPlaylist';
import helpCommands from './responses/help';

const client = new Discord.Client();
const queue = new Map();

client.once('ready', () => {
  console.log('Bot Online!');
})

client.on('message', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith('~')) return;
  const serverQueue = queue.get(message.guild.id);
  
  if(message.content.startsWith('~play')) {
    const voiceChannel = message.member.voice.channel;
    
    if (!voiceChannel) return message.channel.send("*você precisa estar em um canal de voz para tocar musica!*");
    if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
      return message.channel.send(`${message.author.username} *Voce não pertence ao canal  :kissing:*`)
    }
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send(
        "Preciso das permissões para entrar e falar no seu canal de voz!"
      );
    }

    const server = {
      textChannel: message.channel,
      voiceChannel: message.member.voice.channel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    }
    
    const { songs, playlist } = await createSongs(message);
    if (!serverQueue) {
      queue.set(message.guild.id, server);
      server.songs.push(...songs)
      server.connection = await voiceChannel.join()
      play(message.guild, server.songs[0]);
      if (playlist.length > 0) {
        for(const play of playlist) {
          const newPlaylist = await mountPlaylist(play)
          server.songs.push(newPlaylist);
        }
      }
    } else {
      if (playlist.length > 0) {
        const newPlaylist = await mountPlaylist(playlist);
        serverQueue.songs.push(...songs);
        serverQueue.songs.push(newPlaylist);
        message.channel.send('Musicas adcionadas à fila');
      } else {
        serverQueue.songs.push(...songs);
        return message.channel.send('Musica adcionada à fila');
      }
    }
    return;
  }

  if (message.content.startsWith('~skip')) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send("*você precisa estar em um canal de voz para pular a musica!*");
    if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
      return message.channel.send(`${message.author.username} *Você não pertence ao canal  :kissing:*`)
    }
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send(
        "Preciso das permissões para entrar e falar no seu canal de voz!"
      );
    }

    let queueServe = queue.get(message.guild.id)
    skipMusic(message, queueServe);
    return;
  }

  if (message.content.startsWith('~list')) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send("*você precisa estar em um canal de voz para listar as musicas!*");
    if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
      return message.channel.send(`${message.author.username} *Você não pertence ao canal  :kissing:*`)
    }
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send(
        "Preciso das permissões para entrar e falar no seu canal de voz!"
      );
    }

    let queueServe = queue.get(message.guild.id)
    queueMusic(message, queueServe);
    return;
  }

  if (message.content.startsWith('~help')) {
    helpCommands(message.channel)
    return;
  }

  if (message.content.startsWith('~clean')) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send("*você precisa estar em um canal de voz para pular a musica!*");
    if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
      return message.channel.send(`${message.author.username} *Você não pertence ao canal  :kissing:*`)
    }
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send(
        "Preciso das permissões para entrar e falar no seu canal de voz!"
      );
    }
    let queueServe = queue.get(message.guild.id)
    purgeQueue(message, queueServe);
    return;
  }
})

function queueMusic(message, serverQueue) {
  // Adicionar validação, para saber se a pessoa pertence ao canal
  let msg = '';
  serverQueue.songs.forEach((song, index) => {
    if (index === 10) return msg = msg + `More...\n`
    if (index > 10) return msg;
    msg = msg + `**${index + 1} - ${song.title} ** ${ index === 0? ':play_pause:' : ':musical_note:' }\n`
  });
  listMusics(message, msg);
}

function purgeQueue(message, serverQueue) {
  // Adicionar validação, para saber se a pessoa pertence ao canal
  if (serverQueue?.songs.length > 0) {
    serverQueue.songs = [];
    return message.channel.send("Sua lista agora está vazia!"); 
  }
  return message.channel.send("Sua lista já está vazia!");
}

function skipMusic(message, serverQueue) {
  // Adicionar validação, para saber se a pessoa pertence ao canal
  if (!message.member.voice.channel)
    return message.channel.send(
      "Você tem que pertencer ao canal para pular a musica!"
    );
  if (!serverQueue) return message.channel.send("Nao há nehuma musica para ser pulada!");
  serverQueue.songs.shift();
  play(message.guild, serverQueue.songs[0]);
}

function play(guild, song) {
  const server = queue.get(guild.id);
  const dispatcher = server.connection
  .play(ytdl(song.url))
  .on("finish", () => {
    server.songs.shift();
    play(guild, server.songs[0]);
  })
  .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(server.volume / 5);
  playingMusic(server, song.title);
}

client.login(process.env.TOKEN_BOT);