import youtube from 'youtube-sr';

const mountPlaylist = async (message) => {
  const server = message.client.queue.get(message.guild.id);

  try {
    await youtube.searchOne(`${server.songs[0].artist} ${server.songs[0].name}`).then((music) => {
      server.songs.shift();
      server.songs.unshift({  
        url: music?.url,
        icon: music?.channel.icon.url,
        thumbnail: music?.thumbnail.url,
        title: music?.title,
        author: music?.channel.name,
        duration: music?.duration,
        durationFormatted: music?.durationFormatted,
        yut: true
      });
    });
  } catch (error) {
    console.log(error.message)
  }
}

export default mountPlaylist;