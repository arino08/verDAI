import { useUIStore } from '../hooks/useUIStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

// In-memory user store (demo only) simulating a simple credential map.
const memoryUsers: Record<string, { password: string }> = {};

export const AuthModal = () => {
  const { setAuthOpen, setUser } = useUIStore();
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [step, setStep] = useState<'credentials' | 'mfa'>('credentials');
  const [mfaCode, setMfaCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ if(step==='mfa' && sentCode==='') { const code = Math.floor(100000+Math.random()*900000).toString(); setSentCode(code); }}, [step, sentCode]);

  const handleCredSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setError(null);
    if(!email || !password) return;
    setLoading(true);
    setTimeout(()=> {
      if(mode==='signup') {
        memoryUsers[email] = { password };
        setStep('mfa');
      } else {
        const rec = memoryUsers[email];
        if(!rec || rec.password !== password) { setError('Invalid credentials'); setLoading(false); return; }
        setStep('mfa');
      }
      setLoading(false);
    }, 700);
  };

  const handleMfa = (e: React.FormEvent) => {
    e.preventDefault(); setError(null);
    if(mfaCode.trim() !== sentCode) { setError('Incorrect code'); return; }
    setLoading(true);
    setTimeout(()=> {
      setUser({ id: crypto.randomUUID(), email });
      setAuthOpen(false);
      setLoading(false);
    }, 500);
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }} onClick={() => setAuthOpen(false)}>
        <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ type: 'spring', stiffness: 120, damping: 16 }} style={{ width: '100%', maxWidth: 420, background: '#11161e', border: '1px solid #1d2632', borderRadius: 20, padding: '2rem 1.75rem 2.25rem', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
          <h2 style={{ margin: 0, fontSize: '1.85rem', background: 'linear-gradient(140deg,#fff,#93a3c7 40%,#5d6bff)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
            {step==='credentials' ? (mode === 'signup' ? 'Create account' : 'Welcome back') : 'Multi‑Factor'}
          </h2>
          <p style={{ margin: '0.5rem 0 1.4rem', fontSize: '0.85rem', lineHeight: 1.4, color: 'var(--text-dim)' }}>
            {step==='credentials' ? (
              <>Sign {mode === 'signup' ? 'up' : 'in'} to continue your analysis & claim daily quota.</>
            ) : (
              <>Enter the 6‑digit code we <span style={{ color: 'var(--accent)' }}>just generated</span> for this demo. (Hint: <code style={{ fontSize:'0.75rem' }}>{sentCode}</code>)</>
            )}
          </p>
          {step==='credentials' && (
            <form onSubmit={handleCredSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.7rem', letterSpacing: 1.3, textTransform: 'uppercase', color: '#6a7386' }}>Email
                <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" placeholder="you@domain.com" style={{ background: '#1a2029', border: '1px solid #242e3b', padding: '0.85rem 0.95rem', borderRadius: 12, fontSize: '0.9rem', color: 'var(--text)', outline: 'none' }} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.7rem', letterSpacing: 1.3, textTransform: 'uppercase', color: '#6a7386' }}>Password
                <div style={{ position:'relative' }}>
                  <input value={password} onChange={(e) => setPassword(e.target.value)} required type={showPwd? 'text':'password'} placeholder={mode==='signup' ? 'Choose a password' : 'Your password'} style={{ width:'100%', background: '#1a2029', border: '1px solid #242e3b', padding: '0.85rem 0.95rem', borderRadius: 12, fontSize: '0.9rem', color: 'var(--text)', outline: 'none' }} />
                  <button type="button" onClick={()=>setShowPwd(p=>!p)} style={{ position:'absolute', top:6, right:6, fontSize:'0.55rem', letterSpacing:1.5, textTransform:'uppercase', padding:'0.35rem 0.55rem', background:'#202833', border:'1px solid #2a3442', borderRadius:8 }}> {showPwd? 'Hide':'Show'} </button>
                </div>
              </label>
              {error && <div style={{ fontSize:'0.65rem', color:'var(--danger)', marginTop:4 }}>{error}</div>}
              <button disabled={loading} type="submit" className="gradient" style={{ marginTop: '0.2rem', justifyContent: 'center', opacity: loading?0.7:1 }}>{loading? 'Processing…' : (mode === 'signup' ? 'Create & Continue' : 'Login & Continue')}</button>
            </form>
          )}
          {step==='mfa' && (
            <form onSubmit={handleMfa} style={{ display:'flex', flexDirection:'column', gap:'0.9rem' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.7rem', letterSpacing: 1.3, textTransform: 'uppercase', color: '#6a7386' }}>Code
                <input value={mfaCode} onChange={(e)=> setMfaCode(e.target.value.replace(/\D/g,''))} required maxLength={6} pattern="[0-9]{6}" placeholder="123456" style={{ background: '#1a2029', border: '1px solid #242e3b', padding: '0.9rem 0.95rem', borderRadius: 12, fontSize: '1.05rem', letterSpacing: 4, textAlign:'center', fontFamily:'monospace', color: 'var(--text)', outline:'none' }} />
              </label>
              {error && <div style={{ fontSize:'0.65rem', color:'var(--danger)', marginTop:4 }}>{error}</div>}
              <button disabled={loading} type="submit" className="gradient" style={{ justifyContent:'center', opacity: loading?0.7:1 }}>{loading? 'Verifying…' : 'Verify & Finish'}</button>
              <div style={{ fontSize:'0.6rem', textAlign:'center', color:'#6b7484' }}>Demo hint: code shown above – rotates per open.</div>
              <button type="button" onClick={()=>{ setStep('credentials'); setMfaCode(''); setSentCode(''); }} style={{ background:'none', color:'var(--accent)', fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:1.5 }}>Back</button>
            </form>
          )}
          {step==='credentials' && (
            <div style={{ fontSize: '0.7rem', marginTop: '1rem', textAlign: 'center', color: '#6b7484' }}>
              {mode === 'signup' ? 'Have an account?' : 'New here?'} <button style={{ background: 'none', padding: 0, color: 'var(--accent)' }} onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}>{mode === 'signup' ? 'Login' : 'Create account'}</button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
