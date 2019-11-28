const config = {
  tx: {
    url: process.env.TX_ENGINE_URL || "http://localhost:4000",
    auth: {
      username: process.env.TX_ENGINE_USERNAME || "system",
      password: process.env.TX_ENGINE_PASSWORD || "secret"
    }
  }
};

export default config;
