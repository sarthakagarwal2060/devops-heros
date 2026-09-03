import express from "express";

const app = express();
const SERVER_PORT = 3000;

app.get("/", (_req, res) => {
  res.status(200).send("Hello World");
});

app.listen(SERVER_PORT, () => {
  console.log(`Node.js server active on port ${SERVER_PORT}`);
});

