const passport = require("passport");
const FacebookTokenStrategy = require("passport-facebook-token");
const GoogleTokenStrategy = require("passport-google-token").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const config = require("./config/mainConfig");
const User = require("./models/User");

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

exports.getToken = function (user) {
  return jwt.sign(user.toJSON(), config.JWT_SECRET, {
    expiresIn: 604800, // 1 week
  });
};

const opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.JWT_SECRET;

exports.jwtPassport = passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    User.findById(jwt_payload._id, (err, user) => {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);

exports.googlePassport = passport.use(
  new GoogleTokenStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ email: profile.emails[0].value }, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (!err && user) {
          console.log(user);
          return done(null, user);
        } else {
          const newUser = new User({
            googleId: profile.id,
            fullName: profile.displayName,
            email: profile.emails[0].value,
          });
          newUser.save((err, user) => {
            if (err) {
              return done(err, false);
            }
            return done(null, user);
          });
        }
      });
    }
  )
);

exports.facebookPassport = passport.use(
  new FacebookTokenStrategy(
    {
      clientID: config.FACEBOOK_CLIENT_ID,
      clientSecret: config.FACEBOOK_CLIENT_SECRET,
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("profile", profile);
      User.findOne({ email: profile.emails[0].value }, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (!err && user) {
          console.log(user);
          return done(null, user);
        } else {
          const newUser = new User({
            facebookId: profile.id,
            fullName: profile.displayName,
            email: profile.emails[0].value,
          });
          newUser.save((err, user) => {
            if (err) {
              return done(err, false);
            }
            return done(null, user);
          });
        }
      });
    }
  )
);

exports.verifyFacebook = passport.authenticate("facebook-token", {
  session: false,
});

exports.verifyGoogle = passport.authenticate("google-token", {
  session: false,
});

exports.verifyUser = passport.authenticate("jwt", { session: false });
