import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogIn, FiUser, FiLock, FiAlertCircle, FiTerminal } from 'react-icons/fi';
import { API_ENDPOINTS } from '../config/api';
import { useAuth } from '../contexts/AuthContext';

const hackerScript = [
  '$ nmap -sS target.ctf.local',
  'PORT     STATE SERVICE',
  '22/tcp   open  ssh',
  '$ hydra -l admin -P rockyou.txt ssh://target',
  '[SUCCESS] ssh://target - login: admin - password: ********',
  '$ ssh admin@target.ctf.local',
  'admin@target:~$ cat flag.txt',
  'flag{h4ck3r_m0d3_4ct1v4t3d}',
];

const randomMessages = [
  'VULNERABILITY FOUND', 'SQL INJECTION DETECTED', 'BUFFER OVERFLOW',
  'ROOT ACCESS GAINED', 'FIREWALL BREACHED', 'ENCRYPTION CRACKED',
  'BACKDOOR INSTALLED', 'PRIVILEGE ESCALATION', 'ZERO-DAY EXPLOIT',
  'SYSTEM COMPROMISED', 'DATA EXFILTRATED', 'AUTHENTICATION BYPASSED',
  'SESSION HIJACKED', 'MAN-IN-THE-MIDDLE', 'DENIAL OF SERVICE',
  'CRYPTOGRAPHIC FAIL', 'XSS VULNERABILITY', 'CSRF ATTACK',
  'DIRECTORY TRAVERSAL', 'ARBITRARY CODE EXEC',
];

