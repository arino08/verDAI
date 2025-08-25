import { useUIStore } from '../hooks/useUIStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export const AuthModal = () => {
  const { setAuthOpen, setUser, user } = useUIStore();
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [email, setEmail] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // fake auth
    setTimeout(() => {
      setUser({ id: crypto.randomUUID(), email });
      setAuthOpen(false);
    }, 600);
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }} onClick={() => setAuthOpen(false)}>
        <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ type: 'spring', stiffness: 120, damping: 16 }} style={{ width: '100%', maxWidth: 420, background: '#11161e', border: '1px solid #1d2632', borderRadius: 20, padding: '2rem 1.75rem 2.25rem', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
          <h2 style={{ margin: 0, fontSize: '1.85rem', background: 'linear-gradient(140deg,#fff,#93a3c7 40%,#5d6bff)', WebkitBackgroundClip: 'text', color: 'transparent' }}>{mode === 'signup' ? 'Create account' : 'Welcome back'}</h2>
          <p style={{ margin: '0.5rem 0 1.4rem', fontSize: '0.85rem', lineHeight: 1.4, color: 'var(--text-dim)' }}>Sign {mode === 'signup' ? 'up' : 'in'} to continue your analysis & claim daily quota.</p>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.75rem', letterSpacing: 1.3, textTransform: 'uppercase', color: '#6a7386' }}>Email
              <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" placeholder="you@domain.com" style={{ background: '#1a2029', border: '1px solid #242e3b', padding: '0.85rem 0.95rem', borderRadius: 12, fontSize: '0.9rem', color: 'var(--text)', outline: 'none', boxShadow: '0 0 0 0 rgba(93,107,255,0)' }} />
            </label>
            <button type="submit" className="gradient" style={{ marginTop: '0.4rem', justifyContent: 'center' }}>{mode === 'signup' ? 'Create & Continue' : 'Login & Continue'}</button>
          </form>
          <div style={{ fontSize: '0.7rem', marginTop: '1rem', textAlign: 'center', color: '#6b7484' }}>
            {mode === 'signup' ? 'Have an account?' : "New here?"} <button style={{ background: 'none', padding: 0, color: 'var(--accent)' }} onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}>{mode === 'signup' ? 'Login' : 'Create account'}</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
