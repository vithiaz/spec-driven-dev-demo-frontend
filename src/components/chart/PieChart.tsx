'use client';

import { useMemo, useState, useEffect } from 'react';
import { Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { PieChartProps } from './types';
import {
  getChartColors,
  getTooltipTheme,
  DEFAULT_CHART_COLORS,
  DEFAULT_TOOLTIP_THEME,
} from './chartTheme';

ChartJS.register(ArcElement, Title, Tooltip, Legend);

export function PieChart({
  data,
  title,
  legend = { display: true, position: 'right' },
  customTooltip,
  onClick,
  width,
  height = 300,
  className = '',
  options: customOptions,
  doughnut = false,
  cutout,
}: PieChartProps) {
  const [chartColors, setChartColors] = useState(DEFAULT_CHART_COLORS);
  const [tooltipTheme, setTooltipTheme] = useState(DEFAULT_TOOLTIP_THEME);

  // Update colors when theme changes
  useEffect(() => {
    const updateColors = () => {
      setChartColors(getChartColors());
      setTooltipTheme(getTooltipTheme());
    };

    updateColors();

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'data-theme'
        ) {
          updateColors();
        }
      });
    });

    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const chartData = useMemo(() => {
    return {
      labels: data.labels,
      datasets: data.datasets.map((dataset) => ({
        ...dataset,
        backgroundColor:
          dataset.backgroundColor ||
          data.labels.map((_, i) => chartColors[i % chartColors.length]),
        borderColor: dataset.borderColor || 'var(--theme-bg-card)',
        borderWidth: dataset.borderWidth ?? 2,
      })),
    };
  }, [data, chartColors]);

  const options = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: legend?.display ?? true,
          position: legend?.position ?? 'right',
          align: legend?.align ?? 'center',
          labels: {
            color: legend?.labels?.color ?? 'var(--layout-text-color)',
            font: {
              size: legend?.labels?.font?.size ?? 12,
              family: legend?.labels?.font?.family ?? 'Inter, sans-serif',
              weight: legend?.labels?.font?.weight ?? 'normal',
            },
            padding: legend?.labels?.padding ?? 15,
            usePointStyle: legend?.labels?.usePointStyle ?? true,
          },
        },
        title: {
          display: !!title,
          text: title,
          color: 'var(--layout-text-color)',
          font: {
            size: 16,
            weight: 'bold',
          },
          padding: 20,
        },
        tooltip: {
          ...tooltipTheme,
          borderWidth: 1,
          padding: 12,
          displayColors: true,
          callbacks: customTooltip
            ? {
                label: (context) => {
                  const label = context.label || '';
                  const value = context.parsed;
                  const datasetLabel = context.dataset.label || '';
                  return customTooltip(label, value, datasetLabel);
                },
              }
            : {
                label: (context) => {
                  const label = context.label || '';
                  const value = context.parsed;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${label}: ${value} (${percentage}%)`;
                },
              },
        },
      },
      ...(doughnut && { cutout: cutout || '50%' }),
      onClick: onClick
        ? (event, elements) => {
            if (elements.length > 0) {
              const element = elements[0];
              const dataIndex = element.index;
              const datasetIndex = 0;
              const value = data.datasets[datasetIndex].data[dataIndex];
              const label = data.labels[dataIndex];
              onClick(datasetIndex, dataIndex, value, label);
            }
          }
        : undefined,
      ...customOptions,
    } as ChartOptions<'pie' | 'doughnut'>;
  }, [
    title,
    legend,
    customTooltip,
    onClick,
    doughnut,
    cutout,
    data,
    customOptions,
    tooltipTheme,
  ]);

  const ChartComponent = doughnut ? Doughnut : Pie;

  return (
    <div className={className} style={{ width, height }}>
      <ChartComponent
        data={chartData}
        options={options as ChartOptions<'pie' | 'doughnut'>}
      />
    </div>
  );
}
