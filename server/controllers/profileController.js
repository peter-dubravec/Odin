const User = require("../models/user")
const Post = require("../models/post")
const { body } = require('express-validator');
const handleBodyErr = require("../middleware/handle_body_err");
const he = require('he');

const user_posts_get = async (req, res) => {
    const id = req.params.id

    const userPosts = await Post.find({ createdBy: id }).populate("createdBy", "firstname lastname photo").populate("comments.commentedBy", "firstname lastname photo")

    if (!userPosts) {
        return res.status(200).json({ message: "Nobody added post yet." })
    }

    userPosts.forEach(post => {
        post.createdBy.photo && (post.createdBy.photo = he.decode(post.createdBy.photo))

        if (post.comments.length) {
            post.comments.forEach(comment => {
                if (comment.commentedBy.photo) {
                    comment.commentedBy.photo = he.decode(comment.commentedBy.photo)
                }
            })
        }
    })

    const likedPosts = { likedPosts: req.user.likedPosts }
    const sortedResultsPosts = userPosts.sort((a, b) => b.createdAt - a.createdAt)
    res.status(200).json({ sortedResultsPosts, likedPosts })
}

const owner_posts_get = async (req, res) => {
    const id = req.user.id

    const userPosts = await Post.find({ createdBy: id }).populate("createdBy", "firstname lastname photo").populate("comments.commentedBy", "firstname lastname photo")

    if (!userPosts) {
        return res.status(200).json({ message: "Nobody added post yet." })
    }

    userPosts.forEach(post => {
        post.createdBy.photo && (post.createdBy.photo = he.decode(post.createdBy.photo))

        if (post.comments.length) {
            post.comments.forEach(comment => {
                if (comment.commentedBy.photo) {
                    comment.commentedBy.photo = he.decode(comment.commentedBy.photo)
                }
            })
        }
    })

    const likedPosts = { likedPosts: req.user.likedPosts }
    const sortedResultsPosts = userPosts.sort((a, b) => b.createdAt - a.createdAt)
    res.status(200).json({ sortedResultsPosts, likedPosts })

}

const main_profile_get = (req, res) => {
    console.log("here")
    const resObj = {
        firstname: req.user.firstname,
        lastname: req.user.lastname,
        friendsCount: req.user.friends.length,
        photo: req.user.photo
    }
    resObj.photo && (resObj.photo = he.decode(req.user.photo))
    res.json(resObj);
}

const user_profile_get = async (req, res) => {
    const id = req.params.id
    const user = await User.findById(id, "firstname lastname photo friends -_id")

    let { firstname, lastname, photo, friends } = user
    photo && (photo = he.decode(photo))

    const friendsCount = friends.length
    const isFriend = friends.some(friendId => friendId == req.user.id)

    res.status(200).json({ firstname, lastname, photo, friendsCount, isFriend })

}

const delete_post = async (req, res) => {
    const { id } = req.body;
    const post = await Post.findByIdAndDelete(id)
    res.status(200).json({ mssg: "ok" })
}


const update_photo_post = [
    body("url", "Invalid URL").trim().escape().isLength({ min: 1 }),
    handleBodyErr,
    async (req, res) => {
        const { id } = req.user
        const { url } = req.body
        try {
            const user = await User.findByIdAndUpdate(id, { photo: url }, { new: true })
            user.photo && (user.photo = url)
            res.status(200).json({ user })
        } catch (err) {
            res.send(err)
        }
    }

]



module.exports.profileController = { user_posts_get, main_profile_get, user_profile_get, owner_posts_get, delete_post, update_photo_post }