import { MessageEmbed } from 'discord.js';

const helpCommands = async (server) => {
  const commands =
    [
      "**`~play, ~p [URL musica/playlist Spotify]`** - Tocar musica",
      "**`~skip`** - Pular musica",
      "**`~list, ~queue`** - Listar fila de musicas",
      "**`~clean`** - Limpar listar de musicas",
      "**`~stop, ~quit, ~disconnect, ~leave`** - Parar o bot",
      "**`~pause, ~resume`** - Pausar/Continuar musica",
      "**`~loop`** - Definir musica como loop(Desenvolvimento)"
    ];
  const playMusic = new MessageEmbed()
    .setColor('#59636b')
    .setTitle('Lista de comandos')
    .setDescription(commands.join('\n'));
  await server.send({ embed: playMusic });
  return;
}

export default helpCommands;