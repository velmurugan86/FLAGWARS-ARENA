import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState([]);
  const [difficulty, setDifficulty] = useState('easy');
  const [flag, setFlag] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedChallengeDetails, setSelectedChallengeDetails] = useState(null);
  const [showHint, setShowHint] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoadingChallenges, setIsLoadingChallenges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setIsLoadingChallenges(true);

    fetch(API_ENDPOINTS.CHALLENGES, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Failed to load challenges');
        return data;
      })
      .then((data) => setChallenges(Array.isArray(data) ? data : []))
      .catch((err) => {
        setChallenges([]);
        setMessage(err?.message || 'Failed to load challenges');
      })
      .finally(() => setIsLoadingChallenges(false));
  }, [navigate]);

  const handleChallengeClick = (challenge) => {
    if (challenge.isPlaceholder || challenge.isSolved) return;
    setSelectedChallengeDetails(challenge);
    setSelectedId(challenge.id);
    setShowDetails(true);
    setMessage('');
    setFlag('');
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedChallengeDetails(null);
    setShowHint(null);
    setMessage('');
    setFlag('');
  };

  const submitFlag = async () => {
    setMessage('');
    const token = localStorage.getItem('token');

    if (!selectedId) return setMessage('Please choose a challenge first');
    if (!flag) return setMessage('Please enter a flag');

    setIsSubmitting(true);

    try {
      const res = await fetch(API_ENDPOINTS.SUBMIT_FLAG, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ challengeId: selectedId, flag }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || 'Submission failed');
        setIsSubmitting(false);
        return;
      }

      setChallenges((prev) =>
        prev.map((c) => (c.id === selectedId ? { ...c, isSolved: true } : c))
      );

      setMessage(data.message);
      setFlag('');
      setTimeout(() => {
        closeDetails();
      }, 1000);

      const refreshRes = await fetch(API_ENDPOINTS.CHALLENGES, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (refreshRes.ok) {
        const updated = await refreshRes.json();
        setChallenges(Array.isArray(updated) ? updated : []);
      }
    } catch {
      setMessage('An error occurred while submitting the flag');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = challenges.filter((c) => c.difficulty === difficulty);

  const padded = (() => {
    const safe = Array.isArray(filtered) ? filtered : [];
    if (safe.length >= 10) return safe.slice(0, 10);
    const placeholders = Array.from({ length: 10 - safe.length }, (_, i) => ({
      id: `placeholder-${difficulty}-${i}`,
      title: 'CLASSIFIED',
      description: 'Incoming frequency transmission encrypted. Stand by for deployment.',
      difficulty,
      points: 0,
      isPlaceholder: true,
    }));
    return [...safe, ...placeholders];
  })();

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
              <span className="text-accent ml-2">CHALLENGES</span>
            </h1>
            <p className="mt-2 text-primary/80 terminal-text">
              Navigate the cosmos and capture flags across the universe.
            </p>
          </div>

          <div
            className="flex items-center gap-2 rounded-2xl bg-black/90 border border-primary/40 px-3 py-2"
            style={{ fontFamily: 'Share Tech Mono, Fira Code, JetBrains Mono, monospace' }}
          >
            {['easy', 'medium', 'hard'].map((d) => {
              const isActive = difficulty === d;
              return (
                <button
                  key={d}
                  id={`difficulty-${d}`}
                  onClick={() => setDifficulty(d)}
                  className={`relative overflow-hidden px-4 py-2 rounded-lg text-xs sm:text-sm font-bold tracking-wider border-2 transition-all duration-300 terminal-text flex items-center justify-center gap-2 cursor-pointer ${
                    isActive
                      ? 'border-accent text-accent bg-black/80 shadow-accent/40 shadow-lg'
                      : 'border-accent/40 text-muted-foreground hover:text-accent hover:bg-accent/10 hover:shadow-accent/30 hover:shadow-lg'
                  }`}
                >
                  <span className="relative z-20">{d.toUpperCase()}</span>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-accent/30 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000 ease-out" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8">
          {isLoadingChallenges ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-8">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="bg-black/90 border border-primary/30 p-6 animate-pulse rounded-xl">
                  <div className="h-4 w-24 bg-white/10 rounded" />
                  <div className="mt-4 h-6 w-2/3 bg-white/10 rounded" />
                  <div className="mt-3 h-4 w-full bg-white/10 rounded" />
                  <div className="mt-2 h-4 w-5/6 bg-white/10 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-8">
              {padded.map((challenge) => (
                <div
                  key={challenge.id}
                  id={`challenge-card-${challenge.id}`}
                  onClick={() => handleChallengeClick(challenge)}
                  className={`relative rounded-3xl border p-6 backdrop-blur-xl transition-all duration-300 ${
                    challenge.isSolved
                      ? 'border-primary/20 bg-black/50 opacity-60 cursor-not-allowed select-none'
                      : challenge.isPlaceholder
                      ? 'opacity-30 cursor-not-allowed select-none border-primary/20 bg-black/60'
                      : 'cursor-pointer border-primary/40 bg-black/80 hover:border-accent hover:shadow-accent/30 hover:shadow-2xl'
                  }`}
                  style={{ fontFamily: 'Share Tech Mono, Fira Code, JetBrains Mono, monospace' }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className={`text-xs font-semibold terminal-text tracking-widest ${
                      challenge.isSolved ? 'text-accent/60' : 'text-accent'
                    }`}>
                      {challenge.difficulty?.toUpperCase()}
                    </span>
                    <div className="flex items-center gap-2">
                      {challenge.isSolved && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/15 text-primary/80 border border-primary/30">
                          SOLVED
                        </span>
                      )}
                      <span className={`text-xs font-bold font-mono ${
                        challenge.isSolved ? 'text-accent/60' : 'text-accent'
                      }`}>
                        {challenge.points} pts
                      </span>
                    </div>
                  </div>

                  <h3 className={`mt-4 text-lg font-bold line-clamp-1 ${
                    challenge.isSolved ? 'text-primary/70' : 'text-foreground'
                  }`} style={{ fontFamily: 'Orbitron, monospace' }}>
                    {challenge.title}
                  </h3>

                  <p className={`mt-2 text-sm line-clamp-3 ${
                    challenge.isSolved ? 'text-primary/50' : 'text-primary/80'
                  }`}>
                    {challenge.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between text-xs border-t pt-4 border-primary/20">
                    <span className={`terminal-text font-bold ${challenge.isSolved ? 'text-primary/60' : 'text-muted-foreground'}`}>
                      {challenge.isPlaceholder ? 'LOCKED' : challenge.isSolved ? 'STATUS: SOLVED' : 'STATUS: ACTIVE'}
                    </span>
                    {challenge.isSolved ? (
                      <span className="text-xs font-bold text-primary/60 font-mono tracking-wider">SOLVED</span>
                    ) : challenge.isPlaceholder ? null : (
                      <div className="flex items-center gap-1 text-primary">
                        <span>ACCESS</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showDetails && selectedChallengeDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 overflow-y-auto">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeDetails}
          />
          <div className="relative w-full max-w-3xl bg-black/90 border border-primary/30 overflow-hidden max-h-[90vh] flex flex-col rounded-xl">
            <div className="p-6 overflow-y-auto flex-grow">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground terminal-text">
                    {selectedChallengeDetails.difficulty?.toUpperCase()} • {selectedChallengeDetails.points} points
                  </div>
                  <h2 className="mt-1 text-2xl font-extrabold text-foreground" style={{ fontFamily: 'Orbitron, monospace' }}>
                    {selectedChallengeDetails.title}
                  </h2>
                </div>
                <button
                  id="close-modal"
                  onClick={closeDetails}
                  className="rounded-xl p-2 text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <div className="prose max-w-none">
                  <p className="text-foreground/90">{selectedChallengeDetails.description}</p>
                </div>

                {selectedChallengeDetails.link && (
                  <div className="mt-4">
                    <a
                      href={selectedChallengeDetails.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 transition-colors text-sm font-semibold terminal-text"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15,3 21,3 21,9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      {selectedChallengeDetails.linkname || 'Open Challenge Link'}
                    </a>
                  </div>
                )}

                {(selectedChallengeDetails.hint1 || selectedChallengeDetails.hint2) && (
                  <div className="mt-6 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {selectedChallengeDetails.hint1 && (
                        <button
                          id="show-hint-1"
                          onClick={() => setShowHint((prev) => (prev === 1 ? null : 1))}
                          className="text-sm px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-foreground/90 border border-white/10 transition-colors terminal-text cursor-pointer"
                        >
                          Show Hint 1
                        </button>
                      )}
                      {selectedChallengeDetails.hint2 && (
                        <button
                          id="show-hint-2"
                          onClick={() => setShowHint((prev) => (prev === 2 ? null : 2))}
                          className="text-sm px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-foreground/90 border border-white/10 transition-colors terminal-text cursor-pointer"
                        >
                          Show Hint 2
                        </button>
                      )}
                    </div>

                    {showHint === 1 && selectedChallengeDetails.hint1 && (
                      <div className="mt-2 p-3 text-sm bg-white/5 rounded-lg border border-white/10 text-foreground/80 terminal-text">
                        <span className="font-medium">Hint 1:</span> {selectedChallengeDetails.hint1}
                      </div>
                    )}
                    {showHint === 2 && selectedChallengeDetails.hint2 && (
                      <div className="mt-2 p-3 text-sm bg-white/5 rounded-lg border border-white/10 text-foreground/80 terminal-text">
                        <span className="font-medium">Hint 2:</span> {selectedChallengeDetails.hint2}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-primary/30 bg-black/95">
              <div className="space-y-4">
                <div>
                  <label htmlFor="flag-input" className="block text-sm font-medium text-muted-foreground mb-2 terminal-text">
                    Submit Flag
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="flag-input"
                      type="text"
                      placeholder="Enter flag (format: FWA{...})"
                      className="flex-1 px-4 py-3 rounded-xl border border-border bg-background/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm terminal-text"
                      value={flag}
                      onChange={(e) => setFlag(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && submitFlag()}
                    />
                    <button
                      id="submit-flag"
                      onClick={submitFlag}
                      disabled={isSubmitting}
                      className={`flex justify-center items-center gap-2 px-6 py-3 font-bold tracking-wider rounded-lg border-2 border-primary bg-transparent text-primary transition-all duration-300 relative overflow-hidden terminal-text ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/10 hover:shadow-primary/50 hover:shadow-lg cursor-pointer'
                      }`}
                    >
                      <span className="relative z-20">{isSubmitting ? 'Submitting...' : 'Submit'}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                    </button>
                  </div>
                </div>

                {message && (
                  <div
                    className={`mt-2 rounded-xl px-4 py-3 text-sm ${(() => {
                      const msg = message.toLowerCase();
                      if (msg.includes('incorrect')) return 'bg-accent/10 border border-accent/40 text-accent';
                      if (msg.includes('already') || msg.includes('solved')) return 'bg-amber-500/10 border border-amber-500/40 text-amber-300';
                      if (msg.includes('correct')) return 'bg-primary/10 border border-primary/20 text-primary';
                      return 'bg-accent/10 border border-accent/40 text-accent';
                    })()}`}
                  >
                    {message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
