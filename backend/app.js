const express = require("express");
const app = express();


const mainRouter = require("./routes/mainRouter.js");

/* ============================================================= */
// routes
app.use("/", mainRouter);

/* ============================================================= */
module.exports = app;