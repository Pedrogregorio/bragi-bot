import serverController from "../controller/serverController";

const pauseSong = async (message) => {
  const server = await serverController(message);
  if (!server.connection.dispatcher.paused) {
    server.connection.dispatcher.pause();
  } else {
    server.connection.dispatcher.resume();
  }
}

export default pauseSong;