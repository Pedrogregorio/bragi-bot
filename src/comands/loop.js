import serverController from "../controller/serverController";
import messageEmbed from "../responses/messageEmbed";

const loop = async (message) => {
  const server = await serverController(message);
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