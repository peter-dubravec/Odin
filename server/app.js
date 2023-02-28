const express = require("express");
const logger = require("morgan")
const passport = require("passport")
const https = require('https')
const path = require('path')
const fs = require('fs')
const app = express()


const cors = require("cors")

app.use(cors({
    origin: ['http://localhost:3000'],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

const initializePassport = require("./configs/passport")
initializePassport(passport)

require("./services/db.service")
require("dotenv").config()


app.use(express.json())
app.use(logger("dev"))

app.use(passport.initialize())

const indexRotuer = require("./routes/index")(passport)

app.use("/api", indexRotuer)

app.listen(process.env.PORT, () => {
    console.log("App is listening on port " + process.env.PORT)
})