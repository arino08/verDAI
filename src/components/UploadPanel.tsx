import { useCallback, useRef, useState, useLayoutEffect } from 'react';
import { useUIStore } from '../hooks/useUIStore';
import { motion, AnimatePresence } from 'framer-motion';
import { fakeAnalyse } from '../lib/fakeAnalyse';
import gsap from 'gsap';
import { useGSAPDeepfakeFX } from '../hooks/useGSAPDeepfakeFX';

export const UploadPanel = () => {
  const { user, setAuthOpen, setAnalysisItem, addHistory, decrementQuota, dailyRemaining, referralCredits } = useUIStore();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onFiles = useCallback(async (files: FileList | null) => {
    if (!files || !files.length) return;
  const f = files[0];
  const type: 'image' | 'video' = f.type.startsWith('video') ? 'video' : 'image';
    if (!user) {
      // allow first upload then prompt auth after storing temp item
      setUploading(true);
      const temp = { id: crypto.randomUUID(), name: f.name, status: 'processing' as const, type, createdAt: Date.now() };
      setAnalysisItem(temp);
      setTimeout(() => setAuthOpen(true), 600);
      setUploading(false);
      return;
    }
    // enforce quota
    if (dailyRemaining <= 0) {
      alert('Daily limit reached. Refer friends to earn more analyses.');
      return;
    }
    setUploading(true);
    const item = { id: crypto.randomUUID(), name: f.name, status: 'pending' as const, type, createdAt: Date.now() };
    setAnalysisItem(item);
    decrementQuota();
    const result = await fakeAnalyse(type);
  const doneItem = { ...item, status: 'done' as const, score: result.score, metrics: result.metrics, issues: result.issues };
    setAnalysisItem(doneItem);
    addHistory(doneItem);
    setUploading(false);
  }, [user, setAuthOpen, setAnalysisItem, addHistory, decrementQuota, dailyRemaining]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    onFiles(e.dataTransfer.files);
  };

  const panelRef = useGSAPDeepfakeFX();
  const dropRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (dropRef.current) {
      gsap.from(dropRef.current, { y: 26, opacity: 0.5, scale: 0.94, duration: 0.65, ease: 'power3.out', delay: 0.15 });
    }
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: 680 }} ref={panelRef}>
      <AnimatePresence mode="wait">
  <motion.div key="panel" initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5, ease: 'easeOut' }} style={{
          background: 'linear-gradient(165deg, rgba(25,32,44,0.92) 0%, rgba(13,17,23,0.9) 60%)',
          backdropFilter: 'blur(18px) saturate(130%)',
          WebkitBackdropFilter: 'blur(18px) saturate(130%)',
          border: '1px solid rgba(120,140,170,0.10)',
          padding: '2.35rem 2.1rem 2.6rem',
          borderRadius: 28,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 40px -18px #000, 0 0 0 1px rgba(120,140,170,0.06)'
  }} className="upload-panel">
          <Glow />
          <h1 style={{ margin: '0 0 0.75rem', fontSize: '2.2rem', background: 'linear-gradient(130deg,#ffffff,#b7c1d6 40%,#5d6bff)', WebkitBackgroundClip: 'text', color: 'transparent', textAlign: 'center' }}>Upload. Analyze. Trust.</h1>
        <p style={{
            margin: '0 0 1.5rem',
            maxWidth: 820,
            lineHeight: 1.45,
            color: 'var(--text-dim)',
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(93,107,255,0.02), rgba(61,220,151,0.03))',
            padding: '1rem 1.25rem',
            borderRadius: 12,
            border: '1px solid rgba(93,107,255,0.2)',
            backdropFilter: 'blur(1000px)'
        }}>
            Leveraging state-of-the-art DF40 dataset training and multi-model intelligence to expose synthetic media. Real-time analysis for images and videos up to 60 seconds.
        </p>

          <div ref={dropRef} onDragOver={(e) => { e.preventDefault(); setDragActive(true); }} onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }} onDrop={onDrop} onClick={() => inputRef.current?.click()} style={{
            border: '2px dashed '+(dragActive ? '#7f8aff' : 'rgba(255,255,255,0.18)'),
            borderRadius: 18,
            padding: '2.8rem 1.9rem 2.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            position: 'relative',
            background: dragActive ? 'linear-gradient(145deg,#1b2740,#101823)' : 'linear-gradient(145deg,#0d141c,#0a0f15)',
            transition: 'background .4s, border-color .35s, box-shadow .45s',
            boxShadow: dragActive ? '0 0 0 2px #5d6bff88,0 0 34px -4px #4855ff55' : '0 0 0 1px #212b36, 0 4px 18px -10px #000',
            overflow: 'hidden',
            minHeight: 220,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            marginBottom: '100px'
          }} className="upload-drop">
            <input ref={inputRef} type="file" accept="image/*,video/*" onChange={(e) => onFiles(e.target.files)} />
            {/* overlay pattern for contrast */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(circle at 30% 20%, rgba(93,107,255,0.18), transparent 60%)', opacity: 0.5 }} />
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0 2px, transparent 2px 6px)', mixBlendMode: 'overlay', opacity: 0.25 }} />
            <svg width="54" height="54" viewBox="0 0 48 48" fill="none" style={{ display: 'block', margin: '0 auto 0.95rem', opacity: 1, marginBottom: '1.95rem' }}>
              <rect x="4" y="10" width="40" height="30" rx="8" stroke="#5d6bff" strokeWidth="1.4" strokeDasharray="5 4" fill="rgba(93,107,255,0.07)" />
              <path d="M24 16v14m0 0 7-7m-7 7-7-7" stroke="#3ddc97" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div style={{ fontSize: '1rem', letterSpacing: 0.4, opacity: 0.95, fontWeight: 500 }}>
              <strong>Drop image / video</strong> or <span style={{ color: 'var(--accent)' }}>browse</span>
            </div>
            <div style={{ fontSize: '0.63rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '0.9rem', color: '#7a8595' }}>JPG · PNG · MP4 · MOV · WEBM</div>
            {uploading && <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--accent)' }}>Uploading...</div>}
          </div>

          <div style={{ display: 'flex', marginTop: '1.7rem', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <QuotaPill />
            <ReferralPill credits={referralCredits} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const Glow = () => (
  <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
    <div style={{ position: 'absolute', width: 280, height: 280, background: 'radial-gradient(circle,#4855ff33,#4855ff00 70%)', top: -60, left: -40, filter: 'blur(30px)' }} />
    <div style={{ position: 'absolute', width: 220, height: 220, background: 'radial-gradient(circle,#3ddc9733,#3ddc9700 70%)', bottom: -40, right: -20, filter: 'blur(30px)' }} />
  </div>
);

const QuotaPill = () => {
  const { dailyRemaining } = useUIStore();
  return (
    <div style={{ background: '#1a2029', padding: '0.55rem 0.95rem', borderRadius: 999, fontSize: '0.7rem', letterSpacing: 1.5, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: dailyRemaining > 0 ? 'var(--ok)' : 'var(--danger)' }} />
      {dailyRemaining} left today
    </div>
  );
};

const ReferralPill = ({ credits }: { credits: number }) => (
  <button style={{ background: '#1c232d', borderRadius: 999, fontSize: '0.7rem', letterSpacing: 1.5, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6, padding: '0.55rem 0.95rem' }} onClick={() => navigator.clipboard.writeText(window.location.origin + '?ref=you')}>⚡ Referrals {credits}
  </button>
);
