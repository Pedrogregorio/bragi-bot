import 'dotenv/config';
import Discord from 'discord.js';
import helpCommands from './responses/help';
import play from './controller/play';
import skip from './comands/skip';
import queueMusic from './comands/queue';
import stop from './comands/stop';
import clean from './comands/clean';
import pauseSong from './comands/pause';
import shuffleSongs from './comands/shuffle';
import loop from './comands/loop';

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
      play(message);
      break;

    case '~p':
      play(message);
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
      shuffleSongs(message.channel);
      break;

    case 'p!play':
      message.react('🥲');
      break;

    case 'p!join':
      message.react('🥲');
      break;

    
    default:
      message.channel.send("Desculpe, tente isso:");
      helpCommands(message.channel);
  }
})

client.login(process.env.TOKEN_BOT);