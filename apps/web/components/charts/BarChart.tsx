'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string | string[];
      borderRadius?: number;
    }[];
  };
  options?: any;
  horizontal?: boolean;
}

export default function BarChart({ data, options, horizontal = false }: BarChartProps) {
  const defaultOptions = {
    indexAxis: horizontal ? ('y' as const) : ('x' as const),
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        borderRadius: 8,
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 13,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: !horizontal,
          color: '#f1f5f9',
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          color: '#64748b',
        },
      },
      y: {
        grid: {
          display: horizontal,
          color: '#f1f5f9',
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          color: '#64748b',
          callback: function(value: any) {
            if (horizontal) {
              return value;
            }
            return '€' + value.toLocaleString();
          },
        },
      },
    },
  };

  return <Bar data={data} options={{ ...defaultOptions, ...options }} />;
}
