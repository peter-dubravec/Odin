const User = require("../models/user")
const createToken = require("../utils/jwt_create_token")
const { body } = require('express-validator');
const handleBodyErr = require("../middleware/handle_body_err");
const bcrypt = require("bcryptjs")
const async = require("async")
const he = require('he');



const sign_up_post = [
    body("firstname", "Firstname must be at least 2 characters long").trim().escape().isLength({ min: 2 }),
    body("lastname", "Lastname must be at least 2 characters long").trim().escape().isLength({ min: 2 }),
    body("email", "Invalid Email").isEmail().trim().escape(),
    body("password", "Password can't be empty").isLength({ min: 1 }),
    handleBodyErr,
    async (req, res) => {
        let { firstname, lastname } = req.body

        firstname = firstname.charAt(0).toUpperCase() + firstname.slice(1)
        lastname = lastname.charAt(0).toUpperCase() + lastname.slice(1)

        req.body.firstname = firstname
        req.body.lastname = lastname

        try {

            const user = await User.signup(req.body);
            const token = createToken(user);
            res.json({ message: "Logged in", token })
        } catch (error) {
            if (error.code === 11000) {
                res.status(401).json({ error: "Email already exists" })
            }
        }
    }
]

const login_post = [
    body("email", "Invalid email").trim().escape(),
    body("password", "Password can't be empty").isLength({ min: 1 }),
    handleBodyErr,
    async (req, res) => {
        const { email, password } = req.body

        try {
            const user = await User.findOne({ email })
            if (!user) {
                return res.status(401).json({ error: "Invalid username or password" })
            }
            const isAuth = await bcrypt.compare(password, user.password)
            if (!isAuth) {
                return res.status(401).json({ error: "Invalid username or password" })
            }

            const token = createToken(user);
            res.status(200).json({ message: "logged in", token })

        } catch (error) {
            return res.status(400).json(error)
        }
    }
]

const login_from_fb = (req, res) => {
    const token = createToken(req.user);
    res.cookie('login_token', token, { maxAge: 9000000000, secure: false });
    res.redirect("http://localhost:3000/")
}


const add_friend_post = (req, res) => {
    const { friendId } = req.body
    async.parallel({
        reciever_add(callback) {
            User.findByIdAndUpdate(req.user.id, { $addToSet: { friends: friendId } }, { new: true }).exec(callback)
        },

        reciever_pull(callback) {
            User.findByIdAndUpdate(req.user.id, { $pull: { friendRequests: friendId } }, { new: true }).exec(callback)
        },

        sender(callback) {
            User.findByIdAndUpdate(friendId, { $addToSet: { friends: req.user.id } }, { new: true }).exec(callback)
        },
    }, (err, results) => {
        const { firstname, lastname } = results.sender

        res.status(200).json({ _id: results.sender._id, firstname, lastname })
    })
}

const friend_request_post = async (req, res) => {
    const { friendRequestId } = req.body

    try {

        const requestSent = await User.findById(friendRequestId).where("friendRequests").equals(req.user.id)

        if (requestSent) {
            return res.status(400).json({ error: "Request already sent" })
        }


        const post = await User.findByIdAndUpdate(friendRequestId, { $addToSet: { friendRequests: req.user.id } }, { new: true })

        const { sentRequests } = await User.findByIdAndUpdate(req.user.id, { $addToSet: { sentRequests: friendRequestId } }, { new: true })

        res.status(200).json(sentRequests)

    } catch (error) {
        if (error) {
            res.status(400).json({ error: "Already send friend request" })
        }
    }
}

const friends_list_get = async (req, res) => {
    const { friends, friendRequests, sentRequests } = await User.findById(req.user.id, "friends friendRequests sentRequests").populate("friends", "firstname lastname")

    const allUsers = await User.find({}, "firstname lastname")

    if (!friends.length) {
        const withoutFriendsInRequest = allUsers.filter(obj => !friendRequests.some(el => el._id.equals(obj._id)) && obj._id != req.user.id)

        return res.status(200).json({ notFriends: withoutFriendsInRequest, friends: [], sentRequests })
    }

    const notFriends = allUsers.filter(obj => !friends.some(el => el._id.equals(obj._id)) && obj._id != req.user.id && !friendRequests.some(el => el._id.equals(obj._id)))


    return res.status(200).json({ notFriends, friends, sentRequests })
}


const friend_requests_get = async (req, res) => {
    const { friendRequests } = await User.findById(req.user.id, "friendRequests -_id").populate("friendRequests", "firstname lastname").select("friendRequests")

    res.status(200).json(friendRequests)

}

const test_user_get = async (req, res) => {
    let user = await User.findOne({ email: "test@test.com" }, "_id")
    if (!user) {
        const userObj = {
            firstname: "John",
            lastname: "Smith",
            email: "test@test.com",
            photo: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MDM5MTB8MHwxfHNlYXJjaHwxfHx1c2VyfGVufDB8fHx8MTY3NjgxODc1NQ&ixlib=rb-4.0.3&q=80&w=400"
        }

        user = await User.create(userObj)
    }

    const token = createToken(user);

    res.status(200).json({ message: "logged in", token })
}

module.exports.userController = { sign_up_post, login_post, add_friend_post, friend_request_post, friends_list_get, friend_requests_get, login_from_fb, test_user_get }