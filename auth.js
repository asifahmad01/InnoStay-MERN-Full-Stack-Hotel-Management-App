const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Person = require('./model/person');

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    console.log('Received data:', username, password);
    const user = await Person.findOne({ username }); // Ensure case sensitivity matches your schema
    if (!user) {
      return done(null, false, { message: 'Incorrect Username' });
    }

    const isPasswordMatch = await user.comparePassword(password); // Adjust for password hashing if needed
    if (isPasswordMatch) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'Incorrect Password' });
    }

  } catch (error) {
    console.error('Error in authentication:', error);
    return done(error);
  }
}));

module.exports = passport;
