const { options, connectionString } = require("../configs/db.config")

const mongoose = require("mongoose");

try {
    // Connect to the MongoDB cluster
    mongoose.connect(
        connectionString,
        options
    );

} catch (e) {
    console.log("could not connect do database");
}

const dbConnection = mongoose.connection;
dbConnection.on("error", (err) => console.log(`Connection error ${err}`));
dbConnection.once("open", () => console.log("Connected to DB!"));