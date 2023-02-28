const express = require('express');
const router = express.Router();
const { userController } = require("../controllers/userController")
const { dashboardController } = require("../controllers/dashboardController")
const { profileController } = require("../controllers/profileController")

module.exports = (passport) => {

    router.get("/", (req, res) => {
        res.send("ahoj")
    })

    router.post("/register", userController.sign_up_post)

    router.post("/login", userController.login_post)

    router.get("/testuser", userController.test_user_get)

    router.post("/create-post", passport.authenticate('jwt', { session: false }), dashboardController.post_create)

    router.post("/comment-post", passport.authenticate('jwt', { session: false }), dashboardController.comment_post)

    router.post("/like-post", passport.authenticate('jwt', { session: false }), dashboardController.like_post)

    router.post("/unlike-post", passport.authenticate('jwt', { session: false }), dashboardController.unLike_post)


    router.post("/send-request", passport.authenticate('jwt', { session: false }), userController.friend_request_post)

    router.post("/add-friend", passport.authenticate('jwt', { session: false }), userController.add_friend_post)


    router.get("/dashboard", passport.authenticate('jwt', { session: false }), dashboardController.posts_get)


    router.get("/friendslist", passport.authenticate('jwt', { session: false }), userController.friends_list_get)

    router.get("/user/:id", passport.authenticate('jwt', { session: false }), profileController.user_posts_get)

    router.get("/myprofile", passport.authenticate('jwt', { session: false }), profileController.main_profile_get)

    router.get("/owner-posts", passport.authenticate('jwt', { session: false }), profileController.owner_posts_get)

    router.get("/profile/user/:id", passport.authenticate('jwt', { session: false }), profileController.user_profile_get)

    router.post("/delete-post", passport.authenticate('jwt', { session: false }), profileController.delete_post)

    router.post("/change-photo", passport.authenticate('jwt', { session: false }), profileController.update_photo_post)

    router.get("/friend-requests", passport.authenticate('jwt', { session: false }), userController.friend_requests_get)

    router.get('/auth/facebook', passport.authenticate('facebook', { session: false, scope: ['email'] }));

    router.get('/auth/facebook/odin', passport.authenticate('facebook', { failureRedirect: '/login', session: false }), userController.login_from_fb)



    return router
}



