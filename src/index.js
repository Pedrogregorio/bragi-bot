import 'dotenv/config';
import Discord from 'discord.js';
import helpCommands from './responses/help';
import playController from './controller/playController';
import skip from './comands/skip';
import queueMusic from './comands/queue';
import stop from './comands/stop';
import clean from './comands/clean';
import pauseSong from './comands/pause';
import shuffleSongs from './comands/shuffle';
import loop from './comands/loop';
import basicMessage from './responses/basicMessage';
import randomSongs from './comands/random';

const client = new Discord.Client();
client.queue = new Map();

client.once('ready', () => {
  console.log('======> Bot Online! <=======');
})

client.on('message', async (message) => {
  if (message.author.bot) return;

  if (!message.content.startsWith('~')) return;

  const content = message.content.split(" ")[0];

  if (!message.member.voice.channel)
    return basicMessage(
      message,
      "Você tem que pertencer ao canal para realizar uma ação!"
    );

  switch (content) {

    // commands for play

    case '~play':
      playController(message);
      break;

    case '~p':
      playController(message);
      break;


    // command to skip music

    case '~skip':
      skip(message);
      break;


    // commmands for list

    case '~list':
      queueMusic(message);
      break;

    case '~queue':
      queueMusic(message);
      break;


    // commands for stop and leave

    case '~stop':
      stop(message);
      break;

    case '~quit':
      stop(message);
      break;

    case '~disconnect':
      stop(message);
      break;

    case '~leave':
      stop(message);
      break;


    // command to clean

    case '~clean':
      clean(message);
      break;

    // command to loop music

    case '~loop':
      loop(message);
      break;


    // command to pause

    case '~pause':
      pauseSong(message);
      break;

    // command to resume

    case '~resume':
      pauseSong(message);
      break;


    // command to help
    case '~help':
      helpCommands(message.channel);
      break;

    // command to shuffle
    case '~shuffle':
      shuffleSongs(message);
      break;

    case '~random':
      randomSongs(message);
      break;


    case '~r':
      randomSongs(message);
      break;

    default:
      message.channel.send("Desculpe, tente isso:");
      helpCommands(message.channel);
  }
})

client.login(process.env.TOKEN_BOT);