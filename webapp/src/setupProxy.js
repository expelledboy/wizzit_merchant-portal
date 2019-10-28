const proxy = require("http-proxy-middleware");

const backend = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001/";

module.exports = function(app) {
  app.use(proxy("/graphql", { target: backend }));
};
