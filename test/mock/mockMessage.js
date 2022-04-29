const mockMessage = (message) => {
  return {
    client: { queue: new Map() },
    guild: { id: '123456789' },
    content:  message,
    react: jest.fn(),
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
}

export default mockMessage;
