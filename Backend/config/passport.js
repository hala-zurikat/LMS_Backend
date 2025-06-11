import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel from "../models/user.models.js";

// استخراج الدوال من الكائن UserModel
const { createUser, findById, getUserbyGoogleId } = UserModel;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      prompt: "select_account",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // البحث عن المستخدم بناءً على oauth_id
        let user = await getUserbyGoogleId(profile.id);
        if (user) {
          return done(null, user);
        }

        // تحضير بيانات المستخدم الجديد
        const newUser = {
          name: profile.displayName,
          email:
            profile.emails && profile.emails[0]
              ? profile.emails[0].value
              : null,
          avatar:
            profile.photos && profile.photos[0]
              ? profile.photos[0].value
              : null,
          oauth_provider: "google",
          oauth_id: profile.id,
          role: "student",
          password: null, // ما فيه كلمة مرور لأنه تسجيل Google
        };

        // إنشاء المستخدم
        const userCreated = await createUser(newUser);
        return done(null, userCreated);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// تخزين المستخدم في السيشن
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// استرجاع المستخدم من السيشن
passport.deserializeUser(async (id, done) => {
  try {
    const user = await findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
