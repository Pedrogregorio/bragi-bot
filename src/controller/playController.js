import nextMusic from "../scripts/nextMusic";
import basicMessage from "../responses/basicMessage";
import createSongs from "../scripts/createSongs";
import messageEmbed from "../responses/messageEmbed";
import MusicException from "../class/MusicException";
import serverController from "./serverController";

const playController = async (message) => {
  try {
    const server = await serverController(message);
    const { songs, playlist }  = await createSongs(message);

    if (!songs || !playlist) throw new MusicException("Não foi possível criar a playlist!");

    if (server.songs?.length <= 0) {
      server.songs.push(...songs)

      if (playlist.length > 0) server.songs.push(...playlist);

      return nextMusic(message);
    }

    server.textChannel.messages.cache.forEach(msg => {
      if (msg.embeds[0]?.description === '**Músicas adicionadas à fila**' || msg.embeds[0]?.description === "**Música adicionada à fila**") return msg.delete();
    });;

    if (playlist.length > 0) {
      server.songs.push(...songs);
      server.songs.push(...playlist);

      return basicMessage(message, 'Músicas adicionadas à fila');
    }

    server.songs.push(...songs);

    return basicMessage(message, 'Música adicionada à fila');
  } catch (error) {
    messageEmbed(message, error.message);

    console.table({ Erro: error.message });

    return (error.message);
  }
}

export default playController;