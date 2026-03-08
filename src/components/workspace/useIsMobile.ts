import { useState, useEffect } from 'react';

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false,
  );

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const handler = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setIsMobile(window.innerWidth < 640), 100);
    };
    window.addEventListener('resize', handler, { passive: true });
    return () => { clearTimeout(timer); window.removeEventListener('resize', handler); };
  }, []);

  return isMobile;
}
