const mountSong = (music) => {
  return {
    url: music?.url,
    icon: music?.channel.icon.url,
    thumbnail: music?.thumbnail.url,
    title: music?.title,
    author: music?.channel.name,
    duration: music?.duration,
    loop: false,
    durationFormatted: music?.durationFormatted,
    isYoutube: true
  };
}
export default mountSong;
