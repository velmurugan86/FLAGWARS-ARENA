const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const authMiddleware = require("../middleware/auth.middleware");
const bcrypt = require("bcrypt");
const rateLimit = require("express-rate-limit");

const submitLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Anti-bruteforce limit triggered: Maximum 10 flag submissions allowed per minute. Please analyze the challenge and slow down.' },
});

router.get("/", authMiddleware, async (req, res) => {
  const teamId = req.user.userId;

  const { data: challenges, error: challengesError } = await supabase
    .from("challenges")
    .select("id, title, description, difficulty, points, link, linkname, hint1, hint2");

  if (challengesError) {
    return res.status(500).json({ error: challengesError.message });
  }

  const { data: userSolves, error: solvesError } = await supabase
    .from("solves")
    .select("challenge_id")
    .eq("team_id", teamId);

  if (solvesError) {
    return res.status(500).json({ error: solvesError.message });
  }

  const solvedIds = new Set((userSolves || []).map((s) => s.challenge_id));

  const challengesWithStatus = (challenges || []).map((c) => ({
    ...c,
    isSolved: solvedIds.has(c.id),
  }));

  res.json(challengesWithStatus);
});

router.post("/submit", authMiddleware, submitLimiter, async (req, res) => {
  const { challengeId, flag } = req.body;
  const teamId = req.user.userId;

  if (!challengeId || !flag) {
    return res.status(400).json({ error: "challengeId and flag required" });
  }

  const { data: solved } = await supabase
    .from("solves")
    .select("id")
    .eq("team_id", teamId)
    .eq("challenge_id", challengeId)
    .maybeSingle();

  if (solved) {
    return res.status(400).json({ error: "Challenge already solved" });
  }

  const { data: challenge } = await supabase
    .from("challenges")
    .select("flag_hash, points")
    .eq("id", challengeId)
    .maybeSingle();

  if (!challenge) {
    await bcrypt.compare(flag, '$2b$12$invalidhashpadding...............................x');
    return res.status(404).json({ error: "Challenge not found" });
  }

  const isCorrect = await bcrypt.compare(flag, challenge.flag_hash);

  if (!isCorrect) {
    return res.status(400).json({ error: "Incorrect flag" });
  }

  const { error: insertSolveError } = await supabase.from("solves").insert([
    {
      team_id: teamId,
      challenge_id: challengeId,
      solved_at: new Date().toISOString(),
    },
  ]);

  if (insertSolveError) {
    if (insertSolveError.code === '23505') {
      return res.status(400).json({ error: "Challenge already solved" });
    }
    return res.status(500).json({ error: insertSolveError.message });
  }

  const { data: teamSolves, error: teamSolvesError } = await supabase
    .from("solves")
    .select("challenge_id")
    .eq("team_id", teamId);

  if (teamSolvesError) {
    return res.status(500).json({ error: teamSolvesError.message });
  }

  const solvedChallengeIds = (teamSolves || []).map((s) => s.challenge_id);
  let totalPoints = 0;

  if (solvedChallengeIds.length > 0) {
    const { data: solvedChallenges, error: solvedChallengesError } = await supabase
      .from("challenges")
      .select("id, points")
      .in("id", solvedChallengeIds);

    if (solvedChallengesError) {
      return res.status(500).json({ error: solvedChallengesError.message });
    }

    totalPoints = (solvedChallenges || []).reduce(
      (sum, c) => sum + (Number(c.points) || 0),
      0
    );
  }

  res.json({
    message: `Correct flag! +${challenge.points} points!`,
    points: totalPoints,
  });
});

module.exports = router;
