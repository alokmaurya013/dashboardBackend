const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth=require('../middleware/auth')
const router = express.Router();

router.post('/createPrincipal', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role: 'Principal' });
    await user.save();
    res.status(201).json({ message: 'Principal account created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/register', auth(['Principal','Teacher']), async (req, res) => {
  const { name, email, password, role } = req.body;
  // console.log(req.body);
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: `${name} registered successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { role,email, password } = req.body;
   
  try {
    //console.log(req.body);
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });
   // console.log(user);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch||role!=user.role) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
   // console.log(token);
    res.json({ token });
  } catch (error) {
    //console.log(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
