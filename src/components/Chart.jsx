import {
  Chart,
  CategoryScale,
  ArcElement,
  BarElement,
  LinearScale,
} from "chart.js";

// Mendaftarkan elemen dan skala yang diperlukan
Chart.register(CategoryScale, ArcElement, BarElement, LinearScale);
