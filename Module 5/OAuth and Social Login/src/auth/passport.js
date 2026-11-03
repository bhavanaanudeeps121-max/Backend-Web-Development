'use strict';
// auth/passport.js — Google OAuth strategy

const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { users, nextId } = require('../data');

function verifyCallback(accessToken, refreshToken, profile, done) {
  try {
    // 1. Returning OAuth user: match on Google's stable ID
    const byGoogleId = users.find((u) => u.googleId === profile.id);
    if (byGoogleId) {
      return done(null, byGoogleId);
    }

    // 2. Existing local account with the same email
    const email = profile.emails[0].value;
    const byEmail = users.find((u) => u.email === email);
    if (byEmail) {
      if (profile._json.email_verified !== true) {
        // Never link an unverified email: reject to prevent account takeover
        return done(null, false);
      }
      byEmail.googleId = profile.id;
      return done(null, byEmail);
    }

    // 3. Brand-new user
    const newUser = {
      id: nextId(),
      googleId: profile.id,
      email,
      name: profile.displayName,
      role: 'member',
    };
    users.push(newUser);
    return done(null, newUser);
  } catch (err) {
    return done(err);
  }
}

passport.use(
  new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID     || 'test-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'test-client-secret',
      callbackURL:  '/auth/google/callback',
    },
    verifyCallback,
  ),
);

// verifyCallback is exported so tests can call it directly without a real browser.
module.exports = { passport, verifyCallback };
