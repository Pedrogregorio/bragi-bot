import { MessageEmbed } from 'discord.js';

const helpCommands = async (server) => {
  const playMusic = new MessageEmbed()
    .setColor('#f7ff00')
    .setTitle('Lista de comandos')
    .setDescription(" `~play [URL musica/playlist Spotify]` - Tocar musica \n `~skip` - Pular musica \n `~list` - Listar fila de musicas \n `~clean` - Limpar listar de musicas \n ")
  await server.send({ embed: playMusic });
  return;
}

export default helpCommands;