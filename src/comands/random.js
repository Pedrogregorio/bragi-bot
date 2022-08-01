import youTube from "youtube-sr";
import serverController from "../controller/serverController";
import mountSong from "../helper/mountSong";
import fetchRandomSong from "../scripts/fetchRandomSong";
import nextMusic from "../scripts/nextMusic";

const randomSongs = async (message, isRandomMessage = true) => {

  const server = await serverController(message, isRandomMessage);

  if (!server.random) return;

  const song = await fetchRandomSong(message);

  const newSong = mountSong(await youTube.searchOne(song.response.song.full_title));

  server.songs.push(newSong);

  if (server.songs.length === 1) nextMusic(message);
}

export default randomSongs;