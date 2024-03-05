// // models/User.js

// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//   // Define user schema
// });

// const User = mongoose.model('User', userSchema);

// export default User;


// user.model.js

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  displayName: String,
  email: { type: String, required: true },
  image: String,
  accessToken: String,
  refreshToken: String,
});

const User = mongoose.model('User', userSchema);

export default User;
