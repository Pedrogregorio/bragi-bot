import axios from "axios";

const fetchRandomSong = async () => {
  let new_song = await fetchSong();

  return new_song;
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function fetchSong() {
  let music = {};
  let status = 404;

  while (status !== 200) {
    await axios.get(`${process.env.URL_GENIUS}${randomInteger(1, 2471960)}?access_token=${process.env.GENIUS_TOKEN}`).then(response => {
      music = response;
      status = response.status;
    }).catch(error => {
      music = error;
      status = error.response.status;
    });
  }

  return music.data;
}

export default fetchRandomSong;