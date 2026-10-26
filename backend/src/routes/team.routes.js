const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/my-team", authMiddleware, async (req, res) => {
  const teamId = req.user.userId;

  try {
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .select("id, team_name")
      .eq("id", teamId)
      .single();

    if (teamError || !team) {
      return res.status(404).json({ error: "Team not found" });
    }

    const { data: solves, error: solvesError } = await supabase
      .from("solves")
      .select(`challenges:challenge_id (id, points)`)
      .eq("team_id", team.id);

    if (solvesError) {
      return res.status(500).json({ error: solvesError.message });
    }

    let totalScore = 0;
    solves.forEach((solve) => {
      const points = Number(solve.challenges?.points) || 0;
      totalScore += points;
    });

    res.json({
      team_id: team.id,
      team_name: team.team_name,
      score: totalScore,
      solves: solves.length,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.error('My team error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get("/standings", async (req, res) => {
  try {
    const { data: teams, error: teamsError } = await supabase
      .from("teams")
      .select("id, team_name, is_admin")
      .order("team_name");

    if (teamsError) {
      return res.status(500).json({ error: teamsError.message });
    }

    const { data: solves, error: solvesError } = await supabase
      .from("solves")
      .select(`team_id, challenges:challenge_id (id, points)`);

    if (solvesError) {
      return res.status(500).json({ error: solvesError.message });
    }

    const teamStats = {};

    teams.forEach((team) => {
      if (!team.is_admin) {
        teamStats[team.id] = {
          team_name: team.team_name,
          score: 0,
          solves: 0,
        };
      }
    });

    solves.forEach((solve) => {
      const teamId = solve.team_id;
      const points = Number(solve.challenges?.points) || 0;
      if (teamStats[teamId]) {
        teamStats[teamId].score += points;
        teamStats[teamId].solves += 1;
      }
    });

    const standings = Object.entries(teamStats)
      .map(([team_id, stats]) => ({
        team_id,
        team_name: stats.team_name,
        score: stats.score,
        solves: stats.solves,
      }))
      .sort((a, b) => {
        if (a.score !== b.score) return b.score - a.score;
        return b.solves - a.solves;
      });

    res.json(standings);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.error('Standings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
