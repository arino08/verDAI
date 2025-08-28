import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { useUIStore } from '../hooks/useUIStore';
import { fakeAnalyse } from '../lib/fakeAnalyse';

// Small base64 placeholders (blurred) to avoid external fetch reliance.
type Sample = { id:string; type:'image'; title:string; src:string } | { id:string; type:'link'; title:string; href:string };
const samples: Sample[] = [
  { id:'s1', type:'image', title:'Portrait', src:'https://i.pinimg.com/736x/15/db/f7/15dbf7122f7a30223b21297292771623.jpg' },
  { id:'s2', type:'image', title:'Landscape', src:'https://i.pinimg.com/736x/a0/19/de/a019deabdb2b9791ecab19ca9f4f81ba.jpg' },
  { id:'s3', type:'link', title:'Security Blog', href:'https://example.com' },
  { id:'s4', type:'link', title:'AI News', href:'https://wikipedia.org' }
];

export const ExtensionShowcase = () => {
  const { setAnalysisItem, addHistory, decrementQuota, dailyRemaining, user, setAuthOpen, toggleSecureMode, secureMode, setSecureUrl, setSecureMode } = useUIStore();
  const [menu, setMenu] = useState<null | { x:number; y:number; target: any; kind:'image'|'link'; meta:any }>(null);
  const containerRef = useRef<HTMLDivElement|null>(null);

  // Close menu on click elsewhere / escape
  useEffect(() => {
    const onDown = (e:MouseEvent) => { if(menu && containerRef.current && !containerRef.current.contains(e.target as Node)) setMenu(null); };
    const onEsc = (e:KeyboardEvent) => { if(e.key==='Escape') setMenu(null); };
    window.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onEsc);
    return () => { window.removeEventListener('mousedown', onDown); window.removeEventListener('keydown', onEsc); };
  }, [menu]);

  const runImageAnalysis = async (src:string) => {
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      const f = new File([blob], 'context-image'+(blob.type.includes('png')?'.png':'.jpg'), { type: blob.type||'image/png' });
      // Allow first upload even if not authed (same pattern as upload panel)
      if(!user) {
  const temp = { id: crypto.randomUUID(), name: f.name, status: 'processing' as const, type: 'image' as const, createdAt: Date.now() };
        setAnalysisItem(temp);
        setTimeout(()=> setAuthOpen(true), 500);
        return;
      }
      if (dailyRemaining <= 0) { alert('Daily limit reached.'); return; }
      const item = { id: crypto.randomUUID(), name: f.name, status:'pending' as const, type:'image' as const, createdAt: Date.now() };
      setAnalysisItem(item);
      decrementQuota();
      const result = await fakeAnalyse('image');
      const doneItem = { ...item, status:'done' as const, score: result.score, metrics: result.metrics, issues: result.issues };
      setAnalysisItem(doneItem); addHistory(doneItem);
    } catch (e) { console.error(e); }
  };

  const openLinkSecure = (href:string) => {
    if(!/^https?:\/\//i.test(href)) href = 'https://' + href;
    setSecureUrl(href); setSecureMode(true); if(!secureMode) toggleSecureMode();
  };

  const onContext = (e: React.MouseEvent, item:any) => {
    e.preventDefault();
    const BASE_W = 220;
    // approximate height depending on kind (image gets 3 actions, link gets 2) + padding
    const kind = item.type==='image' ? 'image' : 'link';
    const actions = kind==='image' ? 3 : 2; // number of menu rows
    const rowH = 42; // approximate row height incl margins
    const BASE_H = actions * rowH + 16; // include padding
    let x = e.clientX;
    let y = e.clientY;
    const pad = 12;
    if (x + BASE_W + pad > window.innerWidth) x = window.innerWidth - BASE_W - pad;
    if (y + BASE_H + pad > window.innerHeight) y = window.innerHeight - BASE_H - pad;
    if (x < pad) x = pad;
    if (y < pad) y = pad;
    if(kind==='image') setMenu({ x, y, target:item, kind:'image', meta:item });
    else setMenu({ x, y, target:item, kind:'link', meta:item });
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.4rem', width:'100%', maxWidth:1080 }} ref={containerRef}>
      <h1 style={{ margin:0, fontSize:'2.1rem', background:'linear-gradient(120deg,#ffffff,#b7c1d6 45%,#5d6bff)', WebkitBackgroundClip:'text', color:'transparent' }}>Extension Workflow Demo</h1>
      <p style={{ margin:0, fontSize:'0.9rem', lineHeight:1.5, color:'var(--text-dim)' }}>Right‑click (or long‑press on mobile) any sample image or link below to open the simulated extension context menu. This showcases how the browser extension enables instant deepfake analysis and one‑click secure container browsing for arbitrary web content.</p>
      <div style={{ display:'grid', gap:'1.1rem', gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))' }}>
        {samples.map(s => s.type==='image' ? (
          <div key={s.id} onContextMenu={(e)=>onContext(e,s)} style={{ position:'relative', background:'#131a22', border:'1px solid #1f2733', padding:10, borderRadius:16, cursor:'context-menu', display:'flex', flexDirection:'column', gap:8 }}>
            <img src={s.src} alt={s.title} style={{ width:'100%', aspectRatio:'4/3', objectFit:'cover', borderRadius:12, filter:'contrast(1.05) saturate(1.05)' }} />
            <div style={{ fontSize:'0.75rem', letterSpacing:1.5, textTransform:'uppercase', color:'#6b7789' }}>{s.title}</div>
          </div>
        ) : (
          <a key={s.id} href={s.href} onClick={(e)=>{ e.preventDefault(); openLinkSecure(s.href); }} onContextMenu={(e)=>onContext(e,s)} style={{ position:'relative', background:'#131a22', border:'1px solid #1f2733', padding:'1.1rem 1rem', borderRadius:16, cursor:'context-menu', display:'flex', flexDirection:'column', gap:10, textDecoration:'none' }}>
            <div style={{ fontSize:'0.85rem', fontWeight:600, color:'#d9e2ec' }}>{s.title}</div>
            <div style={{ fontSize:'0.6rem', letterSpacing:1.6, textTransform:'uppercase', color:'#5d6bff' }}>{s.href?.replace(/https?:\/\//,'')}</div>
            <div style={{ position:'absolute', inset:0, pointerEvents:'none', background:'radial-gradient(circle at 30% 20%,rgba(93,107,255,0.18),transparent 70%)', opacity:0.2 }} />
          </a>
        ))}
      </div>
      <div style={{ background:'rgba(17,21,29,0.6)', border:'1px solid #1f2733', borderRadius:18, padding:'1.2rem 1.3rem', display:'flex', flexDirection:'column', gap:14 }}>
        <div style={{ fontSize:'0.7rem', letterSpacing:2, textTransform:'uppercase', color:'#6b7789' }}>How It Works</div>
        <ul style={{ margin:0, padding:'0 1.1rem', fontSize:'0.8rem', lineHeight:1.55, color:'#93a2b4', display:'flex', flexDirection:'column', gap:6 }}>
          <li>Browser extension injects a context‑menu entry for images & links.</li>
          <li>Select <strong>Analyse with VeriDAI</strong> to stream the media to our detection pipeline.</li>
          <li>Select <strong>Open in Secure Container</strong> to spawn an isolated browsing session with network & script guards.</li>
          <li>Results surface instantly inside the web page and sync to your dashboard history.</li>
        </ul>
      </div>
      {menu && <ContextMenu {...menu} onClose={()=>setMenu(null)} onAnalyse={(src)=>{ runImageAnalysis(src); setMenu(null); }} onSecure={(href)=>{ openLinkSecure(href); setMenu(null); }} />}
    </div>
  );
};

const ContextMenu = ({ x,y,kind, meta, onClose, onAnalyse, onSecure }:{ x:number; y:number; kind:'image'|'link'; meta:any; onClose:()=>void; onAnalyse:(src:string)=>void; onSecure:(href:string)=>void }) => {
  const ref = useRef<HTMLDivElement|null>(null);
  const [pos,setPos] = useState({ x, y });
  // Reset when new anchor supplied
  useEffect(()=> { setPos({ x, y }); }, [x,y]);
  useLayoutEffect(()=> {
    const el = ref.current; if(!el) return;
    const r = el.getBoundingClientRect();
    const pad = 12;
    let nx = pos.x; let ny = pos.y;
    if (nx + r.width + pad > window.innerWidth) nx = window.innerWidth - r.width - pad;
    if (ny + r.height + pad > window.innerHeight) ny = window.innerHeight - r.height - pad;
    if (nx < pad) nx = pad; if (ny < pad) ny = pad;
    if (nx !== pos.x || ny !== pos.y) setPos({ x: nx, y: ny });
  }, [pos]);
  const style: React.CSSProperties = { position:'fixed', top:pos.y, left:pos.x, zIndex:4000, width:220, background:'linear-gradient(145deg,#1a2129,#0f141a)', border:'1px solid #27303b', borderRadius:14, boxShadow:'0 10px 28px -12px rgba(0,0,0,0.6),0 0 0 1px #1f2733', padding:'0.4rem', backdropFilter:'blur(12px) saturate(140%)', WebkitBackdropFilter:'blur(12px) saturate(140%)', animation:'fadeInMenu .18s ease' };
  const itemStyle: React.CSSProperties = { border:'1px solid #25313c', background:'#141b22', padding:'0.55rem 0.6rem', borderRadius:10, fontSize:'0.72rem', letterSpacing:1.4, textTransform:'uppercase', display:'flex', alignItems:'center', gap:10, cursor:'pointer', color:'#ccd5e0', userSelect:'none' };
  return (
    <div ref={ref} style={style} onClick={(e)=> e.stopPropagation()}>
      {kind==='image' && <div onClick={()=>onAnalyse(meta.src)} style={itemStyle} onMouseEnter={e=>e.currentTarget.style.background='#1d2731'} onMouseLeave={e=>e.currentTarget.style.background='#141b22'}>🔍 Analyse Image</div>}
      {kind==='link' && <div onClick={()=>onSecure(meta.href)} style={itemStyle} onMouseEnter={e=>e.currentTarget.style.background='#1d2731'} onMouseLeave={e=>e.currentTarget.style.background='#141b22'}>🛡️ Open Link Secure</div>}
      {kind==='image' && <div onClick={()=>onSecure('https://example.com')} style={{ ...itemStyle, marginTop:6 }} onMouseEnter={e=>e.currentTarget.style.background='#1d2731'} onMouseLeave={e=>e.currentTarget.style.background='#141b22'}>🛡️ Open Sample Secure</div>}
      <div onClick={onClose} style={{ ...itemStyle, marginTop:8, background:'#1c232d', color:'#ff4d67', borderColor:'#2d3742' }} onMouseEnter={e=>e.currentTarget.style.background='#262f3a'} onMouseLeave={e=>e.currentTarget.style.background='#1c232d'}>Close</div>
    </div>
  );
};
