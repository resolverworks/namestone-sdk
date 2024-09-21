class MissingDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MissingDataError";
  }
}

class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
  }
}

class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

export { MissingDataError, NetworkError, AuthenticationError };
