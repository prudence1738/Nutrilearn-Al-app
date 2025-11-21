const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  age: Number,
  sex: { type: String, enum: ['male','female','other'], default: 'other' },
  heightCm: Number,
  weightKg: Number,
  activityLevel: { type: String, enum: ['sedentary','light','moderate','active','very_active'], default: 'moderate' },
  allergies: [String],
  preferences: { vegetarian: Boolean, vegan: Boolean, pescatarian: Boolean, keto: Boolean },
  goal: { type: String, enum: ['lose','maintain','gain'], default: 'maintain' },
  targetWeightKg: Number
});

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, enum: ['user','expert','admin'], default: 'user' },
  profile: ProfileSchema,
  aiPreferences: { caloricFlex: { type: Number, default: 100 }, dislikedIngredients: [String] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
