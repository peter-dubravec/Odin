const mongoose = require("mongoose")

const Schema = mongoose.Schema

const PostSchema = new Schema({
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    postLikes: { type: Number, default: 0 },
    comments: [{
        type: new Schema({
            commentText: { type: String },
            commentedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
            commentLikes: { type: Number, default: 0 }
        }, { timestamps: true })
    }]
}, { timestamps: true })

module.exports = mongoose.model("Post", PostSchema)