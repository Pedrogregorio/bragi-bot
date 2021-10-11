import 'dotenv/config';
import Discord from 'discord.js';
import helpCommands from './responses/help';
import runPlay from './controller/player';
import skipMusic from './comands/skipMusic';
import queueMusic from './comands/queueMusics';
import stop from './comands/stop';
import clean from './comands/clean';

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
    
    case '~play':
      runPlay(message);
      break;

    case '~p':
      runPlay(message);
      break;

    case '~skip':
      skipMusic(message);
      break;

    case '~list':
      queueMusic(message);
      break;

    case '~stop':
      stop(message);
      break;

    case '~clean':
      clean(message);
      break;

    case '~help':
      helpCommands(message.channel)
      break;
    
    default:
      console.log(`Desculpe, no conheço o comando: ${content}.`);
  }
})

client.login(process.env.TOKEN_BOT);