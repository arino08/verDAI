import { useEffect, useState } from 'react';

/**
 * useIsMobile - reactive viewport width <= breakpoint (default 768px)
 */
export const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth <= breakpoint : false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = () => setIsMobile(mq.matches);
    handler();
    mq.addEventListener('change', handler);
    window.addEventListener('resize', handler);
    return () => { mq.removeEventListener('change', handler); window.removeEventListener('resize', handler); };
  }, [breakpoint]);
  return isMobile;
};
