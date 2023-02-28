require("dotenv").config()
const User = require("../models/user")

const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

const FacebookStrategy = require('passport-facebook');
const GoogleStrategy = require('passport-google-oidc');

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;
opts.expireIn

module.exports = (passport) => {

    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        User.findById(jwt_payload._id, function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
                // or you could create a new account
            }
        });
    }))

    passport.use(new FacebookStrategy({
        clientID: process.env.CLIENT_ID_FB,
        clientSecret: process.env.CLIENT_SECRET_FB,
        profileFields: ['id', 'emails', 'name', 'photos'],
        callbackURL: "/api/auth/facebook/odin"
    },
        function (accessToken, refreshToken, profile, done) {
            const firstname = profile.name.givenName
            const lastname = profile.name.familyName
            // const email = profile.emails[0].value
            const photo = profile.photos[0].value

            User.findOne({ facebookId: profile.id }, async function (err, user) {
                if (!user) {
                        const newUser = await User.create({ firstname, lastname, facebookId: profile.id, photo })
                        return done(null, newUser)
                }

                if (user) {
                    return done(null, user)
                }

                return done(null, false)
            });
        }
    ))

};