import 'dotenv/config';
import Discord from 'discord.js';
import helpCommands from './responses/help';
import runPlay from './controller/player';
import skip from './comands/skip';
import queueMusic from './comands/queue';
import stop from './comands/stop';
import clean from './comands/clean';
import pauseSong from './comands/pause';
import shuffleSongs from './comands/shuffle';

const client = new Discord.Client();
client.queue = new Map();

client.once('ready', () => {
  console.log('Bot Online!');
})

client.on('message', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith('~')) return;
  const content = message.content.split(" ")[0];
  switch (content) {
    
    // commands for play

    case '~play':
      runPlay(message);
      break;

    case '~p':
      runPlay(message);
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


    // commanda for clean

    case '~clean':
      clean(message);
      break;


    // command for pause

    case '~pause':
      pauseSong(message);
      break;

    // command for resume

    case '~resume':
      pauseSong(message);
      break;


    // commands for help
    case '~help':
      helpCommands(message.channel);
      break;

    // commands for shuffle
    case '~shuffle':
      shuffleSongs(message.channel);
      break;

    
    default:
      message.channel.send("Desculpe, tente isso:");
      helpCommands(message.channel);
  }
})

client.login(process.env.TOKEN_BOT);