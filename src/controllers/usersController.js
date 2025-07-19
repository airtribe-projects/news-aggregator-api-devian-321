const bcrypt = require('bcrypt');
const userModels = require("../models/userModels");
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;



if (!JWT_SECRET_KEY) {
    console.error('FATAL ERROR: JWT_SECRET_KEY is not defined in .env');
    process.exit(1);
}


const registerUser = async (userData) => {
    const { name, email, password } = userData;
    if (!name || !email || !password) {
        throw new Error('Please enter all fields');
    }
    let user = await userModels.findOne({ email });
    if (user) {
        const error = new Error('User already exists');
        error.code = 11000;
        throw error;
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    user = new userModels({
        name,
        email,
        password: hashedPassword,
    });

    await user.save();
    return user;
};


const loginUser = async (email, password) => {
    const dbUser = await userModels.findOne({ email });
    if (!dbUser) {
        throw new Error("User not found");
    }
    const isSamePassword = await bcrypt.compare(password, dbUser.password);
    if (!isSamePassword) {
        throw new Error("Invalid credentials");
    }

    const payload = {
        id: dbUser._id,
        email: dbUser.email,
        role: dbUser.role
    };

    const token = jwt.sign(payload, JWT_SECRET_KEY, {
        expiresIn: '1h'
    });
    const { password: userPassword, ...userWithoutPassword } = dbUser.toObject();
    return {
        token,
        user: userWithoutPassword
    };
};

module.exports = { registerUser, loginUser };
