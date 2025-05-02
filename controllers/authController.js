const User = require('../models/User');
const generateToken = require('../utils/generateToken');



//  Register a new user
const registerUser = async (req, res) => {
    const { Username, email, password, role, } = req.body;
    
    try {

        if (!Username || !email || !password) {
            return res.status(400).json({ msg: 'Please provide all required fields' });
        }
        // Check if the user is already registered
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ msg: 'User already exists' });
        // Create a new user
        const user = await User.create({
            Username, email, password, role
        })
        // await user.save();

        if (user) {
            res.status(201).json({ message: 'Registration successful',
                 _id: user._id,
                Username: user.Username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ msg: 'Registration failed. Invalid user data' });
        }
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Server error'})
    };
};


// Login a User 
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (user && (await user.comparePassword(password))) {
            res.json({
                message: 'Login successful',
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Server error' });
        
    }
};

// deactivate user

const deactivateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// logout user
const logoutUser = async (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logged out successfully' });
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    deactivateUser
 };
