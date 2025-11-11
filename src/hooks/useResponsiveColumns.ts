import * as React from 'react';

/**
 * Returns how many columns the grid shows at the current viewport
 * to match your Tailwind classes: 2 (base), 3 (sm), 4 (md), 5 (lg).
 * - sm: 640px
 * - md: 768px
 * - lg: 1024px
 */
export function useResponsiveColumns() {
  const getCols = () => {
    if (typeof window === 'undefined') return 2; // SSR-safe default
    const w = window.innerWidth;
    if (w >= 1024) return 5; // lg
    if (w >= 768) return 4; // md
    if (w >= 640) return 3; // sm
    return 2; // base
  };

  const [cols, setCols] = React.useState<number>(getCols);

  React.useEffect(() => {
    const onResize = () => setCols(getCols());
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return cols;
}
