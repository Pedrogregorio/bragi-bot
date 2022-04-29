class MusicException extends Error {
  constructor(message) {
    super(message);
    this.name = 'MusicException';
  }
}

export default MusicException;
