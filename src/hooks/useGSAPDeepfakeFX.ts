import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Adds subtle scanline / chromatic aberration flicker to a container.
 * Returns ref to attach.
 */
export const useGSAPDeepfakeFX = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const scan = document.createElement('div');
    scan.style.position = 'absolute';
    scan.style.inset = '0';
    scan.style.pointerEvents = 'none';
    scan.style.background = 'repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 3px)';
    scan.style.mixBlendMode = 'overlay';
    scan.style.opacity = '0.25';
    el.appendChild(scan);

    const tl = gsap.timeline({ repeat: -1 });
    tl.to(scan, { yPercent: -30, duration: 6, ease: 'none' })
      .to(scan, { yPercent: 0, duration: 0 });

    const aberr = document.createElement('div');
    aberr.style.position = 'absolute';
    aberr.style.inset = '0';
    aberr.style.pointerEvents = 'none';
    aberr.style.mixBlendMode = 'screen';
    aberr.style.filter = 'blur(1px)';
    aberr.style.background = 'linear-gradient(90deg,rgba(255,0,80,0.07),transparent 40%, transparent 60%, rgba(0,180,255,0.07))';
    el.appendChild(aberr);

    const flicker = gsap.to(aberr, { opacity: 0.35, duration: 0.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });

    return () => {
      tl.kill();
      flicker.kill();
      scan.remove();
      aberr.remove();
    };
  }, []);
  return ref;
};
