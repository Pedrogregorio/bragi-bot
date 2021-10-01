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
    
    if (!voiceChannel) return message.channel.send("*Você precisa estar em um canal de voz para tocar música!*");
    if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
      return message.channel.send(`${message.author.username} *Você não pertence ao canal  :kissing:*`)
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
      try {
        queue.set(message.guild.id, server);
        server.songs.push(...songs)
        server.connection = await voiceChannel.join()
      } catch (error) {
        console.log(error.message)
      }
      if (playlist.length > 0) {
        server.songs.push(...playlist);
      }

      nextMusic(message.guild);
    } else {
      if (playlist.length > 0) {
        try {
          serverQueue.songs.push(...songs);
          serverQueue.songs.push(...playlist);
          message.channel.send('Músicas adicionadas à fila');
        } catch (error) {
          console.log(error.message);
        }
      } else {
        serverQueue.songs.push(...songs);
        return message.channel.send('Música adicionada à fila');
      }
    }
    return;
  }

  if (message.content.startsWith('~skip')) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send("*Você precisa estar em um canal de voz para pular a música!*");
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
    if (!voiceChannel) return message.channel.send("*Você precisa estar em um canal de voz para listar as músicas!*");
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

  if (message.content.startsWith('~stop')) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send("*Você precisa estar em um canal de voz para parar me parar*");
    if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
      return message.channel.send(`${message.author.username} *Você não pertence ao canal  :kissing:*`)
    }
    let queueServe = queue.get(message.guild.id)
    stop(message.guild, queueServe)
  }

  if (message.content.startsWith('~clean')) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send("*Você precisa estar em um canal de voz para pular a musica!*");
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
    clearQueue(message, queueServe);
    return;
  }
})

function stop(guild, serverQueue) {
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
  serverQueue.voiceChannel.leave();
  queue.delete(guild.id);
}

function queueMusic(message, serverQueue) {
  let msg = '';
  serverQueue.songs.forEach((song, index) => {
    if (index === 10) return msg = msg + `More...\n`
    if (index > 10) return msg;
    if (!song?.yut) {
      msg = msg + `**${index + 1} - ${song.track.name} ** ${ index === 0? ':play_pause:' : ':musical_note:' }\n`
    } else {
      msg = msg + `**${index + 1} - ${song.title} ** ${ index === 0? ':play_pause:' : ':musical_note:' }\n`
    }
  });
  if (serverQueue.songs.length < 1) msg = 'Lista vazia' 
  listMusics(message, msg);
}

function clearQueue(message, serverQueue) {
  if (serverQueue?.songs.length > 0) {
    serverQueue.songs = [];
    return message.channel.send("Sua lista agora está vazia!"); 
  }
  return message.channel.send("Sua lista já está vazia!");
}

function skipMusic(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "Você tem que pertencer ao canal para pular a música!"
    );
  if (!serverQueue) return message.channel.send("Não há nenhuma música para ser pulada!");
  serverQueue.songs.shift();
  nextMusic(message.guild);
}

async function nextMusic(guild) {
  try {
    const server = queue.get(guild.id)
    let music;
    if (!server.songs[0]?.yut) {
      music = await mountPlaylist(server.songs[0])
      play(guild, music)
    }else {
      play(guild, server.songs[0])
    }
  } catch (error) {
    console.log(error.message)
  }
}

function play(guild, song) {
  const server = queue.get(guild.id);
  if (!song) {
    setTimeout(()=>{
      try {
        if (!server) return
        server.voiceChannel.leave();
        queue.delete(guild.id);
        return;
      } catch (error) {
        console.log(error.message)
      }
    }, 30000)
  } else {
    const dispatcher = server.connection
    .play(ytdl(song.url, { filter: "audioonly", quality: "lowestaudio" }))
    .on("finish", () => {
      server.songs.shift();
      nextMusic(guild);
    })
    .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(server.volume / 5);
    playingMusic(server, song.title);
  }
}

client.login(process.env.TOKEN_BOT);