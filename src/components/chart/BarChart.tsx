'use client';

import { useMemo, useState, useEffect } from 'react';
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineElement,
  LineController,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { BarChartProps } from './types';
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
  BarElement,
  BarController,
  LineElement,
  LineController,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export function BarChart({
  data,
  title,
  legend = { display: true, position: 'top' },
  customTooltip,
  onClick,
  width,
  height = 300,
  className = '',
  options: customOptions,
  horizontal = false,
  stacked = true,
  showLine = false,
  lineDatasetIndex,
}: BarChartProps) {
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
      datasets: data.datasets.map((dataset, index) => {
        const isLineDataset =
          showLine &&
          lineDatasetIndex !== undefined &&
          index === lineDatasetIndex;

        return {
          ...dataset,
          type: isLineDataset ? ('line' as const) : ('bar' as const),
          backgroundColor:
            dataset.backgroundColor || chartColors[index % chartColors.length],
          ...(isLineDataset && {
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
          }),
        };
      }),
    };
  }, [data, showLine, lineDatasetIndex, chartColors]);

  const options = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: horizontal ? 'y' : 'x',
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
    } as ChartOptions<'bar' | 'line'>;
  }, [
    title,
    legend,
    customTooltip,
    onClick,
    horizontal,
    stacked,
    data,
    customOptions,
    tooltipTheme,
    gridColor,
  ]);

  return (
    <div className={className} style={{ width, height }}>
      <Chart type="bar" data={chartData} options={options} />
    </div>
  );
}
