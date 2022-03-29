const message = (message) => {
  return {
    client: { queue: new Map() },
    guild: { id: '123456789' },
    content:  message,
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

export default message;
