'use client';

import { useMemo, useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  Filler,
} from 'chart.js';
import { LineChartProps } from './types';
import {
  getChartColors,
  getTooltipTheme,
  getGridColor,
  DEFAULT_CHART_COLORS,
  DEFAULT_TOOLTIP_THEME,
  DEFAULT_GRID_COLOR,
} from './chartTheme';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function LineChart({
  data,
  title,
  legend = { display: true, position: 'top' },
  customTooltip,
  onClick,
  width,
  height = 300,
  className = '',
  options: customOptions,
  smooth = true,
  showPoints = true,
  fill = false,
  stacked = false,
}: LineChartProps) {
  const [chartColors, setChartColors] = useState(DEFAULT_CHART_COLORS);
  const [tooltipTheme, setTooltipTheme] = useState(DEFAULT_TOOLTIP_THEME);
  const [gridColor, setGridColor] = useState(DEFAULT_GRID_COLOR);

  // Update colors when theme changes
  useEffect(() => {
    const updateColors = () => {
      setChartColors(getChartColors());
      setTooltipTheme(getTooltipTheme());
      setGridColor(getGridColor());
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
      datasets: data.datasets.map((dataset, index) => ({
        ...dataset,
        borderColor:
          dataset.borderColor || chartColors[index % chartColors.length],
        backgroundColor:
          dataset.backgroundColor ||
          (fill
            ? `${chartColors[index % chartColors.length]}33`
            : chartColors[index % chartColors.length]),
        borderWidth: dataset.borderWidth ?? 2,
        fill: dataset.fill ?? fill,
        tension: dataset.tension ?? (smooth ? 0.4 : 0),
        pointRadius: dataset.pointRadius ?? (showPoints ? 4 : 0),
        pointHoverRadius: dataset.pointHoverRadius ?? (showPoints ? 6 : 0),
      })),
    };
  }, [data, fill, smooth, showPoints, chartColors]);

  const options = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: legend?.display ?? true,
          position: legend?.position ?? 'top',
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
                  const label = context.dataset.label || '';
                  const value = context.parsed.y;
                  const dataLabel = context.label;
                  return customTooltip(dataLabel, value, label);
                },
              }
            : undefined,
        },
      },
      scales: {
        x: {
          stacked,
          border: {
            color: gridColor,
            width: 1,
            dash: [4, 3],
          },
          grid: {
            color: gridColor,
          },
          ticks: {
            color: 'var(--layout-text-secondary)',
          },
        },
        y: {
          stacked,
          border: {
            color: gridColor,
            width: 1,
            dash: [4, 3],
          },
          grid: {
            color: gridColor,
          },
          ticks: {
            color: 'var(--layout-text-secondary)',
          },
        },
      },
      onClick: onClick
        ? (event, elements) => {
            if (elements.length > 0) {
              const element = elements[0];
              const datasetIndex = element.datasetIndex;
              const dataIndex = element.index;
              const value = data.datasets[datasetIndex].data[dataIndex];
              const label = data.labels[dataIndex];
              onClick(datasetIndex, dataIndex, value, label);
            }
          }
        : undefined,
      ...customOptions,
    } as ChartOptions<'line'>;
  }, [
    title,
    legend,
    customTooltip,
    onClick,
    stacked,
    data,
    customOptions,
    tooltipTheme,
    gridColor,
  ]);

  return (
    <div className={className} style={{ width, height }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
