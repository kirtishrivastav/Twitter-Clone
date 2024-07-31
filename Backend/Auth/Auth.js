const User= require('../Models/User.model');
const bcrypt = require("bcrypt");
const { generateToken}=require('../Middlewares/AuthMiddleware');
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');


dotenv.config();


exports.SignUp = async (req, res) => {
    const { username, name, email, password } = req.body;

    if (!username || !name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        user = new User({
            username,
            name,
            email,
            password
        });

        const saltRounds = 10;
        user.password = await bcrypt.hash(password, saltRounds);

        await user.save();

        const token = generateToken({ username: user.username });

        res.status(200).json({ response: user, token: token });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};


exports.login = async (req, res) => {
  try {
      // Extract username and password from body
      const { username, password } = req.body;

      
      if (!username || !password) {
          return res.status(400).json({ err: "Username and password are required" });
      }

      // Find the user by username
      const person = await User.findOne({ username });

      // Check if the user exists
      if (!person) {
          console.log("User not found");
          return res.status(401).json({ err: "Invalid username or password" });
      }

      // Compare the password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, person.password);

      if (!isMatch) {
          return res.status(401).json({ err: "Invalid username or password" });
      }

      // Generate token
      const payload = {
          id: person.id,
          username: person.username,
      };

      const token = jwt.sign(payload, process.env.SECRET_KEY);

      // Send token as response
      res.json({ token ,person});
  } catch (err) {
      console.error("Error during login:", err);
      res.status(500).json({ error: "Internal server error" });
  }
};

  