import User from '../models/User.js';
import mongoose from 'mongoose';
import crypto from 'crypto';

// Helper function to hash passwords securely without heavy external dependencies
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// In-memory fallback database for zero-config local testing when MongoDB is offline
let inMemoryUsers = [
  {
    _id: 'user_demo_1',
    name: 'Mahin',
    email: 'demo@student.edu',
    password: hashPassword('password123'),
    role: 'student',
    department: 'Computer Science & Engineering',
    studentId: 'CSE-2026-001',
    bio: 'Undergraduate student researching AI algorithms and full-stack development.',
    createdAt: new Date()
  },
  {
    _id: 'user_demo_2',
    name: 'Nazmul Islam',
    email: 'faculty@uni.edu',
    password: hashPassword('faculty123'),
    role: 'faculty',
    department: 'Computer Science & Engineering',
    studentId: 'FAC-1082',
    bio: 'Lecturer in Computer Science & Engineering.',
    createdAt: new Date()
  }
];

const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, role, department, studentId, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const hashedPassword = hashPassword(password);

    if (isDbConnected()) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({ message: 'An account with this email already exists' });
      }

      const newUser = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: role || 'student',
        department: department || 'Computer Science & Engineering',
        studentId: studentId || '',
        bio: bio || ''
      });

      const userResponse = {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        studentId: newUser.studentId,
        bio: newUser.bio,
        createdAt: newUser.createdAt
      };

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully in MongoDB',
        user: userResponse,
        token: `token_${newUser._id}`
      });
    }

    // Fallback: in-memory registration
    const existingInMemory = inMemoryUsers.find(u => u.email.toLowerCase() === normalizedEmail);
    if (existingInMemory) {
      return res.status(400).json({ message: 'An account with this email already exists (in-memory mode)' });
    }

    const newInMemoryUser = {
      _id: `user_${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: role || 'student',
      department: department || 'Computer Science & Engineering',
      studentId: studentId || '',
      bio: bio || '',
      createdAt: new Date()
    };

    inMemoryUsers.push(newInMemoryUser);

    const { password: _, ...userSafe } = newInMemoryUser;

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully (in-memory fallback active)',
      user: userSafe,
      token: `mock_token_${newInMemoryUser._id}`
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// @desc    Authenticate user & login
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const hashedPassword = hashPassword(password);

    if (isDbConnected()) {
      let user = await User.findOne({ email: normalizedEmail });

      // If user is not yet in MongoDB, automatically create demo accounts upon login
      if (!user) {
        if (normalizedEmail === 'demo@student.edu' && password === 'password123') {
          user = await User.create({
            name: 'Mahin',
            email: 'demo@student.edu',
            password: hashedPassword,
            role: 'student',
            department: 'Computer Science & Engineering',
            studentId: 'CSE-2026-001',
            bio: 'Undergraduate student researching AI algorithms and full-stack development.'
          });
        } else if (normalizedEmail === 'faculty@uni.edu' && password === 'faculty123') {
          user = await User.create({
            name: 'Nazmul Islam',
            email: 'faculty@uni.edu',
            password: hashedPassword,
            role: 'faculty',
            department: 'Computer Science & Engineering',
            studentId: 'FAC-1082',
            bio: 'Lecturer in Computer Science & Engineering.'
          });
        }
      }

      if (!user || user.password !== hashedPassword) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        studentId: user.studentId,
        bio: user.bio,
        createdAt: user.createdAt
      };

      return res.json({
        success: true,
        message: 'Login successful',
        user: userResponse,
        token: `token_${user._id}`
      });
    }

    // Fallback: in-memory login
    const user = inMemoryUsers.find(u => u.email.toLowerCase() === normalizedEmail);
    if (!user || user.password !== hashedPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const { password: _, ...userSafe } = user;

    return res.json({
      success: true,
      message: 'Login successful (in-memory fallback active)',
      user: userSafe,
      token: `mock_token_${user._id}`
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Public / Header Token
export const getMe = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated, missing user id header' });
    }

    if (isDbConnected()) {
      const user = await User.findById(userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.json(user);
    }

    const user = inMemoryUsers.find(u => u._id === userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password: _, ...userSafe } = user;
    return res.json(userSafe);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error fetching user profile' });
  }
};

// @desc    Reset / seed default accounts
// @route   POST /api/auth/seed
// @access  Public
export const seedAuth = async (req, res) => {
  try {
    const defaultAccounts = [
      {
        name: 'Mahin',
        email: 'demo@student.edu',
        password: hashPassword('password123'),
        role: 'student',
        department: 'Computer Science & Engineering',
        studentId: 'CSE-2026-001',
        bio: 'Undergraduate student researching AI algorithms and full-stack development.'
      },
      {
        name: 'Nazmul Islam',
        email: 'faculty@uni.edu',
        password: hashPassword('faculty123'),
        role: 'faculty',
        department: 'Computer Science & Engineering',
        studentId: 'FAC-1082',
        bio: 'Lecturer in Computer Science & Engineering.'
      }
    ];

    if (isDbConnected()) {
      await User.deleteMany({});
      const seeded = await User.insertMany(defaultAccounts);
      return res.json({ message: 'Database auth accounts seeded successfully', count: seeded.length });
    }

    inMemoryUsers = defaultAccounts.map((acc, idx) => ({
      _id: `user_demo_${idx + 1}`,
      ...acc,
      createdAt: new Date()
    }));

    return res.json({ message: 'In-memory auth accounts seeded successfully', count: inMemoryUsers.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
