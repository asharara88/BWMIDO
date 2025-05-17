import { expect, test, describe } from 'vitest';
import { calculateHealthScore, HealthMetrics } from '../utils/healthScore';

describe('Health Score Calculator', () => {
  test('should calculate a perfect score when all metrics are optimal', () => {
    const perfectMetrics: HealthMetrics = {
      deepSleep: 3,
      remSleep: 2.5,
      steps: 10000,
      calories: 800,
      heartRate: 50,
      bmi: 22,
      cgm: 85
    };
    
    const score = calculateHealthScore(perfectMetrics);
    expect(score).toBeGreaterThanOrEqual(95);
  });
  
  test('should calculate a low score when all metrics are poor', () => {
    const poorMetrics: HealthMetrics = {
      deepSleep: 0.5,
      remSleep: 0.5,
      steps: 1000,
      calories: 100,
      heartRate: 95,
      bmi: 35,
      cgm: 200
    };
    
    const score = calculateHealthScore(poorMetrics);
    expect(score).toBeLessThanOrEqual(40);
  });
  
  test('should handle partial metrics', () => {
    const partialMetrics: HealthMetrics = {
      deepSleep: 2.0,
      steps: 8000,
      bmi: 24
    };
    
    const score = calculateHealthScore(partialMetrics);
    expect(score).toBeGreaterThan(0);
  });
  
  test('should return 0 for empty metrics', () => {
    const emptyMetrics: HealthMetrics = {};
    const score = calculateHealthScore(emptyMetrics);
    expect(score).toBe(0);
  });
  
  test('should properly weight sleep metrics', () => {
    const goodSleepOnly: HealthMetrics = {
      deepSleep: 2.5,
      remSleep: 2.0
    };
    
    const poorSleepOnly: HealthMetrics = {
      deepSleep: 0.5,
      remSleep: 0.5
    };
    
    const goodScore = calculateHealthScore(goodSleepOnly);
    const poorScore = calculateHealthScore(poorSleepOnly);
    
    expect(goodScore).toBeGreaterThan(poorScore);
    expect(goodScore).toBeGreaterThan(70);
    expect(poorScore).toBeLessThan(40);
  });
  
  test('should handle edge case values', () => {
    const edgeCaseMetrics: HealthMetrics = {
      deepSleep: 10, // Unrealistically high
      remSleep: -1, // Invalid negative
      steps: 50000, // Extremely high
      heartRate: 30, // Very low
      bmi: 15, // Underweight
      cgm: 300 // Very high blood glucose
    };
    
    // Should not throw an error
    expect(() => calculateHealthScore(edgeCaseMetrics)).not.toThrow();
    
    const score = calculateHealthScore(edgeCaseMetrics);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
  
  test('should calculate BMI scores correctly', () => {
    const underweightBMI: HealthMetrics = { bmi: 17 };
    const normalBMI: HealthMetrics = { bmi: 22 };
    const overweightBMI: HealthMetrics = { bmi: 28 };
    const obeseBMI: HealthMetrics = { bmi: 35 };
    
    const underweightScore = calculateHealthScore(underweightBMI);
    const normalScore = calculateHealthScore(normalBMI);
    const overweightScore = calculateHealthScore(overweightBMI);
    const obeseScore = calculateHealthScore(obeseBMI);
    
    // Normal BMI should score highest
    expect(normalScore).toBeGreaterThan(underweightScore);
    expect(normalScore).toBeGreaterThan(overweightScore);
    expect(normalScore).toBeGreaterThan(obeseScore);
    
    // Severely obese BMI should score lowest
    expect(obeseScore).toBeLessThan(overweightScore);
    expect(obeseScore).toBeLessThan(underweightScore);
  });
});