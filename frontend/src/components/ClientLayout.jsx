import { useMemo, useState, useEffect } from 'react';
import NavBar from './NavBar';

const systemAlerts = [
  { text: '[WARN] PACKET INTRUSION ON PORT 443', type: 'warn' },
  { text: '[SYS_ERR] MEMORY OVERFLOW AT 0x7FFF802', type: 'error' },
  { text: '[ALERT] ZERO-DAY PAYLOAD INTERCEPTED', type: 'error' },
  { text: '[KERNEL] SEGFAULT IN MODULE net_filter.c', type: 'error' },
  { text: '[CRITICAL] BRUTEFORCE DETECTED (SUBNET 10.0.4.0/24)', type: 'error' },
  { text: '[WARN] ASLR BYPASS ATTEMPT MITIGATED', type: 'warn' },
  { text: '[SECURITY] ROOT PRIVILEGE ESCALATION BLOCKED', type: 'warn' },
  { text: '[NOTICE] SHELLCODE SIGNATURE QUARANTINED', type: 'info' },
  { text: '[SYS] TLS CERTIFICATE FINGERPRINT MISMATCH', type: 'warn' },
  { text: '[ALERT] REVERSE TCP TUNNEL DETECTED', type: 'error' },
  { text: '[WARN] HEAP CHUNK METADATA INVALIDATED', type: 'warn' },
  { text: '[ERROR] BUFFER OVERRUN IN DAEMON_PROCESS', type: 'error' },
  { text: '[CRITICAL] SQL INJECTION VECTOR BLOCKED', type: 'error' },
  { text: '[STATUS] NETWORK SOCKET FLOODING ISOLATED', type: 'info' },
  { text: '[NOTICE] DUMP FILE WRITTEN: core.dump.009', type: 'info' },
  { text: '[ALERT] SYSTEM WATCHDOG TIMER TRIGGERED', type: 'warn' },
  { text: '[WARN] DNS EXFILTRATION SUSPECTED', type: 'warn' },
  { text: '[ERROR] CRYPTOGRAPHIC SIGNATURE REJECTED', type: 'error' },
  { text: '[CRITICAL] ILLEGAL INSTRUCTION EXCEPTION 0x0041', type: 'error' },
  { text: '[SYS_WARN] HIGH ENTROPY BINARY DETECTED', type: 'warn' },
];

export default function ClientLayout({ children }) {
  const [activeAlerts, setActiveAlerts] = useState([]);

  const stars = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        top: `${(i * 37 + 11) % 100}%`,
        left: `${(i * 53 + 7) % 100}%`,
        duration: `${((i * 1.3 + 2) % 4) + 2}s`,
        opacity: ((i * 0.07 + 0.2) % 0.8) + 0.2,
      })),
    []
  );

  useEffect(() => {
    const spawnAlert = () => {
      const alertItem = systemAlerts[Math.floor(Math.random() * systemAlerts.length)];
      const id = Date.now() + Math.random();
      const x = Math.random() * 70 + 5;
      const y = Math.random() * 80 + 10;

      setActiveAlerts((prev) => [
        ...prev.slice(-6),
        {
          id,
          text: alertItem.text,
          type: alertItem.type,
          x,
          y,
        },
      ]);

      setTimeout(() => {
        setActiveAlerts((prev) => prev.filter((a) => a.id !== id));
      }, 3500);
    };

    spawnAlert();
    const interval = setInterval(spawnAlert, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="fixed inset-0 -z-20 bg-black" />

      <div
        className="fixed inset-0 -z-10 pointer-events-none opacity-20"
        style={{
          background: `
            radial-gradient(circle at 15% 20%, hsl(120 100% 50% / 0.15) 0%, transparent 40%),
            radial-gradient(circle at 85% 75%, hsl(0 100% 60% / 0.15) 0%, transparent 45%),
            radial-gradient(circle at 50% 50%, hsl(200 100% 60% / 0.05) 0%, transparent 60%)
          `,
        }}
      />

      {stars.map((s) => (
        <div
          key={s.id}
          className="fixed w-1 h-1 bg-white rounded-full pointer-events-none -z-10"
          style={{
            top: s.top,
            left: s.left,
            animation: `pulse ${s.duration} infinite alternate`,
            opacity: s.opacity,
          }}
        />
      ))}

      {activeAlerts.map((alert) => {
        const colorClass =
          alert.type === 'error'
            ? 'text-accent border-accent/40 bg-accent/5 shadow-[0_0_15px_rgba(255,0,0,0.3)]'
            : alert.type === 'warn'
            ? 'text-amber-400 border-amber-400/40 bg-amber-400/5 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
            : 'text-primary border-primary/40 bg-primary/5 shadow-[0_0_15px_rgba(0,255,0,0.3)]';

        return (
          <div
            key={alert.id}
            className={`fixed -z-10 pointer-events-none font-mono text-[11px] sm:text-xs font-bold px-3 py-1 rounded-lg border backdrop-blur-sm select-none ${colorClass}`}
            style={{
              left: `${alert.x}%`,
              top: `${alert.y}%`,
              animation: 'fadeInOut 3.5s ease-out forwards',
            }}
          >
            {alert.text}
          </div>
        );
      })}

      <NavBar />
      <main className="min-h-screen pt-20">
        <div className="w-full mx-auto px-4 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </>
  );
}
