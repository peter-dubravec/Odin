const Post = require("../models/post")
const { body } = require('express-validator');
const handleBodyErr = require("../middleware/handle_body_err");
const User = require("../models/user")
const async = require("async")
const he = require("he")

const posts_get = async (req, res) => {
    const { friends } = await User.findById(req.user.id, "friends")

    async.parallel({
        friendsPosts(callback) {
            Post.find({ createdBy: friends }).populate("createdBy", "firstname lastname photo").populate("comments.commentedBy", "firstname lastname photo").exec(callback)
        },

        userPosts(callback) {
            Post.find({ createdBy: req.user.id }).populate("createdBy", "firstname lastname photo").populate("comments.commentedBy", "firstname lastname photo").exec(callback)
        },



    }, (err, { friendsPosts, userPosts }) => {
        const resultsPosts = friendsPosts.concat(userPosts)

        if (!resultsPosts) {
            return res.status(200).json({ message: "Nobody added post yet." })
        }


        resultsPosts.forEach(post => {
            if (post.createdBy.photo) {
                post.createdBy.photo = he.decode(post.createdBy.photo)
            }

            if (post.comments.length) {
                post.comments.forEach(comment => {
                    if (comment.commentedBy.photo) {
                        comment.commentedBy.photo = he.decode(comment.commentedBy.photo)
                    }
                })
            }
        })



        const likedPosts = { likedPosts: req.user.likedPosts }

        const sortedResultsPosts = resultsPosts.sort((a, b) => b.createdAt - a.createdAt)

        res.status(200).json({ sortedResultsPosts, likedPosts })
    })

}

const post_create = [
    body("text", "Post text").trim().escape().isLength({ min: 1 }),
    handleBodyErr,
    async (req, res) => {
        const { text } = req.body
        try {
            const post = await Post.create({ createdBy: req.user.id, text, postLikes: 0 })

            const populatedPost = await Post.findById(post._id).populate("createdBy", "firstname lastname photo")
            populatedPost.createdBy.photo && (populatedPost.createdBy.photo = he.decode(populatedPost.createdBy.photo))
            console.log(populatedPost.createdBy.photo)
            return res.status(200).json(populatedPost)

        } catch (error) {
            return res.status(400).json(error)
        }
    }
]

const comment_post = [
    body("commentText", "Invalid text").trim().escape().isLength({ min: 1 }),
    handleBodyErr,
    async (req, res) => {
        const { commentText, id } = req.body
        const commentedPost = await Post.findByIdAndUpdate(id, { $push: { comments: { commentText, commentedBy: req.user.id, commentLikes: 0 } } }, { new: true }).populate("comments.commentedBy", "firstname lastname photo")

        commentedPost.comments.forEach(comment => {
            if (comment.commentedBy.photo) {
                comment.commentedBy.photo = he.decode(comment.commentedBy.photo)
            }
        })

        return res.status(200).json(commentedPost.comments)
    }
]

const like_post = async (req, res) => {
    const { id } = req.body
    const post = await Post.findByIdAndUpdate(id, { $inc: { postLikes: 1 } }, { new: true })
    const userLikedPosts = await User.findByIdAndUpdate(req.user.id, { $addToSet: { likedPosts: id } }, { new: true }).select("likedPosts -_id")
    return res.status(200).json(userLikedPosts)
}

const unLike_post = async (req, res) => {
    const { id } = req.body
    const post = await Post.findByIdAndUpdate(id, { $inc: { postLikes: -1 } }, { new: true })

    const userLikedPosts = await User.findByIdAndUpdate(req.user.id, { $pull: { likedPosts: id } }, { new: true }).select("likedPosts -_id")

    return res.status(200).json(userLikedPosts)
}

module.exports.dashboardController = { posts_get, post_create, comment_post, like_post, unLike_post }