const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const Schema = mongoose.Schema

const UserSchema = new Schema({
    firstname: { type: String, minLength: 3 },
    lastname: { type: String, minLength: 3 },
    email: { type: String, unique: true, },
    password: { type: String },
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    friendRequests: [{ type: Schema.Types.ObjectId, ref: "User" }],
    sentRequests: [{ type: Schema.Types.ObjectId, ref: "User" }],
    likedPosts: [{ type: String }],
    photo: { type: String, default: "" },
    facebookId: { type: String }
})

UserSchema.statics.signup = async function ({ firstname, lastname, password, email }) {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = await this.create({ firstname, lastname, email, password: hash })

    return user
}

module.exports = mongoose.model("User", UserSchema)