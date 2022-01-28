const pauseSong = (message) => {
  const server = message.client.queue.get(message.guild.id)
  if (!server.connection.dispatcher.paused) {
    server.connection.dispatcher.pause();
  } else {
    server.connection.dispatcher.resume();
  }
}

export default pauseSong;