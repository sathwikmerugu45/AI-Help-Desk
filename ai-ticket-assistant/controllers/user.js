import bcrypt from "bcryptjs"; // ✅ Fixed typo: brcypt → bcryptjs
import jwt from "jsonwebtoken";
import User from "../models/user.js";
// import { inngest } from "../inngest/client.js"; // Comment out for now to simplify

export const signup = async (req, res) => {
  const { email, password, skills = [] } = req.body;
  
  try {
    // ✅ Add validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // ✅ FIX: Add await to bcrypt.hash
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // ✅ Create user with correct field name
    const user = await User.create({ 
      email, 
      password: hashedPassword, 
      skills 
    });

    // Comment out Inngest for now to simplify debugging
    // await inngest.send({
    //   name: "user/signup",
    //   data: { email },
    // });

    // ✅ Generate token
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // ✅ Add expiration
    );

    // ✅ Return user without password
    res.status(201).json({ 
      message: "User created successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        skills: user.skills
      }, 
      token 
    });
    
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Signup failed", details: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // ✅ Add validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // ✅ FIX: Add await to User.findOne
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // ✅ Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // ✅ Generate token
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Return user without password
    res.json({ 
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        skills: user.skills
      }, 
      token 
    });
    
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed", details: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    // Verify token (optional - for server-side token invalidation you'd need a blacklist)
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Unauthorized" });
      }
    });
    
    res.json({ message: "Logout successful" });
    
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Logout failed", details: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    // ✅ Remove admin role check - allow anyone to fetch users
    const users = await User.find().select("-password");
    return res.json(users);
    
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ 
      error: "Failed to fetch users",
      details: error.message 
    });
  }
};

export const updateUser = async (req, res) => {
  const { skills = [], role, email } = req.body;
  
  try {
    // ✅ Remove admin role check
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await User.updateOne(
      { email },
      { 
        skills: skills.length ? skills : user.skills, 
        role: role || user.role 
      }
    );
    
    return res.json({ message: "User updated successfully" });
    
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ 
      error: "Update failed", 
      details: error.message 
    });
  }
};