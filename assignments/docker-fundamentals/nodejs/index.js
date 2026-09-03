import express from "express";

const app = express();
const PORT = 3000;

app.get("/", (_req, res) => {
  res.status(200).send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Node.js express service running on port ${PORT}`);
});

