const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const supabase = require("../config/supabase");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Anti-bruteforce protection triggered: Too many login attempts. Access temporarily restricted for 15 minutes.' },
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many registration attempts. Try again later.' },
});

router.post("/login", loginLimiter, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    const { data: team, error } = await supabase
      .from("teams")
      .select("id, team_name, password_hash, is_admin")
      .eq("team_name", username.trim().toLowerCase())
      .single();

    if (error || !team) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, team.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign(
      { userId: team.id, username: team.team_name, isAdmin: team.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error('Login error:', err);
    res.status(500).json({ error: "An error occurred during login" });
  }
});

router.post("/register", registerLimiter, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  const trimmedUsername = username.trim().toLowerCase();

  if (trimmedUsername.length < 3 || trimmedUsername.length > 32) {
    return res.status(400).json({ error: "Username must be between 3 and 32 characters" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  if (!/^[a-z0-9_-]+$/.test(trimmedUsername)) {
    return res.status(400).json({ error: "Username may only contain letters, numbers, underscores, and hyphens" });
  }

  try {
    const { data: existing } = await supabase
      .from("teams")
      .select("id")
      .eq("team_name", trimmedUsername)
      .maybeSingle();

    if (existing) {
      return res.status(409).json({ error: "Username is already taken" });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const { data: newTeam, error: insertError } = await supabase
      .from("teams")
      .insert([{ team_name: trimmedUsername, password_hash: passwordHash, is_admin: false }])
      .select("id, team_name, is_admin")
      .single();

    if (insertError) {
      if (insertError.code === '23505') {
        return res.status(409).json({ error: "Username is already taken" });
      }
      if (process.env.NODE_ENV !== 'production') console.error('Register insert error:', insertError);
      return res.status(500).json({ error: "Registration failed. Please try again." });
    }

    const token = jwt.sign(
      { userId: newTeam.id, username: newTeam.team_name, isAdmin: newTeam.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ token, message: "Account created successfully!" });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error('Register error:', err);
    res.status(500).json({ error: "An error occurred during registration" });
  }
});

module.exports = router;
