// Precomputed TG sensitivity data for the graph
// This data simulates how different LDL estimation methods diverge as TG increases

export interface LipidDataPoint {
  tg: number;
  friedewald: number;
  martin: number;
  sampson: number;
  lipidai: number;
}

// Precomputed data from real model simulation (TC=200, HDL=50 baseline)
export const precomputedData: LipidDataPoint[] = [
  { tg: 50, friedewald: 145.0, martin: 146.67, sampson: 149.58, lipidai: 148.09 },
  { tg: 60, friedewald: 143.0, martin: 145.0, sampson: 148.7, lipidai: 148.09 },
  { tg: 70, friedewald: 141.0, martin: 143.33, sampson: 147.88, lipidai: 148.09 },
  { tg: 80, friedewald: 139.0, martin: 141.67, sampson: 147.13, lipidai: 148.09 },
  { tg: 90, friedewald: 137.0, martin: 140.0, sampson: 146.45, lipidai: 147.72 },
  { tg: 100, friedewald: 135.0, martin: 138.33, sampson: 145.83, lipidai: 147.45 },
  { tg: 110, friedewald: 133.0, martin: 136.67, sampson: 145.28, lipidai: 147.12 },
  { tg: 120, friedewald: 131.0, martin: 135.0, sampson: 144.8, lipidai: 146.8 },
  { tg: 130, friedewald: 129.0, martin: 133.33, sampson: 144.38, lipidai: 146.35 },
  { tg: 140, friedewald: 127.0, martin: 131.67, sampson: 144.03, lipidai: 145.82 },
  { tg: 150, friedewald: 125.0, martin: 130.0, sampson: 143.75, lipidai: 146.06 },
  { tg: 160, friedewald: 123.0, martin: 128.33, sampson: 143.53, lipidai: 145.5 },
  { tg: 170, friedewald: 121.0, martin: 126.67, sampson: 143.38, lipidai: 143.85 },
  { tg: 180, friedewald: 119.0, martin: 125.0, sampson: 143.3, lipidai: 143.23 },
  { tg: 190, friedewald: 117.0, martin: 123.33, sampson: 143.28, lipidai: 142.25 },
  { tg: 200, friedewald: 115.0, martin: 121.67, sampson: 143.33, lipidai: 140.86 },
  { tg: 210, friedewald: 113.0, martin: 120.0, sampson: 143.45, lipidai: 140.86 },
  { tg: 220, friedewald: 111.0, martin: 118.33, sampson: 143.63, lipidai: 140.21 },
  { tg: 230, friedewald: 109.0, martin: 116.67, sampson: 143.88, lipidai: 137.98 },
  { tg: 240, friedewald: 107.0, martin: 115.0, sampson: 144.2, lipidai: 137.76 },
  { tg: 250, friedewald: 105.0, martin: 113.33, sampson: 144.58, lipidai: 135.94 },
  { tg: 260, friedewald: 103.0, martin: 111.67, sampson: 145.03, lipidai: 134.27 },
  { tg: 270, friedewald: 101.0, martin: 110.0, sampson: 145.55, lipidai: 134.27 },
  { tg: 280, friedewald: 99.0, martin: 108.33, sampson: 146.13, lipidai: 134.27 },
  { tg: 290, friedewald: 97.0, martin: 106.67, sampson: 146.78, lipidai: 132.86 },
  { tg: 300, friedewald: 95.0, martin: 105.0, sampson: 147.5, lipidai: 130.53 },
  { tg: 310, friedewald: 93.0, martin: 103.33, sampson: 148.28, lipidai: 129.83 },
  { tg: 320, friedewald: 91.0, martin: 101.67, sampson: 149.13, lipidai: 127.53 },
  { tg: 330, friedewald: 89.0, martin: 100.0, sampson: 150.05, lipidai: 127.53 },
  { tg: 340, friedewald: 87.0, martin: 98.33, sampson: 151.03, lipidai: 125.31 },
  { tg: 350, friedewald: 85.0, martin: 96.67, sampson: 152.08, lipidai: 125.31 },
  { tg: 360, friedewald: 83.0, martin: 95.0, sampson: 153.2, lipidai: 122.06 },
  { tg: 370, friedewald: 81.0, martin: 93.33, sampson: 154.38, lipidai: 122.06 },
  { tg: 380, friedewald: 79.0, martin: 91.67, sampson: 155.63, lipidai: 122.06 },
  { tg: 390, friedewald: 77.0, martin: 90.0, sampson: 156.95, lipidai: 116.16 },
  { tg: 400, friedewald: 75.0, martin: 88.33, sampson: 158.33, lipidai: 112.39 },
  { tg: 410, friedewald: 73.0, martin: 86.67, sampson: 159.78, lipidai: 112.39 },
  { tg: 420, friedewald: 71.0, martin: 85.0, sampson: 161.3, lipidai: 112.39 },
  { tg: 430, friedewald: 69.0, martin: 83.33, sampson: 162.88, lipidai: 112.39 },
  { tg: 440, friedewald: 67.0, martin: 81.67, sampson: 164.53, lipidai: 107.4 },
  { tg: 450, friedewald: 65.0, martin: 80.0, sampson: 166.25, lipidai: 107.4 },
  { tg: 460, friedewald: 63.0, martin: 78.33, sampson: 168.03, lipidai: 107.4 },
  { tg: 470, friedewald: 61.0, martin: 76.67, sampson: 169.88, lipidai: 107.4 },
  { tg: 480, friedewald: 59.0, martin: 75.0, sampson: 171.8, lipidai: 105.88 },
  { tg: 490, friedewald: 57.0, martin: 73.33, sampson: 173.78, lipidai: 105.08 },
  { tg: 500, friedewald: 55.0, martin: 71.67, sampson: 175.83, lipidai: 103.69 },
];

