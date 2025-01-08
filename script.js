// Niezoptymalizowane rozwiązanie
function solution1(expenses) {
  const result = {};

  for (const [month, days] of Object.entries(expenses)) {
    const firstSunday = getFirstSundayOfMonth(month);
    const relevantDays = Object.entries(days)
      .filter(([day]) => parseInt(day) <= firstSunday)
      .flatMap(([_, categories]) => Object.values(categories).flat());

    result[month] = calculateMedian(relevantDays);
  }

  return result;
}

// Zoptymalizowane rozwiązanie z Quick Select
function solution2(expenses) {
  /**
   * Wybór Quick Select pozwala na wyznaczenie mediany w czasie O(n) w średnim przypadku.
   * W porównaniu do sortowania (O(n log n)), jest to wydajniejsze dla dużych zbiorów danych.
   * Wada: algorytm ma pesymistyczny czas działania O(n^2) w najgorszym przypadku.
   */

  const result = {};

  for (const [month, days] of Object.entries(expenses)) {
    const firstSunday = getFirstSundayOfMonth(month);
    const relevantDays = Object.entries(days)
      .filter(([day]) => parseInt(day) <= firstSunday)
      .flatMap(([_, categories]) => Object.values(categories).flat());

    result[month] = quickSelectMedian(relevantDays);
  }

  return result;
}

// Funkcja pomocnicza do wyznaczania pierwszej niedzieli miesiąca
function getFirstSundayOfMonth(month) {
  const [year, mon] = month.split("-").map(Number);
  for (let day = 1; day <= 7; day++) {
    const date = new Date(year, mon - 1, day);
    if (date.getDay() === 0) return day;
  }
  return 7; // Fallback, chociaż powinno być niepotrzebne
}

// Funkcja pomocnicza do obliczania mediany (ogólna)
function calculateMedian(values) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

// Funkcja Quick Select do wyznaczania mediany
function quickSelectMedian(values) {
  if (values.length === 0) return null;

  const mid = Math.floor(values.length / 2);
  return quickSelect(values, mid);
}

function quickSelect(arr, k) {
  const pivot = arr[Math.floor(Math.random() * arr.length)];
  const lows = arr.filter((x) => x < pivot);
  const highs = arr.filter((x) => x > pivot);
  const pivots = arr.filter((x) => x === pivot);

  if (k < lows.length) {
    return quickSelect(lows, k);
  } else if (k < lows.length + pivots.length) {
    return pivot;
  } else {
    return quickSelect(highs, k - lows.length - pivots.length);
  }
}

// Przykład użycia
const expenses = {
  "2023-01": {
    "01": {
      food: [22.11, 43, 11.72, 2.2, 36.29, 2.5, 19],
      fuel: [210.22],
    },
    "09": {
      food: [11.9],
      fuel: [190.22],
    },
  },
  "2023-03": {
    "07": {
      food: [20, 11.9, 30.2, 11.9],
    },
    "04": {
      food: [10.2, 11.5, 2.5],
      fuel: [],
    },
  },
  "2023-04": {},
};

console.log("Solution 1:", solution1(expenses));
console.log("Solution 2:", solution2(expenses));
