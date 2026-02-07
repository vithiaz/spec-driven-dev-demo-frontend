# Chart Components

Reusable chart components built with Chart.js and React-Chartjs-2. These components provide an easy-to-use interface for creating beautiful, interactive charts.

## Components

- **LineChart** - Line chart with support for multiple lines, filled areas, and smooth curves
- **BarChart** - Bar chart with horizontal/vertical orientation, stacking, and line combination
- **PieChart** - Pie and doughnut charts with customizable colors

## Features

- ✅ Multiple datasets support
- ✅ Custom colors for each dataset
- ✅ Custom labels (text, date, value, or other)
- ✅ Configurable legend (position, alignment, styling)
- ✅ Custom tooltips
- ✅ Click callbacks on chart items
- ✅ Responsive and themeable
- ✅ Dark mode support
- ✅ TypeScript support

## Quick Start

```tsx
import { LineChart, BarChart, PieChart } from '@/components/chart';

// Line Chart
<LineChart
  data={{
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Sales',
        data: [12, 19, 3, 5, 2],
        borderColor: '#3B82F6',
      },
    ],
  }}
  title="Monthly Sales"
  smooth
  showPoints
/>

// Bar Chart
<BarChart
  data={{
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Revenue',
        data: [100, 150, 120, 180],
        backgroundColor: '#10B981',
      },
    ],
  }}
  title="Quarterly Revenue"
/>

// Pie Chart
<PieChart
  data={{
    labels: ['Product A', 'Product B', 'Product C'],
    datasets: [
      {
        data: [30, 50, 20],
      },
    ],
  }}
  title="Product Distribution"
  doughnut
/>
```

## Props

### Common Props (All Charts)

| Prop          | Type             | Default                            | Description                         |
| ------------- | ---------------- | ---------------------------------- | ----------------------------------- |
| data          | ChartData        | required                           | Chart data with labels and datasets |
| title         | string           | -                                  | Chart title                         |
| legend        | LegendConfig     | { display: true, position: 'top' } | Legend configuration                |
| customTooltip | function         | -                                  | Custom tooltip formatter            |
| onClick       | function         | -                                  | Click callback for chart items      |
| width         | string \| number | -                                  | Chart width                         |
| height        | string \| number | 300                                | Chart height                        |
| className     | string           | ''                                 | Additional CSS classes              |
| options       | ChartOptions     | -                                  | Additional Chart.js options         |

### LineChart Props

| Prop       | Type    | Default | Description                 |
| ---------- | ------- | ------- | --------------------------- |
| smooth     | boolean | true    | Use smooth curves (tension) |
| showPoints | boolean | true    | Show data points            |
| fill       | boolean | false   | Fill area under line        |
| stacked    | boolean | false   | Stack multiple lines        |

### BarChart Props

| Prop             | Type    | Default | Description                      |
| ---------------- | ------- | ------- | -------------------------------- |
| horizontal       | boolean | false   | Horizontal bars                  |
| stacked          | boolean | false   | Stack bars                       |
| showLine         | boolean | false   | Combine bar with line            |
| lineDatasetIndex | number  | -       | Index of dataset to show as line |

### PieChart Props

| Prop     | Type    | Default | Description            |
| -------- | ------- | ------- | ---------------------- |
| doughnut | boolean | false   | Show as doughnut chart |
| cutout   | string  | '50%'   | Doughnut hole size     |

## Examples

See [PrimeReactFormExample.tsx](../examples/PrimeReactFormExample.tsx) for comprehensive examples.

## Customization

### Custom Colors

```tsx
<LineChart
  data={{
    labels: ['A', 'B', 'C'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [1, 2, 3],
        borderColor: '#FF6384',
        backgroundColor: '#FF638433',
      },
    ],
  }}
/>
```

### Custom Legend

```tsx
<BarChart
  data={data}
  legend={{
    display: true,
    position: 'bottom',
    align: 'start',
    labels: {
      color: '#333',
      font: { size: 14, weight: 'bold' },
      padding: 20,
      usePointStyle: true,
    },
  }}
/>
```

### Custom Tooltip

```tsx
<LineChart
  data={data}
  customTooltip={(label, value, datasetLabel) => {
    return `${datasetLabel}: $${value.toFixed(2)} on ${label}`;
  }}
/>
```

### Click Handler

```tsx
<BarChart
  data={data}
  onClick={(datasetIndex, dataIndex, value, label) => {
    console.log(`Clicked: ${label} = ${value}`);
    // Handle click action
  }}
/>
```

## TypeScript

All components are fully typed:

```tsx
import type {
  ChartData,
  LineChartProps,
  BarChartProps,
  PieChartProps,
  LegendConfig,
} from '@/components/chart';
```
