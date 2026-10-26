# FlagWars Arena

FlagWars Arena is an open-source Capture The Flag (CTF) cybersecurity competition platform designed for students, security enthusiasts, and ethical hackers to practice, compete, and sharpen offensive and defensive security skills.

---

## What is FlagWars Arena?

FlagWars Arena provides a simulated proving ground featuring challenges across varying difficulty tiers. Participants analyze web applications, crack cryptographic puzzles, inspect digital evidence, and reverse-engineer targets to recover hidden flags and climb the live competitive leaderboard.

---

## What Users Can Do

- **Operative Registration & Authentication**: Create a unique callsign/username and securely authenticate to access the arena dashboard.
- **Challenge Exploration**: Browse and select challenges across curated difficulty levels (Easy, Medium, Hard).
- **Access Hints**: Review progressive hints on difficult challenges to guide your investigation without any point deductions or scoring penalties.
- **Submit Flags**: Submit recovered flags matching the standard format to earn points immediately upon verification.
- **Live Leaderboard**: Track real-time competitive standings, solve timestamps, and point totals against other operatives.
- **Operational Rules**: Access the in-platform Rules and Intel directive to review engagement guidelines and anti-abuse parameters.

---

## Scoring Structure

Points are awarded based on challenge difficulty tiers:

| Tier | Points Awarded | Description |
|---|---|---|
| **Easy** | **100 PTS** | Foundational concepts, direct inspection, and reconnaissance |
| **Medium** | **200 PTS** | Multi-step problem solving, script development, and logical exploits |
| **Hard** | **300 PTS** | In-depth analysis, cryptographic weaknesses, and complex exploitation |

Hints are fully accessible to assist learning and do not reduce challenge point values.

---

## Standard Flag Format

All flags in FlagWars Arena follow the standard wrapper convention:

```
FWA{sample_flag_content_here}
```

- Every flag begins with `FWA{` and terminates with `}`.
- Submissions are case-sensitive and verified cryptographically on the server.
- Flags must be submitted without extraneous spaces.

---

## Rules of Engagement

1. **Infrastructure Integrity**: Do not perform Denial of Service (DoS/DDoS) attacks, automated stress testing, or unauthorized scanning against the arena infrastructure.
2. **Anti-Bruteforce Protection**: Automated flag fuzzing and password brute-forcing are strictly restricted. Flag submissions are throttled to a maximum of 10 attempts per minute per IP address.
3. **Fair Competition**: Solve challenges independently. Do not share, trade, or publicly distribute flags during active competition sessions.
4. **Ethical Purpose**: All skills and techniques practiced within this arena are intended exclusively for legal educational purposes and defensive skill enhancement.

---

## License

This project is open-source and licensed under the MIT License.
