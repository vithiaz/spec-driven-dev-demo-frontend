'use client';

import { useTheme } from '@/lib/providers/ThemeProvider';
import { Ripple } from 'primereact/ripple';
import clsx from 'clsx';

interface ThemeToggleProps {
  /** Whether to show the label text */
  showLabel?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Theme toggle switch component for light/dark mode.
 * Displays sun/moon icons with an animated toggle switch.
 */
export const ThemeToggle = ({
  showLabel = true,
  className,
}: ThemeToggleProps) => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  const handleToggle = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <div className={clsx('theme-toggle-wrapper', className)}>
      {showLabel && (
        <span className="theme-toggle-label">
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        className={clsx('theme-toggle p-ripple', { 'is-dark': isDark })}
        onClick={handleToggle}
        data-testid="theme-toggle"
      >
        <span className="theme-toggle-track">
          <span className="theme-toggle-icons">
            <i className="pi pi-sun theme-toggle-icon-light" aria-hidden />
            <i className="pi pi-moon theme-toggle-icon-dark" aria-hidden />
          </span>
          <span className="theme-toggle-thumb" />
        </span>
        <Ripple />
      </button>
    </div>
  );
};

export default ThemeToggle;
