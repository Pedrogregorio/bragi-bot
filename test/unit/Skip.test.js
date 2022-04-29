import "dotenv/config";
import skip from "../../src/comands/skip";
import play from "../../src/controller/play";
import mockMessage from "../mock/mockMessage";

describe("play music", () => {
  test('Fetch music on youtube to play', async () => {

    const message = mockMessage('~skip');

    message.client.queue.set(message.guild.id, {
      textChannel: message.channel,
      voiceChannel: message.member.voice.channel,
      connection: {
        play: jest.fn(),
      },
      songs: [
        {
          title: 'teste',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          duration: '00:00:00',
          thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
          loop: false,
        },

        {
          title: 'teste',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          duration: '00:00:00',
          thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
          loop: false,
        }
      ],
      volume: 5,
      playing: true
    });

    await skip(message);
    const { songs } = message.client.queue.get(message.guild.id);
    expect(songs.length).toBe(1);
  });
});
