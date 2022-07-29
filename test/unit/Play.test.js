import "dotenv/config";
import play from "../../src/controller/play";
import serverController from "../../src/controller/serverController";
import mockMessage from "../mock/mockMessage";


describe("play music", () => {
  test('Fetch music on youtube to play', async () => {
    const message = mockMessage("~p https://www.youtube.com/watch?v=dQw4w9WgXcQ");

    message.client.queue.set(message.guild.id, {
      textChannel: message.channel,
      voiceChannel: message.member.voice.channel,
      connection: jest.fn(),
      songs: [],
      volume: 5,
      playing: true
    });

    await play(message);
    const { songs } = await serverController(message);
    expect(songs.length).toBe(1);
  });

  test('Error Fetch music on youtube to play', async () => {
    const message = {
      client: { queue: new Map() },
      guild: { id: '123456789' },
      content:  "~play https://www.youtube.com/watch?v=urlerrada",
      channel: {
        send: jest.fn(),
        messages: {
          cache: [],
        }
      },
      member: {
        voice: {
          channel: {
            join: jest.fn()
          }
        }
      }
    };

    message.client.queue.set(message.guild.id, {
      textChannel: message.channel,
      voiceChannel: message.member.voice.channel,
      connection: jest.fn(),
      songs: [],
      volume: 5,
      playing: true
    });

    const data = await play(message);
    expect(data).toBe("Não foi possível encontrar a música!");
  });
});
