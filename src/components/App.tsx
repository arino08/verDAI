import { UploadPanel } from './UploadPanel';
import { AuthModal } from './AuthModal';
import { useUIStore } from '../hooks/useUIStore';
import { AnalysisDrawer } from './AnalysisDrawer';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useLayoutEffect, useRef } from 'react';

export const App = () => {
  const { authOpen, analysisItem } = useUIStore();
  const [view, setView] = useState<'home' | 'dashboard'>('home');
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Header onNavigate={setView} current={view} />
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative' }}>
        <FloatingGrid />
        {view === 'home' && <UploadPanel />}
        {view === 'dashboard' && <Dashboard />}
      </main>
      {authOpen && <AuthModal />}
      {analysisItem && <AnalysisDrawer />}
      <footer style={{ textAlign: 'center', padding: '1rem', fontSize: '0.75rem', opacity: 0.6 }}>
        © {new Date().getFullYear()} VeriDAI – Trust the Real.
      </footer>
    </div>
  );
};

import { useState } from 'react';

const Header = ({ onNavigate, current }: { onNavigate: (v: 'home' | 'dashboard') => void; current: string }) => {
  const { setAuthOpen } = useUIStore();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem' }}>
      <Logo />
      <div style={{ flex: 1 }} />
      <button
        onClick={() => setAuthOpen(true)}
        style={{
          transition: 'all 0.2s ease',
          transform: 'scale(1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.opacity = '0.9';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.opacity = '1';
        }}
      >
        Login / Signup
      </button>
      <button
        className="gradient"
        onClick={() => onNavigate(current === 'dashboard' ? 'home' : 'dashboard')}
        style={{
          transition: 'all 0.2s ease',
          transform: 'scale(1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.opacity = '0.9';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.opacity = '1';
        }}
      >
        {current === 'dashboard' ? 'Back' : 'Dashboard'}
      </button>
    </div>
  );
};

const Logo = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
    // periodic subtle glitch
    const glitch = () => {
      if (!ref.current) return;
      gsap.timeline()
        .to(ref.current, { skewX: 6, scaleX: 1.08, duration: 0.08, ease: 'power1.in' })
        .to(ref.current, { skewX: 0, scaleX: 1, duration: 0.25, ease: 'power3.out' });
    };
    const id = setInterval(() => glitch(), 6000 + Math.random() * 4000);
    return () => clearInterval(id);
  }, []);
  return (
    <div ref={ref} style={{ fontWeight: 600, fontSize: '1.25rem', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '0.55rem', position: 'relative' }}>
      <span style={{ background: 'linear-gradient(120deg,#4855ff,#7f5dff,#3ddc97)', WebkitBackgroundClip: 'text', color: 'transparent' }}>VeriDAI</span>
      <span style={{ fontSize: '0.6rem', letterSpacing: '2px', opacity: 0.75 }}>ALPHA</span>
    </div>
  );
};

const FloatingGrid = () => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '22px 22px', maskImage: 'radial-gradient(circle at center, black, transparent 70%)', opacity: 0.2 }} />
  </div>
);

import type { AnalysisItem } from '../hooks/useUIStore';

