const User = require('../models/User');

exports.getSignup = (req, res) => {
  if (req.session.userId) {
    return res.redirect('/dashboard');
  }
  res.render('auth/signup', { error: null });
};

exports.postSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.render('auth/signup', { error: 'All fields are required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('auth/signup', { error: 'Email already registered' });
    }

    const user = await User.create({ name, email, password });
    req.session.userId = user._id;
    req.session.userName = user.name;
    res.redirect('/dashboard');
  } catch (err) {
    const message = err.code === 11000 ? 'Email already registered' : err.message;
    res.render('auth/signup', { error: message });
  }
};

exports.getLogin = (req, res) => {
  if (req.session.userId) {
    return res.redirect('/dashboard');
  }
  res.render('auth/login', { error: null });
};

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.render('auth/login', { error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.render('auth/login', { error: 'Invalid email or password' });
    }

    req.session.userId = user._id;
    req.session.userName = user.name;
    res.redirect('/dashboard');
  } catch (err) {
    res.render('auth/login', { error: 'Something went wrong' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/dashboard');
    }
    res.redirect('/login');
  });
};
