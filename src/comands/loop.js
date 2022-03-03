import messageEmbed from "../responses/messageEmbed";

const loop = (message) => {
  const server = message.client.queue.get(message.guild.id);
  if(!server) return messageEmbed(message, 'Não há nenhuma música tocando');
  if(!server.songs[0]) return messageEmbed(message, 'Não há nenhuma música tocando');
  if(!server.songs[0].loop) {
    server.songs[0].loop = true;
    return messageEmbed(message, 'Música atual foi definida como loop');
  }
  server.songs[0].loop = false;
  return messageEmbed(message, 'Removido loop da música atual');
}

export default loop;