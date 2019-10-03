import express from "express";
import path from "path";
import { api } from "./graphql";

const app = express();
app.use(express.json());

// api
app.use("/gql", api);

// app
app.use(express.static(path.join(__dirname, "../webapp")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../webapp/index.html"));
});

app.listen(process.env.PORT, () =>
  console.log(`==> API @ http://localhost:${process.env.PORT}`)
);
