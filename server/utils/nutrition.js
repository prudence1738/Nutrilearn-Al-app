function bmrMifflin(profile) {
  const { sex, age } = profile;
  const weight = profile.weightKg;
  const height = profile.heightCm;
  if (!weight || !height || !age) return null;
  if (sex === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

function tdee(bmr, activity) {
  const map = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };
  return Math.round(bmr * (map[activity] || 1.2));
}

function calorieTarget(profile) {
  const bmr = bmrMifflin(profile);
  if (!bmr) return null;
  const base = tdee(bmr, profile.activityLevel);
  if (profile.goal === 'lose') return Math.round(base - 500);
  if (profile.goal === 'gain') return Math.round(base + 400);
  return Math.round(base);
}

module.exports = { bmrMifflin, tdee, calorieTarget };
