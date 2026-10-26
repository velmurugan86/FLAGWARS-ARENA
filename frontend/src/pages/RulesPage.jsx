import { FiShield, FiFlag, FiAward, FiAlertTriangle } from 'react-icons/fi';

export default function RulesPage() {
  const rulesOfEngagement = [
    {
      id: '01',
      title: 'Infrastructure Integrity',
      desc: 'Do not attempt Denial of Service (DoS/DDoS), flooding, or stress testing against the platform backend, API servers, or database infrastructure. Confine all testing strictly to the designated target payloads.',
    },
    {
      id: '02',
      title: 'Anti-Bruteforce Policy',
      desc: 'Automated brute-forcing of flags, usernames, or passwords is prohibited and enforced via server-side rate limiters. Submitting more than 10 flags per minute triggers an automatic cooldown.',
    },
    {
      id: '03',
      title: 'Fair Play & Independent Solving',
      desc: 'All challenges are designed to test individual and team problem solving. Do not share, publish, or trade flags or solution walkthroughs while an active competition session is underway.',
    },
    {
      id: '04',
      title: 'Flag Integrity & Format',
      desc: 'Every flag follows the strict wrapper FWA{...}. Submissions are case-sensitive and must be submitted through the authenticated challenge modal without leading or trailing whitespace.',
    },
    {
      id: '05',
      title: 'Ethical Conduct',
      desc: 'Tools and methodologies practiced within this proving ground are intended solely for ethical security education, vulnerability mitigation, and skill assessment.',
    },
  ];

  return (
    <div className="min-h-screen pt-4 relative">
      <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Page Header */}
        <div className="flex flex-col gap-3 pb-8 border-b border-primary/20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold">
              OPERATIONAL BRIEFING // PROTOCOL DIRECTIVE
            </span>
          </div>
          <h1
            className="text-3xl sm:text-4xl font-extrabold tracking-tight"
            style={{ fontFamily: 'Orbitron, monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}
          >
            <span className="text-primary">ARENA</span>
            <span className="text-accent ml-2">RULES & INTEL</span>
          </h1>
          <p className="text-sm sm:text-base text-primary/80 terminal-text max-w-3xl">
            Welcome, Operative. Review the operational parameters, flag formatting specifications, scoring tiers, and anti-abuse safeguards prior to entering the arena.
          </p>
        </div>

        {/* Flag Format, Scoring & Brute-Force Guard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
          <div className="p-6 rounded-2xl border border-primary/40 bg-black/60 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-3 text-primary">
              <FiFlag className="w-5 h-5" />
              <h2 className="text-sm font-bold tracking-wider font-mono uppercase">Standard Flag Wrapper</h2>
            </div>
            <div className="p-3 rounded-xl bg-black border border-primary/30 font-mono text-sm text-accent break-all text-center">
              FWA&#123;sample_flag_content&#125;
            </div>
            <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
              Every flag begins with <span className="text-primary font-mono font-bold">FWA&#123;</span> and terminates with <span className="text-primary font-mono font-bold">&#125;</span>. Submissions are case-sensitive and verified cryptographically.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-primary/40 bg-black/60 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-3 text-accent">
              <FiAward className="w-5 h-5" />
              <h2 className="text-sm font-bold tracking-wider font-mono uppercase">Scoring Structure</h2>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-muted-foreground">Easy Tier</span>
                <span className="text-primary font-bold">100 PTS</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-muted-foreground">Medium Tier</span>
                <span className="text-accent font-bold">200 PTS</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Hard Tier</span>
                <span className="text-red-400 font-bold">300 PTS</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-primary/40 bg-black/60 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-3 text-red-400">
              <FiAlertTriangle className="w-5 h-5" />
              <h2 className="text-sm font-bold tracking-wider font-mono uppercase">Brute-Force Guard</h2>
            </div>
            <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
              <p>
                Strict rate limiting monitors all submission endpoints.
              </p>
              <div className="p-2 rounded-lg bg-red-950/20 border border-red-500/30 text-red-300 font-mono text-xs">
                Threshold: Max 10 submissions / min
              </div>
              <p>
                Exceeding the threshold triggers an automated IP throttle cooldown.
              </p>
            </div>
          </div>
        </div>

        {/* Rules of Engagement */}
        <div className="my-10">
          <div className="flex items-center gap-2 mb-6">
            <FiShield className="w-5 h-5 text-primary" />
            <h2
              className="text-xl sm:text-2xl font-bold tracking-wide"
              style={{ fontFamily: 'Orbitron, monospace', textTransform: 'uppercase' }}
            >
              <span className="text-primary">RULES OF</span>
              <span className="text-accent ml-2">ENGAGEMENT</span>
            </h2>
          </div>

          <div className="space-y-4">
            {rulesOfEngagement.map((rule) => (
              <div
                key={rule.id}
                className="p-5 rounded-2xl border border-primary/20 bg-black/50 backdrop-blur-sm flex flex-col sm:flex-row sm:items-start gap-4 hover:border-primary/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl border border-primary/40 bg-primary/10 flex items-center justify-center font-mono font-bold text-primary shrink-0">
                  {rule.id}
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base font-bold text-foreground font-mono">
                    {rule.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {rule.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
