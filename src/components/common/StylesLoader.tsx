'use client';

import { useEffect, useState } from 'react';

export function StylesLoader({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Wait for styles to be loaded
    const timer = setTimeout(() => {
      setIsLoaded(true);
      if (typeof document !== 'undefined') {
        document.documentElement.classList.add('hydrated');
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'var(--theme-bg-body, #f1f3f9)',
          zIndex: 9999,
        }}
      />
    );
  }

  return <>{children}</>;
}
