import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { useAuth } from '../contexts/AuthContext';

export default function LeaderboardPage() {
  const [standings, setStandings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const { user } = useAuth();

  const fetchStandings = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.TEAM_STANDINGS);
      if (res.ok) {
        const data = await res.json();
        setStandings(Array.isArray(data) ? data : []);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch {
      setStandings([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStandings();
    const interval = setInterval(fetchStandings, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredStandings = standings.filter((s) =>
    s.team_name?.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  return (
    <div className="min-h-screen pt-4 relative">
      <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1
              className="text-3xl sm:text-4xl font-extrabold tracking-tight"
              style={{ fontFamily: 'Orbitron, monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}
            >
              <span className="text-primary">ARENA</span>
              <span className="text-accent ml-2">LEADERBOARD</span>
            </h1>
            <p className="mt-2 text-primary/80 terminal-text">
              Real-time competitive standings across all active operatives.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-primary/40 bg-black/80 backdrop-blur-sm text-xs font-mono text-primary">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>LIVE</span>
              {lastUpdated && (
                <span className="text-muted-foreground ml-1">({lastUpdated})</span>
              )}
            </div>

            <button
              id="refresh-btn"
              onClick={fetchStandings}
              className="px-4 py-1.5 rounded-xl border border-primary/40 bg-black/80 hover:bg-primary/20 text-xs font-mono text-primary transition-all cursor-pointer"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-72">
            <input
              id="search-teams"
              type="text"
              placeholder="Search team or operative..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-primary/40 bg-black/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-xs font-mono"
            />
          </div>
          <div className="text-xs font-mono text-muted-foreground">
            Displaying {filteredStandings.length} of {standings.length} operatives
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-primary/30 bg-black/80 backdrop-blur-xl">
          {isLoading ? (
            <div className="p-8 text-center text-primary font-mono text-sm">
              Loading arena standings...
            </div>
          ) : filteredStandings.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground font-mono text-sm">
              No operative standings found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs sm:text-sm">
                <thead className="border-b border-primary/30 bg-primary/10 text-primary uppercase tracking-wider text-xs">
                  <tr>
                    <th scope="col" className="px-6 py-4">Rank</th>
                    <th scope="col" className="px-6 py-4">Operative / Team</th>
                    <th scope="col" className="px-6 py-4 text-center">Solves</th>
                    <th scope="col" className="px-6 py-4 text-right">Total Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/20">
                  {filteredStandings.map((entry, index) => {
                    const isCurrentUser =
                      user &&
                      entry.team_name?.toLowerCase() === user.username?.toLowerCase();
                    return (
                      <tr
                        key={entry.team_id || index}
                        className={`transition-colors hover:bg-primary/5 ${
                          isCurrentUser
                            ? 'bg-primary/15 border-l-4 border-l-primary font-bold'
                            : ''
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-xs ${
                              index === 0
                                ? 'bg-accent/20 text-accent border border-accent'
                                : index === 1
                                ? 'bg-slate-400/20 text-slate-300 border border-slate-400'
                                : index === 2
                                ? 'bg-amber-600/20 text-amber-500 border border-amber-600'
                                : 'text-muted-foreground'
                            }`}
                          >
                            #{index + 1}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-foreground font-bold">
                              {entry.team_name}
                            </span>
                            {isCurrentUser && (
                              <span className="px-2 py-0.5 rounded text-[10px] tracking-wider font-bold bg-primary text-black uppercase">
                                You
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-muted-foreground">
                          {entry.solves}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className="text-primary font-bold">
                            {entry.score}
                          </span>
                          <span className="text-muted-foreground ml-1 text-xs">
                            pts
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
