// CONSTANTS AND IMPORTS
const express = require("express");
const app = express();
const server = require("http").Server(app);

// const axios = require("axios");

// SERVING STATIC FILES
app.use(express.static(__dirname + "../public"));

// ROUTES


server.listen(process.env.PORT || 8080, function() {
    console.log("I'm listening.");
});