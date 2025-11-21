const OpenAI = require('openai');
const { calorieTarget } = require('../utils/nutrition');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function validatePlan(plan, targetCalories, allergies = []) {
  if (!plan || !Array.isArray(plan.days)) throw new Error('Invalid plan structure');
  const tolerance = 0.08;
  for (const day of plan.days) {
    if (typeof day.totalCalories !== 'number') throw new Error('Missing totalCalories for a day');
    const low = Math.round(targetCalories * (1 - tolerance));
    const high = Math.round(targetCalories * (1 + tolerance));
    if (day.totalCalories < low || day.totalCalories > high) {
      throw new Error(`Day ${day.date} calories ${day.totalCalories} outside allowed range ${low}-${high}`);
    }
    for (const meal of day.meals || []) {
      for (const ing of meal.ingredients || []) {
        const name = (ing.name || '').toLowerCase();
        for (const a of allergies) {
          if (!a) continue;
          if (name.includes(a.toLowerCase())) {
            throw new Error(`Allergen detected in ingredient "${ing.name}" on ${day.date}`);
          }
        }
      }
    }
  }
  return true;
}

async function generateMealPlanForUser(user, weekStart = new Date()) {
  const target = calorieTarget(user.profile) || 2000;

  const system = `
You are a helpful nutrition assistant that MUST respond only with valid JSON (no markdown, no extra text).
Return a JSON object with keys: "days" (array of 7 objects) and "groceryList" (array of strings).
Each day object must be:
{
  "date": "YYYY-MM-DD",
  "meals": [
    {
      "name": "string",
      "recipe": "string (short steps)",
      "ingredients": [{ "name": "string", "qty": "string" }],
      "calories": integer,
      "proteinG": integer,
      "carbsG": integer,
      "fatG": integer
    }
  ],
  "totalCalories": integer
}
Produce exactly 7 days starting at the provided weekStart. Respect allergies and preferences.
`;

  const userMessage = {
    age: user.profile.age,
    sex: user.profile.sex,
    heightCm: user.profile.heightCm,
    weightKg: user.profile.weightKg,
    activityLevel: user.profile.activityLevel,
    goal: user.profile.goal,
    targetCalories: target,
    preferences: user.profile.preferences || {},
    allergies: user.profile.allergies || [],
    weekStart: (new Date(weekStart)).toISOString().split('T')[0]
  };

  const messages = [
    { role: 'system', content: system },
    { role: 'user', content: `Profile JSON: ${JSON.stringify(userMessage)}\nReturn the JSON object described above.` }
  ];

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const resp = await client.chat.completions.create({
    model,
    messages,
    max_tokens: 2000,
    temperature: 0.2
  });

  const text = resp.choices?.[0]?.message?.content;
  if (!text) throw new Error('Empty response from LLM');

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      const substring = text.slice(firstBrace, lastBrace + 1);
      try {
        parsed = JSON.parse(substring);
      } catch (err2) {
        throw new Error('LLM returned non-JSON output and parsing failed');
      }
    } else {
      throw new Error('LLM returned non-JSON output and no JSON object found');
    }
  }

  validatePlan(parsed, target, user.profile.allergies || []);
  return parsed;
}

module.exports = { generateMealPlanForUser };