export default function LoginPage() {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scriptLine, setScriptLine] = useState(0);
  const [randomTexts, setRandomTexts] = useState([]);
  const navigate = useNavigate();
  const { login: authLogin, user } = useAuth();

  useEffect(() => {
    if (user) navigate('/challenges', { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setScriptLine((prev) => (prev >= hackerScript.length - 1 ? 0 : prev + 1));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const addRandomTexts = () => {
      const topId = Date.now() + Math.random();
      const bottomId = Date.now() + Math.random() + 1;

      setRandomTexts((prev) => [
        ...prev,
        {
          id: topId,
          text: randomMessages[Math.floor(Math.random() * randomMessages.length)],
          x: Math.random() * 60 + 20,
          y: Math.random() * 5 + 1,
        },
        {
          id: bottomId,
          text: randomMessages[Math.floor(Math.random() * randomMessages.length)],
          x: Math.random() * 60 + 20,
          y: Math.random() * 5 + 94,
        },
      ]);

      setTimeout(() => {
        setRandomTexts((prev) => prev.filter((t) => t.id !== topId && t.id !== bottomId));
      }, 3000);
    };

    addRandomTexts();
    const id = setInterval(addRandomTexts, Math.random() * 2000 + 3000);
    return () => clearInterval(id);
  }, []);

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSuccessMsg('');
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    resetForm();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!username || !password) return setError('Both username and password are required');

    setIsLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
        credentials: 'include',
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Login failed. Please check your credentials.');
      if (!data.token) throw new Error('Authentication failed. No token received.');

      authLogin(data.token);
      navigate('/challenges', { replace: true });
    } catch (err) {
      setError(err.message || 'An error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!username || !password || !confirmPassword)
      return setError('All fields are required');
    if (username.trim().length < 3)
      return setError('Username must be at least 3 characters');
    if (password.length < 6)
      return setError('Password must be at least 6 characters');
    if (password !== confirmPassword)
      return setError('Passwords do not match');

    setIsLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
        credentials: 'include',
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Registration failed. Please try again.');

      setSuccessMsg('Account created! Logging you in...');

      if (data.token) {
        authLogin(data.token);
        navigate('/challenges', { replace: true });
      } else {
        setTimeout(() => switchMode('login'), 1500);
      }
    } catch (err) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black overflow-hidden">
      {randomTexts.map((textItem) => (
        <div
          key={textItem.id}
          className="absolute text-primary font-mono text-sm font-bold pointer-events-none"
          style={{
            left: `${textItem.x}%`,
            top: `${textItem.y}%`,
            animation: 'fadeInOut 3s ease-out forwards',
            textShadow: '0 0 10px hsl(120 100% 50%)',
            zIndex: 1,
          }}
        >
          {textItem.text}
        </div>
      ))}

      <div className="relative h-screen flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 p-4 lg:p-8">
        <div className="relative w-full lg:w-1/2 flex items-center justify-center px-4 lg:px-8 py-4 lg:py-8">
          <div className="relative z-10 w-full max-w-lg">
            <div className="text-center">
              <h1
                className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-extrabold tracking-wider leading-tight mb-4 lg:mb-8 text-center lg:text-left whitespace-nowrap"
                style={{ fontFamily: 'Orbitron, monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}
              >
                <span className="text-primary">FLAGWARS</span>
                <span className="text-accent"> ARENA</span>
              </h1>

              <div className="mt-8">
                <div className="flex items-center gap-2 mb-3">
                  <FiTerminal className="text-primary" />
                  <span className="text-xs font-mono text-primary">root@kali:~#</span>
                </div>
                <div className="font-mono text-base h-56 overflow-hidden">
                  <div className="space-y-1">
                    {hackerScript
                      .slice(Math.max(0, scriptLine - 6), scriptLine + 1)
                      .map((line, index) => (
                        <div
                          key={`${scriptLine}-${index}`}
                          className={`text-sm leading-relaxed ${
                            line.startsWith('$') || line.startsWith('[') || line.includes('root@') || line.includes('admin@')
                              ? 'text-primary terminal-text'
                              : line.includes('flag{')
                              ? 'text-accent font-bold'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {line}
                        </div>
                      ))}
                    <div className="flex items-center gap-1">
                      <span className="text-primary terminal-text">admin@target:~$</span>
                      <div className="w-2 h-4 bg-primary animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-full lg:w-1/2 flex items-center justify-center px-4 lg:px-8 py-4 lg:py-8">
          <div className="w-full max-w-md">
            <div
              className="grid overflow-hidden rounded-3xl border border-white/30 bg-black/90 shadow-[0_30px_100px_rgba(0,0,0,0.9)] backdrop-blur-xl relative"
              style={{ fontFamily: "'Share Tech Mono', 'Fira Code', 'JetBrains Mono', monospace" }}
            >
              <div className="absolute inset-0 stars-form-bg" />

              <div className="p-7 sm:p-10 relative z-10">
                <div className="flex rounded-xl border border-primary/30 overflow-hidden mb-6">
                  <button
                    id="tab-login"
                    onClick={() => switchMode('login')}
                    className={`flex-1 py-2 text-sm font-bold tracking-wider transition-all duration-200 cursor-pointer ${
                      mode === 'login'
                        ? 'bg-primary/20 text-primary'
                        : 'text-muted-foreground hover:text-primary/80'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    id="tab-register"
                    onClick={() => switchMode('register')}
                    className={`flex-1 py-2 text-sm font-bold tracking-wider transition-all duration-200 cursor-pointer ${
                      mode === 'register'
                        ? 'bg-primary/20 text-primary'
                        : 'text-muted-foreground hover:text-primary/80'
                    }`}
                  >
                    Register Now
                  </button>
                </div>

                <div className="text-center">
                  <h2 className="text-2xl font-bold tracking-tight text-primary">
                    {mode === 'login' ? 'System Access' : 'Create Account'}
                  </h2>
                  <p className="mt-2 text-sm text-primary/80">
                    {mode === 'login'
                      ? 'Authenticate to begin hacking.'
                      : 'Register to join the arena.'}
                  </p>
                </div>

                <form
                  id={mode === 'login' ? 'login-form' : 'register-form'}
                  onSubmit={mode === 'login' ? handleLogin : handleRegister}
                  className="mt-8 space-y-4"
                >
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label htmlFor="username" className="block text-sm font-medium text-primary">
                        Username
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 z-10 text-primary">
                          <FiUser className="h-5 w-5 text-primary" />
                        </div>
                        <input
                          id="username"
                          name="username"
                          type="text"
                          autoComplete="username"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="block w-full rounded-lg border border-primary/50 bg-black/80 py-3 pl-11 pr-3 text-primary shadow-sm ring-1 ring-inset ring-primary/30 placeholder:text-primary/60 focus:ring-2 focus:ring-inset focus:ring-primary text-sm leading-6"
                          placeholder="Enter your username"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="password" className="block text-sm font-medium text-primary">
                        Password
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 z-10 text-primary">
                          <FiLock className="h-5 w-5 text-primary" />
                        </div>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="block w-full rounded-lg border border-primary/50 bg-black/80 py-3 pl-11 pr-3 text-primary shadow-sm ring-1 ring-inset ring-primary/30 placeholder:text-primary/60 focus:ring-2 focus:ring-inset focus:ring-primary text-sm leading-6"
                          placeholder="Enter your password"
                        />
                      </div>
                    </div>

                    {mode === 'register' && (
                      <div className="space-y-1">
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-primary">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 z-10 text-primary">
                            <FiLock className="h-5 w-5 text-primary" />
                          </div>
                          <input
                            id="confirm-password"
                            name="confirm-password"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="block w-full rounded-lg border border-primary/50 bg-black/80 py-3 pl-11 pr-3 text-primary shadow-sm ring-1 ring-inset ring-primary/30 placeholder:text-primary/60 focus:ring-2 focus:ring-inset focus:ring-primary text-sm leading-6"
                            placeholder="Re-enter your password"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="flex items-start gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive-foreground">
                      <FiAlertCircle className="mt-0.5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {successMsg && (
                    <div className="flex items-start gap-2 rounded-2xl border border-primary/30 bg-primary/10 p-3 text-sm text-primary">
                      <span>✓ {successMsg}</span>
                    </div>
                  )}

                  <button
                    id={mode === 'login' ? 'login-submit' : 'register-submit'}
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center items-center gap-2 px-6 py-3 font-bold tracking-wider rounded-lg border-2 border-primary bg-transparent text-primary transition-all duration-300 relative overflow-hidden ${
                      isLoading
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-primary/10 hover:shadow-primary/50 hover:shadow-lg cursor-pointer'
                    }`}
                  >
                    <span className="relative z-20 flex items-center gap-2 pointer-events-none">
                      <FiLogIn />
                      {isLoading
                        ? mode === 'login' ? 'Exploiting...' : 'Registering...'
                        : mode === 'login' ? 'Hack the System' : 'Join the Arena'}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                  </button>

                  <div className="text-center text-xs text-muted-foreground">
                    By continuing, you agree to follow the hacker code of ethics.
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
