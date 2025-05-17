/**
 * Calculates a user's health score based on various metrics.
 * 
 * The score is calculated on a scale of 0-100, with each metric contributing
 * a weighted portion to the final score.
 * 
 * @param metrics Object containing the user's health metrics
 * @returns A number between 0-100 representing the overall health score
 */
export interface HealthMetrics {
  deepSleep?: number; // hours
  remSleep?: number; // hours
  steps?: number; // count
  calories?: number; // kcal burned
  heartRate?: number; // bpm resting
  bmi?: number; // kg/m²
  weight?: number; // kg
  cgm?: number; // average blood glucose in mg/dL
}

interface MetricWeight {
  weight: number;
  normalizeFunc: (value: number) => number;
}

export function calculateHealthScore(metrics: HealthMetrics): number {
  // Define ideal ranges and weights for each metric
  const metricDefinitions: Record<keyof HealthMetrics, MetricWeight> = {
    deepSleep: {
      weight: 0.2,
      normalizeFunc: (value) => normalizeValue(value, 0, 3, 0, 100),
    },
    remSleep: {
      weight: 0.15,
      normalizeFunc: (value) => normalizeValue(value, 0, 2.5, 0, 100),
    },
    steps: {
      weight: 0.15,
      normalizeFunc: (value) => normalizeValue(value, 0, 10000, 0, 100),
    },
    calories: {
      weight: 0.1,
      normalizeFunc: (value) => normalizeValue(value, 0, 800, 0, 100),
    },
    heartRate: {
      weight: 0.1,
      // Lower heart rate is better (up to a point)
      normalizeFunc: (value) => 100 - normalizeValue(value, 40, 100, 0, 100),
    },
    bmi: {
      weight: 0.15,
      // BMI has an ideal range around 21-23, with penalties for being too low or too high
      normalizeFunc: (value) => {
        if (value < 18.5) {
          return normalizeValue(value, 16, 18.5, 40, 90);
        } else if (value <= 24.9) {
          return normalizeValue(value, 18.5, 24.9, 90, 100);
        } else if (value <= 29.9) {
          return normalizeValue(value, 24.9, 29.9, 100, 50);
        } else {
          return normalizeValue(value, 29.9, 40, 50, 10);
        }
      },
    },
    weight: {
      weight: 0,
      // Weight is not scored directly, but used in BMI calculation
      normalizeFunc: (value) => 0,
    },
    cgm: {
      weight: 0.15,
      // Ideal glucose range is around 70-100 mg/dL, with penalties for higher values
      normalizeFunc: (value) => {
        if (value < 70) {
          return normalizeValue(value, 40, 70, 40, 80);
        } else if (value <= 100) {
          return normalizeValue(value, 70, 100, 80, 100);
        } else if (value <= 140) {
          return normalizeValue(value, 100, 140, 100, 60);
        } else {
          return normalizeValue(value, 140, 250, 60, 0);
        }
      },
    },
  };

  // Calculate weighted score for available metrics
  let totalScore = 0;
  let totalWeight = 0;

  for (const [metric, value] of Object.entries(metrics) as [keyof HealthMetrics, number | undefined][]) {
    if (value !== undefined) {
      const { weight, normalizeFunc } = metricDefinitions[metric];
      totalScore += normalizeFunc(value) * weight;
      totalWeight += weight;
    }
  }

  // Adjust score based on total weight
  if (totalWeight === 0) {
    return 0; // No metrics available
  }

  return Math.round(totalScore / totalWeight);
}

/**
 * Normalizes a value within a given range to a target range.
 */
function normalizeValue(
  value: number,
  minSource: number,
  maxSource: number,
  minTarget: number,
  maxTarget: number
): number {
  // Clamp value to source range
  const clampedValue = Math.max(minSource, Math.min(maxSource, value));
  
  // Calculate normalized value
  const normalizedValue =
    ((clampedValue - minSource) / (maxSource - minSource)) * (maxTarget - minTarget) + minTarget;
  
  return Math.min(maxTarget, Math.max(minTarget, normalizedValue));
}