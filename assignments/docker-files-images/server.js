const express = require("express");

const application = express();
const PORT = process.env.PORT || 3000;

// Main route handler returning multi-stage container message
application.get("/", (_request, response) => {
  response.setHeader("Content-Type", "text/html");
  response.send("<h1>Hello World from Docker Multi-Stage Build!</h1>");
});

application.listen(PORT, () => {
  console.log(`Express application active and listening on port ${PORT}`);
});