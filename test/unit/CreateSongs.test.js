import "dotenv/config";
import createSongs from "../../src/scripts/createSongs"

describe('Create songs', () => {
  jest.setTimeout(90000)

  test('Creating youtube songs successfully', async () => {
    const { songs } = await createSongs({ content: '~p https://www.youtube.com/watch?v=dQw4w9WgXcQ' });

    expect(songs.length).toBe(1);
  });

  test('Creating spotify songs successfully', async () => {
    const { songs } = await createSongs({ content: '~p https://open.spotify.com/track/3NzAGfWHqQVEfYVcYKxNLN?si=e9c55d8701a646c9' });

    expect(songs.length).toBe(1);
  });

  test('Creating songs from text successfully', async () => {
    const { songs } = await createSongs({ content: '~p A loba' });

    expect(songs.length).toBe(1);
  });

  test('Creating spotify playlist successfully', async () => {
    const message = {
      channel: {
        send: jest.fn(),
      },
      content: '~p https://open.spotify.com/playlist/3TKaJWKrwxSNqddFkp5S4h?si=15be46bb4386435a',
    }

    const { songs, playlist } = await createSongs(message);
    expect(songs.length).toBe(1);
    expect(playlist.length).toBe(3);
  });
});