import { Injectable } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  createRevenueChart(canvas: HTMLCanvasElement) {
    return new Chart(canvas, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Revenue',
            data: [12000, 19000, 15000, 25000, 22000, 30000],
            borderColor: '#3f51b5',
            backgroundColor: 'rgba(63, 81, 181, 0.1)',
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
      },
    });
  }

  createUserChart(canvas: HTMLCanvasElement) {
    return new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Desktop', 'Mobile', 'Tablet'],
        datasets: [
          {
            data: [65, 25, 10],
            backgroundColor: ['#3f51b5', '#e91e63', '#ff9800'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }

  createTrafficChart(canvas: HTMLCanvasElement) {
    return new Chart(canvas, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Visitors',
            data: [12000, 19000, 15000, 25000, 22000, 30000],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }

  createDeviceChart(canvas: HTMLCanvasElement) {
    return new Chart(canvas, {
      type: 'pie',
      data: {
        labels: ['Desktop', 'Mobile', 'Tablet'],
        datasets: [
          {
            data: [54.3, 36.0, 9.7],
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }

  createGeographyChart(canvas: HTMLCanvasElement) {
    return new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['US', 'UK', 'DE', 'FR', 'CA'],
        datasets: [
          {
            label: 'Users',
            data: [5234, 3421, 2847, 2156, 1876],
            backgroundColor: '#3b82f6',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
}
