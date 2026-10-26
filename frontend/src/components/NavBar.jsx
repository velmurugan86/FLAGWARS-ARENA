import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { useAuth } from '../contexts/AuthContext';

export default function NavBar() {
  const { user, logout } = useAuth();
  const [currentTeam, setCurrentTeam] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      setCurrentTeam(null);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(API_ENDPOINTS.MY_TEAM, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => { if (data) setCurrentTeam(data); })
      .catch(() => {});
  }, [user, location.pathname]);

  return (
    <nav className="sticky top-0 z-50 pt-3 pb-4">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="w-full flex h-20 items-center justify-between gap-4 rounded-2xl border border-primary/40 bg-black/80 backdrop-blur-xl px-4 sm:px-6">
          <div className="flex items-center gap-6 min-w-0">
            <div className="w-[240px] shrink-0 overflow-hidden flex items-center">
              <Link
                to="/challenges"
                className="text-xl font-extrabold tracking-tight text-foreground hover:text-primary transition-colors typing-header"
                style={{ fontFamily: 'Orbitron, monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}
              >
                <span className="text-primary">FLAGWARS</span>
                <span className="text-accent ml-2">ARENA</span>
              </Link>
            </div>

            <div className="hidden sm:flex items-center gap-6 shrink-0" style={{ fontFamily: 'Orbitron, monospace' }}>
              <Link
                id="nav-challenges"
                to="/challenges"
                className={`text-xs font-bold tracking-wider transition-colors ${
                  location.pathname === '/challenges'
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                CHALLENGES
              </Link>
              <Link
                id="nav-leaderboard"
                to="/leaderboard"
                className={`text-xs font-bold tracking-wider transition-colors ${
                  location.pathname === '/leaderboard'
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                LEADERBOARD
              </Link>
              <Link
                id="nav-rules"
                to="/rules"
                className={`text-xs font-bold tracking-wider transition-colors ${
                  location.pathname === '/rules'
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                RULES
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="sm:hidden flex items-center gap-3 text-xs font-mono">
              <Link
                to="/challenges"
                className={location.pathname === '/challenges' ? 'text-primary font-bold' : 'text-muted-foreground'}
              >
                CHALLENGES
              </Link>
              <Link
                to="/leaderboard"
                className={location.pathname === '/leaderboard' ? 'text-primary font-bold' : 'text-muted-foreground'}
              >
                LEADERBOARD
              </Link>
              <Link
                to="/rules"
                className={location.pathname === '/rules' ? 'text-primary font-bold' : 'text-muted-foreground'}
              >
                RULES
              </Link>
            </div>

            <div className="hidden md:flex flex-col sm:flex-row items-center gap-2">
              {currentTeam && (
                <div className="inline-flex items-center px-2 sm:px-4 py-1 sm:py-2 rounded-xl border-2 border-accent bg-black/50 backdrop-blur-sm">
                  <span className="text-xs sm:text-sm font-medium text-accent terminal-text">{currentTeam.team_name}: </span>
                  <span className="text-xs sm:text-sm font-bold text-accent font-mono">{currentTeam.score}</span>
                  <span className="text-xs sm:text-sm font-bold text-accent font-mono ml-1">pts</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              {user ? (
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full">
                  <span className="text-sm text-muted-foreground max-w-[160px] sm:max-w-[220px] truncate terminal-text text-center sm:text-left">
                    {user.username}
                  </span>
                  <button
                    id="logout-btn"
                    onClick={logout}
                    className="flex justify-center items-center gap-2 px-3 sm:px-4 py-2 font-bold tracking-wider rounded-lg border-2 border-primary bg-transparent text-primary hover:bg-primary/10 text-xs sm:text-sm w-full sm:w-auto cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : location.pathname !== '/login' ? (
                <Link
                  to="/login"
                  className="flex justify-center items-center gap-2 px-3 sm:px-4 py-2 font-bold tracking-wider rounded-lg border-2 border-primary bg-transparent text-primary hover:bg-primary/10 text-xs sm:text-sm w-full sm:w-auto text-center"
                >
                  Sign In
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