const Dashboard = () => {
  const { history, setAnalysisItem } = useUIStore();
  const total = history.length;
  const avgScore = total ? Math.round((history.reduce((a, b) => a + (b.score ?? 0), 0) / total) * 100) : 0;
  const recent = history.slice(0, 5);
  const issueCounts: Record<string, number> = {};
  history.forEach(h => h.issues?.forEach(i => { issueCounts[i.label] = (issueCounts[i.label] || 0) + 1; }));
  const topIssues = Object.entries(issueCounts).sort((a,b)=>b[1]-a[1]).slice(0,5);
  // Aggregate metric means
  const metricSums: Record<string, { sum: number; c: number }> = {};
  history.forEach(h => {
    if (h.metrics) Object.entries(h.metrics).forEach(([k,v]) => { metricSums[k] = metricSums[k] || { sum:0,c:0 }; metricSums[k].sum += v; metricSums[k].c += 1; });
  });
  const metricAverages = Object.entries(metricSums).map(([k,{sum,c}]) => ({ k, v: sum / c }));

  return (
    <div style={{ width: '100%', maxWidth: 1180, display: 'flex', flexDirection: 'column', gap: '1.6rem', position: 'relative' }}>
      <h1 style={{ margin: 0, fontSize: '2.2rem', background: 'linear-gradient(120deg,#fff,#9ca9c8 40%,#7f5dff)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Analysis Dashboard</h1>
      {total === 0 && <div style={{ opacity: 0.65, fontSize: '0.9rem' }}>No analyses yet. Upload media to begin.</div>}
      {total > 0 && (
        <div style={{ display: 'grid', gap: '1.2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))' }}>
          <StatCard label="Total Analyses" value={total} />
          <StatCard label="Avg Trust" value={avgScore} suffix="%" gradient="linear-gradient(90deg,#4855ff,#3ddc97)" />
          <StatCard label="Image %" value={Math.round((history.filter(h=>h.type==='image').length/total)*100)} suffix="%" />
          <StatCard label="Video %" value={Math.round((history.filter(h=>h.type==='video').length/total)*100)} suffix="%" />
        </div>
      )}
      {metricAverages.length > 0 && (
        <div style={{ background: 'rgba(17,21,29,0.6)', border: '1px solid #1f2733', borderRadius: 18, padding: '1.2rem 1.3rem', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SectionTitle>Metric Averages</SectionTitle>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {metricAverages.map(m => (
              <div key={m.k} style={{ width: 160 }}>
                <div style={{ fontSize: '0.6rem', letterSpacing: 1.5, textTransform: 'uppercase', color: '#6e7a8b', marginBottom: 6 }}>{m.k}</div>
                <div style={{ height: 6, borderRadius: 4, background: '#1a2129', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', inset: 0, width: `${Math.round(m.v*100)}%`, background: 'linear-gradient(90deg,#4855ff,#3ddc97)' }} />
                </div>
                <div style={{ fontSize: '0.65rem', marginTop: 4, color: '#8290a1' }}>{Math.round(m.v*100)}%</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {topIssues.length > 0 && (
        <div style={{ background: 'rgba(17,21,29,0.6)', border: '1px solid #1f2733', borderRadius: 18, padding: '1.2rem 1.3rem', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SectionTitle>Top Issues</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {topIssues.map(([label,count]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 500 }}>{label}</div>
                <div style={{ flex:1, height: 6, background:'#1a2129', borderRadius:4, position:'relative' }}>
                  <div style={{ position:'absolute', inset:0, width: `${(count/total)*100}%`, background:'linear-gradient(90deg,#ff4d67,#ffb347)', borderRadius:4 }} />
                </div>
                <div style={{ fontSize: '0.65rem', width: 30, textAlign:'right', color:'#93a2b4' }}>{count}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {recent.length > 0 && (
        <div style={{ background: 'rgba(17,21,29,0.6)', border: '1px solid #1f2733', borderRadius: 18, padding: '1.2rem 1.3rem', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <SectionTitle>Recent Analyses</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recent.map(r => (
              <button key={r.id} onClick={()=>setAnalysisItem(r)} style={{ textAlign:'left', background:'#121921', border:'1px solid #1f2733', padding:'0.75rem 0.85rem', borderRadius:12, display:'flex', gap:12, alignItems:'center', cursor:'pointer' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background:'linear-gradient(135deg,#1f2733,#141a22)', display:'grid', placeItems:'center', fontSize:'0.6rem', letterSpacing:1.5, textTransform:'uppercase', color:'#8896a7' }}>{r.type}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:'0.85rem', fontWeight:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{r.name}</div>
                  <div style={{ fontSize:'0.6rem', letterSpacing:1.5, textTransform:'uppercase', color:'#5d6bff', marginTop:4 }}>{new Date(r.createdAt).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}</div>
                </div>
                <div style={{ fontSize:'0.9rem', fontWeight:600, background:'linear-gradient(120deg,#4855ff,#3ddc97)', WebkitBackgroundClip:'text', color:'transparent' }}>{Math.round((r.score ?? 0)*100)}</div>
              </button>
            ))}
          </div>
        </div>
      )}
      {total > 0 && (
        <div style={{ background: 'rgba(17,21,29,0.6)', border: '1px solid #1f2733', borderRadius: 18, padding: '1.2rem 1.3rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <SectionTitle>Full History</SectionTitle>
          <div style={{ display: 'grid', gap: 8 }}>
            {history.map(h => <HistoryRow key={h.id} item={h} onOpen={()=>setAnalysisItem(h)} />)}
          </div>
        </div>
      )}
    </div>
  );
};

const SectionTitle = ({ children }: { children: any }) => (
  <div style={{ fontSize: '0.7rem', letterSpacing: 2, textTransform:'uppercase', color:'#6b7789' }}>{children}</div>
);

const StatCard = ({ label, value, suffix='', gradient }: { label: string; value: number; suffix?: string; gradient?: string }) => (
  <div style={{ background:'rgba(17,21,29,0.6)', border:'1px solid #1f2733', borderRadius:16, padding:'0.95rem 1rem', display:'flex', flexDirection:'column', gap:6 }}>
    <div style={{ fontSize:'0.55rem', letterSpacing:2, textTransform:'uppercase', color:'#6b7789' }}>{label}</div>
    <div style={{ fontSize:'1.3rem', fontWeight:600, background: gradient||'linear-gradient(120deg,#ffffff,#b7c1d6 50%,#5d6bff)', WebkitBackgroundClip:'text', color:'transparent' }}>{value}{suffix}</div>
  </div>
);

const HistoryRow = ({ item, onOpen }: { item: AnalysisItem; onOpen: () => void }) => (
  <div onClick={onOpen} style={{ background:'#11161d', border:'1px solid #1f2733', padding:'0.75rem 0.85rem', borderRadius:12, display:'flex', gap:14, alignItems:'center', cursor:'pointer', transition:'background .25s' }} onMouseEnter={(e)=> (e.currentTarget.style.background='#16202b')} onMouseLeave={(e)=> (e.currentTarget.style.background='#11161d')}>
    <div style={{ width:42, height:42, borderRadius:10, background:'linear-gradient(135deg,#1e2733,#141a22)', display:'grid', placeItems:'center', fontSize:'0.55rem', letterSpacing:1.5, textTransform:'uppercase', color:'#8593a5' }}>{item.type}</div>
    <div style={{ flex:1, minWidth:0 }}>
      <div style={{ fontSize:'0.8rem', fontWeight:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{item.name}</div>
      <div style={{ fontSize:'0.55rem', letterSpacing:1.5, textTransform:'uppercase', color:'#5d6bff', marginTop:4 }}>{new Date(item.createdAt).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}</div>
    </div>
    <div style={{ fontSize:'0.85rem', fontWeight:600, background:'linear-gradient(120deg,#4855ff,#3ddc97)', WebkitBackgroundClip:'text', color:'transparent' }}>{Math.round((item.score ?? 0)*100)}</div>
  </div>
);
