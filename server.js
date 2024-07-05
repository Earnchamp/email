const express = require("express");
const route = require("./routes/route.js");
const app = express();
const dotenv = require("dotenv").config();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api", route);

app.listen(PORT, () => console.log("Server started!"));
