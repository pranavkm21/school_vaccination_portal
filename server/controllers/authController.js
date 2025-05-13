const jwt = require('jsonwebtoken');

// Simulate login and return a token
const login = (req, res) => {
  const { username, password } = req.body;

  // Hardcoded user for simulation
  if (username === 'admin' && password === 'password123') {
    // Generate a token (simulated)
    const token = jwt.sign({ username: 'admin' }, 'secretKey', { expiresIn: '1h' });

    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
};

module.exports = { login };