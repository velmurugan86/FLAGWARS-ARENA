const authRoutes = require("./routes/auth.routes");
const teamRoutes = require("./routes/team.routes");
const challengeRoutes = require("./routes/challenge.routes");

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();
app.set("trust proxy", 1);
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests from this IP address. Please try again later." },
});

app.use(globalLimiter);

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "https://ctfplatform-psi.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(helmet());

app.get("/", (req, res) => {
  res.send("CTF Backend Running");
});

app.use("/auth", authRoutes);
app.use("/team", teamRoutes);
app.use("/challenges", challengeRoutes);

module.exports = app;
