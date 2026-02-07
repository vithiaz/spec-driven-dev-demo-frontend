import { ChartOptions } from 'chart.js';

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
  tension?: number;
  pointRadius?: number;
  pointHoverRadius?: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface CustomTooltipCallback {
  (label: string, value: number | null, datasetLabel: string): string;
}

export interface ChartClickCallback {
  (datasetIndex: number, dataIndex: number, value: number, label: string): void;
}

export interface LegendConfig {
  display?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  labels?: {
    color?: string;
    font?: {
      size?: number;
      family?: string;
      weight?: string | number;
    };
    padding?: number;
    usePointStyle?: boolean;
  };
}

export interface BaseChartProps {
  data: ChartData;
  title?: string;
  legend?: LegendConfig;
  customTooltip?: CustomTooltipCallback;
  onClick?: ChartClickCallback;
  width?: string | number;
  height?: string | number;
  className?: string;
  options?: ChartOptions;
}

export interface LineChartProps extends BaseChartProps {
  smooth?: boolean;
  showPoints?: boolean;
  fill?: boolean;
  stacked?: boolean;
}

export interface BarChartProps extends BaseChartProps {
  horizontal?: boolean;
  stacked?: boolean;
  showLine?: boolean;
  lineDatasetIndex?: number;
}

export interface PieChartProps extends BaseChartProps {
  doughnut?: boolean;
  cutout?: string;
}
