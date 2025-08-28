import { UploadPanel } from './UploadPanel';
import { ExtensionShowcase } from './ExtensionShowcase';
import { AuthModal } from './AuthModal';
import { useUIStore } from '../hooks/useUIStore';
import { AnalysisDrawer } from './AnalysisDrawer';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useLayoutEffect, useRef } from 'react';

export const App = () => {
  const { authOpen, analysisItem, secureMode } = useUIStore();
  const [view, setView] = useState<'home' | 'dashboard' | 'extension'>('home');
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }} className={secureMode ? 'theme-secure' : undefined}>
      <Header onNavigate={setView} current={view} />
      <main style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '2rem', position: 'relative' }}>
        <FloatingGrid />
        <div style={{ position: 'relative', width: '100%', maxWidth: 1280, overflow: 'hidden' }}>
          <motion.div
            style={{ display: 'flex', width: '200%', willChange: 'transform' }}
            animate={{ x: secureMode ? '-50%' : '0%' }}
            transition={{ type: 'spring', stiffness: 70, damping: 16 }}
          >
            <div style={{ width: '50%', paddingInline: 0, display: 'flex', justifyContent: 'center' }} aria-hidden={secureMode}>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                {view === 'home' && <UploadPanel />}
                {view === 'dashboard' && <Dashboard />}
                {view === 'extension' && <ExtensionShowcase />}
              </div>
            </div>
            <div style={{ width: '50%', paddingInline: 0, display: 'flex', justifyContent: 'center' }} aria-hidden={!secureMode}>
              <SecureBrowserMode />
            </div>
          </motion.div>
        </div>
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

