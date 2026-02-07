/**
 * Chart theme utilities for getting CSS variable values at runtime.
 * Chart.js doesn't support CSS variables directly, so we need to resolve them.
 */

/**
 * Get computed CSS variable value from the document root
 */
export function getCssVariable(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
}

/**
 * Get all chart colors from CSS variables
 */
export function getChartColors(): string[] {
  return [
    getCssVariable('--theme-chart-1', '#3B82F6'),
    getCssVariable('--theme-chart-2', '#10B981'),
    getCssVariable('--theme-chart-3', '#F59E0B'),
    getCssVariable('--theme-chart-4', '#EF4444'),
    getCssVariable('--theme-chart-5', '#8B5CF6'),
    getCssVariable('--theme-chart-6', '#EC4899'),
    getCssVariable('--theme-chart-7', '#14B8A6'),
    getCssVariable('--theme-chart-8', '#F97316'),
    getCssVariable('--theme-chart-9', '#06B6D4'),
    getCssVariable('--theme-chart-10', '#84CC16'),
  ];
}

/**
 * Get tooltip theme from CSS variables
 */
export function getTooltipTheme() {
  return {
    backgroundColor: getCssVariable('--theme-tooltip-bg', 'rgba(0, 0, 0, 0.8)'),
    titleColor: getCssVariable('--theme-tooltip-text', '#ffffff'),
    bodyColor: getCssVariable('--theme-tooltip-text', '#ffffff'),
    borderColor: getCssVariable(
      '--theme-tooltip-border',
      'rgba(255, 255, 255, 0.1)'
    ),
  };
}

/**
 * Get grid/divider color from CSS variables
 */
export function getGridColor(): string {
  return getCssVariable('--theme-divider', 'oklch(0.87 0.01 258.34 / 1)');
}

/**
 * Default colors for SSR (before CSS variables are available)
 */
export const DEFAULT_CHART_COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#14B8A6', // teal
  '#F97316', // orange
  '#06B6D4', // cyan
  '#84CC16', // lime
];

/**
 * Default tooltip theme for SSR (before CSS variables are available)
 */
export const DEFAULT_TOOLTIP_THEME = {
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  titleColor: '#ffffff',
  bodyColor: '#ffffff',
  borderColor: 'rgba(255, 255, 255, 0.1)',
};

/**
 * Default grid color for SSR
 */
export const DEFAULT_GRID_COLOR = 'rgba(148, 163, 184, 0.2)';
