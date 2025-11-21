const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const MealPlan = require('../models/MealPlan'); // we will create this model next
const User = require('../models/User');
const { generateMealPlanForUser } = require('../services/aiService');

router.post('/generate', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { weekStart } = req.body;
    const generated = await generateMealPlanForUser(user, weekStart ? new Date(weekStart) : new Date());
    // Save minimal plan object in DB directly (to keep this step short)
    const plan = { userId: user._id, weekStart: weekStart || new Date(), days: generated.days, createdAt: new Date(), source: 'ai' };
    // If you haven't created a MealPlan model, just return the generated object
    res.json({ saved: false, plan: combinedPlan = plan, groceryList: generated.groceryList || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