const Header = ({ onNavigate, current }: { onNavigate: (v: 'home' | 'dashboard' | 'extension') => void; current: string }) => {
  const { setAuthOpen, secureMode, toggleSecureMode, user, setUser } = useUIStore();
  const [menuOpen, setMenuOpen] = useState(false);
  // Close user menu on outside click
  useLayoutEffect(() => {
    const handler = (e: MouseEvent) => {
      if(!(e.target as HTMLElement).closest('.user-menu')) setMenuOpen(false);
    }; document.addEventListener('mousedown', handler); return () => document.removeEventListener('mousedown', handler);
  }, []);
  return (
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem', padding: '0.85rem 1rem' }} className="stack-mobile">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: 200 }}>
        <Logo />
      </div>
      <div style={{ display: 'flex', gap: '0.6rem' }}>
        <button onClick={toggleSecureMode} style={{ background: secureMode ? 'linear-gradient(120deg,#ff4d67,#ffb347)' : undefined }}>
          {secureMode ? 'Exit Secure' : 'Secure Mode'}
        </button>
        <button
          onClick={() => onNavigate(current === 'extension' ? 'home' : 'extension')}
          style={{ transition: 'all 0.2s ease', transform: 'scale(1)' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.opacity = '0.9'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '1'; }}
        >
          {current === 'extension' ? 'Back' : 'Extension Demo'}
        </button>
        {!user && (
          <button
            onClick={() => setAuthOpen(true)}
            style={{ transition: 'all 0.2s ease', transform: 'scale(1)' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.opacity = '0.9'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '1'; }}
          >
            Login / Signup
          </button>
        )}
        {user && (
          <div className="user-menu" style={{ position: 'relative' }}>
            <button onClick={()=>setMenuOpen(o=>!o)} style={{ display:'flex', alignItems:'center', gap:8, background:'linear-gradient(145deg,#1d242d,#11161c)', border:'1px solid #2a3240' }}>
              <span style={{ width:26, height:26, borderRadius:'50%', background:'linear-gradient(135deg,#4855ff,#3ddc97)', display:'grid', placeItems:'center', fontSize:'0.65rem', fontWeight:600, letterSpacing:1, color:'#fff' }}>{user.email[0]?.toUpperCase()}</span>
              <span style={{ fontSize:'0.72rem', letterSpacing:1.2, textTransform:'uppercase', color:'#9aa7b7', maxWidth:120, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user.email}</span>
            </button>
            {menuOpen && (
              <div style={{ position:'absolute', top:'110%', right:0, background:'#11161d', border:'1px solid #1f2733', borderRadius:14, padding:'0.55rem 0.55rem', minWidth:180, display:'flex', flexDirection:'column', gap:6, boxShadow:'0 10px 28px -12px rgba(0,0,0,0.65),0 0 0 1px #1f2733', zIndex:30 }}>
                <div style={{ fontSize:'0.55rem', letterSpacing:2, textTransform:'uppercase', color:'#5d6bff', padding:'0.25rem 0.3rem 0.2rem' }}>Account</div>
                <button onClick={()=>{ setUser(null); setMenuOpen(false); }} style={{ background:'#1a2028', border:'1px solid #242e3b', padding:'0.55rem 0.75rem', borderRadius:10, fontSize:'0.7rem', letterSpacing:1.4, textTransform:'uppercase', textAlign:'left' }}>Logout</button>
              </div>
            )}
          </div>
        )}
        <button
          className="gradient"
          onClick={() => onNavigate(current === 'dashboard' ? 'home' : 'dashboard')}
          style={{ transition: 'all 0.2s ease', transform: 'scale(1)' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.opacity = '0.9'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '1'; }}
        >
          {current === 'dashboard' ? 'Back' : 'Dashboard'}
        </button>
      </div>
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

// Secure Browser Mode Placeholder
const SecureBrowserMode = () => {
  const { secureUrl, setSecureUrl } = useUIStore();
  const [url, setUrl] = useState(secureUrl);
  const [loadUrl, setLoadUrl] = useState(secureUrl);
  const [loading, setLoading] = useState(false);
  // Sync store changes when triggered externally
  if (secureUrl !== loadUrl) {
    setLoadUrl(secureUrl);
    if (secureUrl !== url) setUrl(secureUrl);
  }
  return (
    <div style={{ width: '100%', maxWidth: 1240, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      <h1 style={{ margin: 0, fontSize: '2rem', background: 'linear-gradient(110deg,#fff,#ffe7d2 40%,#ffb347)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Secure Container Browser</h1>
      <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--text-dim)' }}>Ephemeral isolated browsing surface. Sessions reset on exit. Network instrumentation & deepfake shield overlays would appear here in a full build.</p>
      <div className="secure-panel" style={{ borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 520, position: 'relative' }}>
  <form onSubmit={(e)=>{ e.preventDefault(); if(!url.trim()) return; let u=url.trim(); if(!/^https?:\/\//i.test(u)) u='https://' + u; setLoadUrl(u); setSecureUrl(u); setLoading(true); }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.6rem 0.75rem', background: '#1d252e', borderBottom: '1px solid #2c3642' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56', boxShadow: '0 0 6px -2px #ff5f56aa' }} />
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e', boxShadow: '0 0 6px -2px #ffbd2eaa' }} />
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f', boxShadow: '0 0 6px -2px #27c93faa' }} />
          </div>
          <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="Enter URL" spellCheck={false} style={{ flex:1, background:'#12181f', border:'1px solid #2c3642', borderRadius: 8, padding:'0.55rem 0.75rem', fontSize:'0.75rem', color:'#f1f5f9', fontFamily:'inherit' }} />
          <button type="submit" className="gradient" style={{ fontSize: '0.7rem', padding: '0.55rem 0.9rem' }}>Open</button>
        </form>
        <div style={{ position:'relative', flex:1, background:'#0b0f13', display:'flex', alignItems:'stretch', justifyContent:'center', overflow:'hidden' }}>
          <iframe title="secure-sandbox" src={loadUrl} sandbox="allow-same-origin allow-scripts allow-forms allow-pointer-lock allow-popups" style={{ flex:1, border:'none', background:'#0d1116' }} onLoad={()=>setLoading(false)} />
          {loading && (
            <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'rgba(10,14,18,0.72)', backdropFilter:'blur(6px)', gap:18 }}>
              <div style={{ width:48, height:48, borderRadius:'50%', background:'linear-gradient(120deg,#ffbd2e,#ff5f56)', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
                <div style={{ position:'absolute', inset:4, border:'3px solid rgba(255,255,255,0.2)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 1s linear infinite' }} />
              </div>
              <div style={{ fontSize:'0.75rem', letterSpacing:1.6, textTransform:'uppercase', color:'#ffb347' }}>Loading…</div>
            </div>
          )}
          <div style={{ position:'absolute', inset:0, pointerEvents:'none', mixBlendMode:'overlay', background:'repeating-linear-gradient(0deg,rgba(255,255,255,0.02) 0 2px, transparent 2px 4px)' }} />
        </div>
        <div style={{ padding:'0.6rem 0.85rem', display:'flex', gap:10, flexWrap:'wrap', background:'#161d24', borderTop:'1px solid #2a323d' }}>
          {['Filesystem Seal','Network Proxy','Script Guard','Media Shield','Memory Scrubber'].map(t => <span key={t} style={{ fontSize:'0.55rem', letterSpacing:1.6, textTransform:'uppercase', background:'#1c252f', border:'1px solid #2c3642', padding:'0.4rem 0.6rem', borderRadius: 8, color:'#ffb347' }}>{t}</span>)}
        </div>
        <div className="panel-soft-glow" />
      </div>
    </div>
  );
};

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
  <div style={{ display: 'grid', gap: '1.2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))' }} className="dashboard-grid">
          <StatCard label="Total Analyses" value={total} />
          <StatCard label="Avg Trust" value={avgScore} suffix="%" gradient="linear-gradient(90deg,#4855ff,#3ddc97)" />
          <StatCard label="Image %" value={Math.round((history.filter(h=>h.type==='image').length/total)*100)} suffix="%" />
          <StatCard label="Video %" value={Math.round((history.filter(h=>h.type==='video').length/total)*100)} suffix="%" />
        </div>
      )}
      {metricAverages.length > 0 && (
  <div style={{ background: 'rgba(17,21,29,0.6)', border: '1px solid #1f2733', borderRadius: 18, padding: '1.2rem 1.3rem', display: 'flex', flexDirection: 'column', gap: 16 }} className="history-full">
          <SectionTitle>Metric Averages</SectionTitle>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }} className="metric-wrap">
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
