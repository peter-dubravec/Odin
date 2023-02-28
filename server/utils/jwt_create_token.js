var jwt = require('jsonwebtoken');
require("dotenv").config()

module.exports = ({ _id }) => {
    var token = jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '3000m' })
    return token;
};