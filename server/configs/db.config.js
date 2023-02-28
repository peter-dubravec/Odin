require("dotenv").config()

const connectionString = process.env.MONGO_CONNECTION_STRING

const options = {
    useNewUrlParser: true, useUnifiedTopology: true
}


module.exports = { options, connectionString }