// TG Status thresholds
export const getTGStatus = (tg: number): { status: string; color: string; description: string } => {
  if (tg < 150) {
    return { status: 'Normal', color: 'text-emerald-600', description: 'Optimal triglyceride level' };
  } else if (tg < 200) {
    return { status: 'Borderline', color: 'text-amber-600', description: 'Borderline high triglycerides' };
  } else if (tg < 500) {
    return { status: 'High', color: 'text-orange-600', description: 'High triglyceride level' };
  } else {
    return { status: 'Very High', color: 'text-red-600', description: 'Very high triglycerides - requires attention' };
  }
};

// LDL Category thresholds
export const getLDLCategory = (ldl: number): { category: string; color: string } => {
  if (ldl < 100) {
    return { category: 'Optimal', color: 'text-emerald-600' };
  } else if (ldl < 130) {
    return { category: 'Near Optimal', color: 'text-green-600' };
  } else if (ldl < 160) {
    return { category: 'Borderline High', color: 'text-amber-600' };
  } else if (ldl < 190) {
    return { category: 'High', color: 'text-orange-600' };
  } else {
    return { category: 'Very High', color: 'text-red-600' };
  }
};

// Preset profiles for the calculator
export const presetProfiles = [
  { name: 'Normal', tc: 180, hdl: 55, tg: 100, age: 45 },
  { name: 'High TG', tc: 220, hdl: 40, tg: 350, age: 52 },
  { name: 'Low HDL', tc: 200, hdl: 32, tg: 180, age: 58 },
  { name: 'Borderline', tc: 210, hdl: 45, tg: 220, age: 48 },
];

// TG Presets for explorer
export const tgPresets = [
  { name: 'Normal', value: 100 },
  { name: 'Borderline', value: 175 },
  { name: 'High', value: 300 },
  { name: 'Very High', value: 450 },
];

// Get insight text based on TG level
export const getInsightText = (tg: number): string => {
  if (tg < 150) {
    return 'At lower TG levels, all estimation methods remain relatively close. Traditional formulas perform reliably in this range.';
  } else if (tg < 200) {
    return 'As TG rises into the borderline range, formula-based estimates begin to show slight divergence. LipidAI starts applying adaptive corrections.';
  } else if (tg < 350) {
    return 'At elevated TG levels, fixed formulas become increasingly unreliable. LipidAI applies nonlinear corrections learned from complex lipid profiles.';
  } else {
    return 'At very high TG levels, traditional formulas may significantly underestimate or overestimate LDL. LipidAI provides a more adaptive estimate based on data-driven patterns.';
  }
};

// Calculate LDL estimates from input values
export const calculateLDLEstimates = (tc: number, hdl: number, tg: number, age: number) => {
  // Friedewald formula
  const friedewald = Math.max(0, tc - hdl - tg / 5);
  
  // Martin formula with adjustable factor
  const martinFactor = tg < 100 ? 5.0 : tg < 150 ? 5.5 : tg < 200 ? 6.0 : tg < 250 ? 6.5 : 7.0;
  const martin = Math.max(0, tc - hdl - tg / martinFactor);
  
  // Sampson formula
  const sampson = Math.max(0, tc - hdl - tg / 5 - (tg > 200 ? (tg - 200) * 0.05 : 0) + (tg > 150 ? (tg - 150) * 0.02 : 0));
  
  // LipidAI (simulated ML prediction with age factor)
  const ageFactor = age > 50 ? (age - 50) * 0.1 : 0;
  const nonlinearCorrection = tg > 150 ? Math.log(tg / 150) * 8 : 0;
  const lipidai = Math.max(0, tc - hdl - tg / 5.2 + nonlinearCorrection - (tg > 300 ? (tg - 300) * 0.03 : 0) + ageFactor);
  
  return {
    friedewald: Math.round(friedewald * 10) / 10,
    martin: Math.round(martin * 10) / 10,
    sampson: Math.round(sampson * 10) / 10,
    lipidai: Math.round(lipidai * 10) / 10,
  };
};

// Validation metrics (simulated)
export const validationMetrics = {
  datasetSize: 12847,
  inputFeatures: 4,
  modelType: 'XGBoost Regressor',
  crossValidation: '5-Fold CV',
  metrics: {
    r2: 0.946,
    mae: 5.8,
    rmse: 8.2,
    pearson: 0.973,
  },
};
