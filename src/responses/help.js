import { MessageEmbed } from 'discord.js';

const helpCommands = async (server) => {
  const playMusic = new MessageEmbed()
    .setColor('#59636b')
    .setTitle('Lista de comandos')
    // .setDescription(commands.join('\n'))
    .addFields(
      { name: "\u200b", value: "\u200b" },

      { name: "~play, ~p [URL/Texto]  ▶", value: "Você pode colocar uma url do youtube ou spotify para tocar. E também pode digitar o nome da sua música que fazemos a busca", inline: true },
      { name: "~list, ~queue 📜", value: "Listar as suas músicas na fila. Para adicionar uma música na fila, basta dar o comando de play que a música será adicionada automaticamente.", inline: true },

      { name: "\u200b", value: "\u200b" },

      { name: "~pause, ~resume  ⏯", value: "Pausar/Continuar a musica atual", inline: true },
      { name: "~clean  🧹", value: "Limpar a sua lista de musicas", inline: true },

      { name: "\u200b", value: "\u200b" },

      { name: "~loop  🔁", value: "Definir a música atual como loop(ela irá ficar repetindo até que o comando seja digitado novamente)", inline: true },
      { name: "~random, ~r 🔀", value: "Caso não saiba o que quer ouvir, programar o bot para tocar uma música aleatória", inline: true },

      { name: "\u200b", value: "\u200b" },

      { name: "~skip  ⏭", value: "Pular a música que está tocando. Se for somente uma música, não será pulada.", inline: true },
      { name: "~stop, ~quit, ~disconnect, ~leave  👋", value: "Comandos utilizados para remover o bot da sala de voz(sua lista será apagada).", inline: true },
    )
    .addField("\u200b", "\u200b")
    .setTimestamp();
  await server.send({ embed: playMusic });
  return;
}

export default helpCommands;