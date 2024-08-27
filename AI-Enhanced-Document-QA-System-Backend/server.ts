const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const Server = require("./src/index").default;
const app = express();
const server = new Server(app);

app
  .listen(process.env.PORT, "localhost", function () {
    console.info(`Server running on : http://localhost:${process.env.PORT}`);
  })
  .on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      console.log("Server startup error: address already in use");
    } else {
      console.log("Port Error: ", err);
    }
  });
