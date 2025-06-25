import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const userData = {
            google_id: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            number_phone: profile._json.phoneNumber

        };
        done(null, userData);
    } catch (e) {
        done(e, null);
    }
}))

export default passport;
