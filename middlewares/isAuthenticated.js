// middlewares/isAuthenticated.js

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: 'Unauthenticated' });
  };
  
  export default isAuthenticated;
  