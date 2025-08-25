import { useUIStore } from '../hooks/useUIStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

export const AnalysisDrawer = () => {
  const { analysisItem, setAnalysisItem, user } = useUIStore();
  useEffect(() => {
    if (!analysisItem) return;
  }, [analysisItem]);

  if (!analysisItem) return null;
  const { status, score, name, type, metrics, issues } = analysisItem;
  const loading = status !== 'done' && status !== 'error';

  return (
    <AnimatePresence>
      <motion.div initial={{ x: 420 }} animate={{ x: 0 }} exit={{ x: 420 }} transition={{ type: 'spring', stiffness: 120, damping: 18 }} style={{ position: 'fixed', top: 0, right: 0, height: '100%', width: 380, background: '#10151c', borderLeft: '1px solid #1d2531', display: 'flex', flexDirection: 'column', zIndex: 40, boxShadow: '-8px 0 22px -10px rgba(0,0,0,0.4)' }}>
        <div style={{ padding: '1rem 1.1rem', borderBottom: '1px solid #1c242f', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#6a7385', display: 'flex', alignItems: 'center' }}>
          Analysis
          <div style={{ marginLeft: 'auto' }}>
            <button style={{ fontSize: '0.6rem', padding: '0.4rem 0.6rem', background: '#181e25' }} onClick={() => setAnalysisItem(null)}>Close</button>
          </div>
        </div>
        <div style={{ padding: '1.2rem 1.3rem', display: 'flex', flexDirection: 'column', gap: '1.1rem', overflowY: 'auto' }}>
          <div>
            <div style={{ fontSize: '0.7rem', letterSpacing: 1.5, textTransform: 'uppercase', color: '#657083', marginBottom: 6 }}>File</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>{name}</div>
            <div style={{ fontSize: '0.6rem', letterSpacing: 2, textTransform: 'uppercase', color: '#566173', marginTop: 4 }}>{type}</div>
          </div>

          {loading && <Loader />}

          {!loading && status === 'done' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.3rem' }}>
              <div>
                <div style={{ fontSize: '0.7rem', letterSpacing: 1.5, textTransform: 'uppercase', color: '#657083', marginBottom: 8 }}>Trust Score</div>
                <ScoreBadge score={score ?? 0} />
                <p style={{ fontSize: '0.7rem', lineHeight: 1.5, color: '#748192', marginTop: '0.9rem' }}>Higher scores mean the media is more likely authentic. Model considers multi-factor cues.</p>
              </div>
              {metrics && <MetricsRadar metrics={metrics} />}
              {issues && issues.length > 0 && <IssueList issues={issues} />}
            </div>
          )}
        </div>
        {!user && (
          <div style={{ marginTop: 'auto', padding: '1rem 1.2rem', background: '#0b0f14', borderTop: '1px solid #1c242f', fontSize: '0.7rem', color: '#6b7484' }}>
            Create an account to save history & export reports.
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

const Loader = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 6 }}>
    <div style={{ height: 8, background: 'linear-gradient(90deg,#1a2028,#223042)', borderRadius: 8, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, #4855ff66, transparent)', animation: 'shimmer 1.4s infinite' }} />
    </div>
    <div style={{ height: 8, background: 'linear-gradient(90deg,#1a2028,#223042)', borderRadius: 8, position: 'relative', overflow: 'hidden', width: '80%' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, #5d6bff66, transparent)', animation: 'shimmer 1.5s infinite' }} />
    </div>
    <style>{`@keyframes shimmer { 0% { transform: translateX(-100%);} 100% { transform: translateX(100%);} }`}</style>
  </div>
);

const ScoreBadge = ({ score }: { score: number }) => {
  const pct = Math.round(score * 100);
  const hue = 40 + (pct * 0.9); // shift towards green for higher scores
  const ringRef = useRef<HTMLDivElement | null>(null);
  const numRef = useRef<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    if (ringRef.current && numRef.current) {
      gsap.fromTo(ringRef.current, { rotate: -90, opacity: 0 }, { rotate: 0, opacity: 1, duration: 0.9, ease: 'power3.out' });
      gsap.fromTo(numRef.current, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.8)', delay: 0.15 });
    }
  }, [pct]);
  return (
    <div ref={ringRef} style={{ background: 'conic-gradient(from 0deg, hsl('+hue+' 80% 55%) '+pct+'%, #1a222d '+pct+'%)', padding: 6, borderRadius: 18, width: 120, height: 120, display: 'grid', placeItems: 'center', position: 'relative' }}>
      <div ref={numRef} style={{ position: 'absolute', inset: 4, background: '#0d1218', borderRadius: 16, display: 'grid', placeItems: 'center', fontSize: '1.6rem', fontWeight: 600, letterSpacing: -1, color: 'hsl('+hue+' 80% 60%)' }}>{pct}</div>
    </div>
  );
};

const MetricsRadar = ({ metrics }: { metrics: Record<string, number> }) => {
  const entries = Object.entries(metrics);
  if (!entries.length) return null;
  const size = 180;
  const radius = 70;
  const center = size / 2;
  const angleStep = (Math.PI * 2) / entries.length;
  const points = entries.map(([_, v], i) => {
    const a = i * angleStep - Math.PI / 2;
    const r = radius * v;
    const x = center + r * Math.cos(a);
    const y = center + r * Math.sin(a);
    return `${x},${y}`;
  }).join(' ');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontSize: '0.7rem', letterSpacing: 1.5, textTransform: 'uppercase', color: '#657083' }}>Metric Radar</div>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size}>
          {[0.25,0.5,0.75,1].map(level => (
            <circle key={level} cx={center} cy={center} r={radius*level} fill="none" stroke="#1d2531" strokeDasharray="4 6" />
          ))}
          {entries.map(([k,_v], i) => {
            const a = i * angleStep - Math.PI/2;
            const x = center + (radius + 10) * Math.cos(a);
            const y = center + (radius + 10) * Math.sin(a);
            return <text key={k} x={x} y={y} fontSize={10} textAnchor="middle" fill="#6f7d91" style={{ fontFamily:'var(--font-sans)' }}>{k}</text>;
          })}
          <polygon points={points} fill="url(#gradRadar)" stroke="#5d6bff" strokeWidth={1} strokeLinejoin="round" />
          <defs>
            <linearGradient id="gradRadar" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4855ff55" />
              <stop offset="100%" stopColor="#3ddc9755" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

interface Issue { id: string; label: string; severity: number; description: string; suggestion?: string }
const IssueList = ({ issues }: { issues: Issue[] }) => (
  <div>
    <div style={{ fontSize: '0.7rem', letterSpacing: 1.5, textTransform: 'uppercase', color: '#657083', marginBottom: 8 }}>Detected Issues</div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {issues.map(is => (
        <div key={is.id} style={{ background: '#111921', border: '1px solid #1d2731', borderRadius: 10, padding: '0.7rem 0.8rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: 0.5 }}>{is.label}</span>
            <span style={{ fontSize: '0.55rem', letterSpacing: 1.5, textTransform: 'uppercase', background: 'linear-gradient(90deg,#ff6b6b,#ffb347)', WebkitBackgroundClip: 'text', color: 'transparent' }}>sev {Math.round(is.severity*100)}</span>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 54, height: 6, background: '#1d2530', borderRadius: 4, position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, width: `${Math.min(100, Math.round(is.severity*100))}%`, background: 'linear-gradient(90deg,#ff4d67,#ffb347)', borderRadius: 4 }} />
              </div>
            </div>
          </div>
          <div style={{ fontSize: '0.6rem', lineHeight: 1.4, color: '#7d8a99' }}>{is.description}</div>
          {is.suggestion && <div style={{ fontSize: '0.55rem', lineHeight: 1.4, color: '#5d6bff' }}>Suggestion: {is.suggestion}</div>}
        </div>
      ))}
    </div>
  </div>
);
