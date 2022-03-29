import "dotenv/config";
import play from "../../src/controller/play";

describe("play music", () => {
  test('Fetch music on youtube to play', async () => {

    const message = {
      client: { queue: new Map() },
      guild: { id: '123456789' },
      content:  "~skip",
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
      songs: [
        {
          title: 'teste',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          duration: '00:00:00',
          thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',        
        },

        {
          title: 'teste',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          duration: '00:00:00',
          thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',        
        }
      ],
      volume: 5,
      playing: true
    });

    await play(message);
    const { songs } = message.client.queue.get(message.guild.id);
    expect(songs.length).toBe(1);
  });
});
