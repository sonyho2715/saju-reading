import type { ChartAnalysis, Element } from '../types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface WellnessPlan {
  primaryElement: string;
  secondaryElement: string;
  minimizeElement: string;
  diet: {
    favorable: { food: string; reason: string }[];
    minimize: { food: string; reason: string }[];
  };
  exercise: {
    recommended: string[];
    reason: string;
  };
  colors: {
    wear: string[];
    use: string;
    avoid: string[];
    avoidReason: string;
  };
  crystals: {
    crystal: string;
    benefit: string;
  }[];
  dailyRituals: string[];
  seasonalAdvice: string;
}

// ---------------------------------------------------------------------------
// Element-based mappings
// ---------------------------------------------------------------------------

const ELEMENT_FOODS: Record<string, { favorable: { food: string; reason: string }[]; minimize: { food: string; reason: string }[] }> = {
  Wood: {
    favorable: [
      { food: 'Green vegetables and leafy greens', reason: 'Wood energy nourishes liver and detoxifies' },
      { food: 'Sprouts and fresh herbs', reason: 'Growing food channels spring energy' },
      { food: 'Sour foods like lemon and vinegar', reason: 'Sour taste activates Wood element' },
      { food: 'Green tea', reason: 'Supports Wood element clarity and growth' },
    ],
    minimize: [
      { food: 'Excessive spicy foods', reason: 'Metal energy (spicy) controls Wood' },
      { food: 'Too much raw food', reason: 'Can deplete digestive fire needed to support Wood' },
    ],
  },
  Fire: {
    favorable: [
      { food: 'Red foods like tomatoes, peppers, berries', reason: 'Fire energy activates circulation and joy' },
      { food: 'Bitter foods and dark chocolate', reason: 'Bitter taste nourishes the heart (Fire organ)' },
      { food: 'Beets and red beans', reason: 'Support blood and cardiovascular Fire energy' },
      { food: 'Warm cooked meals', reason: 'Maintain internal warmth and Fire balance' },
    ],
    minimize: [
      { food: 'Excessive cold or icy drinks', reason: 'Water energy extinguishes Fire' },
      { food: 'Too much salty food', reason: 'Salt activates Water, which controls Fire' },
    ],
  },
  Earth: {
    favorable: [
      { food: 'Sweet potatoes and root vegetables', reason: 'Earth energy grounds and stabilizes digestion' },
      { food: 'Grains like rice, oats, millet', reason: 'Grains are the quintessential Earth food' },
      { food: 'Pumpkin and squash', reason: 'Yellow-orange foods strengthen Earth (spleen/stomach)' },
      { food: 'Naturally sweet foods like dates', reason: 'Sweet taste nourishes Earth element' },
    ],
    minimize: [
      { food: 'Excessive sour foods', reason: 'Sour (Wood) energy can overwhelm Earth' },
      { food: 'Too much raw or cold food', reason: 'Weakens the digestive Earth fire' },
    ],
  },
  Metal: {
    favorable: [
      { food: 'White foods like garlic, ginger, radish', reason: 'Metal energy purifies lungs and strengthens immunity' },
      { food: 'Rice and daikon', reason: 'White staples support Metal element clarity' },
      { food: 'Onion and scallion', reason: 'Pungent taste activates Metal circulation' },
      { food: 'Fermented foods', reason: 'Support gut health connected to Metal (lung-large intestine)' },
    ],
    minimize: [
      { food: 'Excessive bitter foods', reason: 'Fire (bitter) melts Metal energy' },
      { food: 'Too much greasy or fried food', reason: 'Clogs Metal element flow' },
    ],
  },
  Water: {
    favorable: [
      { food: 'Seaweed and ocean foods', reason: 'Water energy deepens wisdom and kidney vitality' },
      { food: 'Black beans and black sesame', reason: 'Dark foods nourish Water element (kidneys)' },
      { food: 'Blueberries and mushrooms', reason: 'Support deep nourishment and Water resilience' },
      { food: 'Kidney beans and walnuts', reason: 'Kidney-shaped foods directly nourish Water organ' },
    ],
    minimize: [
      { food: 'Excessive sweet or sugary foods', reason: 'Earth (sweet) controls Water flow' },
      { food: 'Too much dry or dehydrating food', reason: 'Depletes Water element reserves' },
    ],
  },
};

const ELEMENT_EXERCISE: Record<string, { exercises: string[]; reason: string }> = {
  Wood: { exercises: ['Yoga', 'Stretching', 'Hiking', 'Forest bathing', 'Tai chi'], reason: 'Wood thrives with flexible, nature-connected movement' },
  Fire: { exercises: ['HIIT', 'Dancing', 'Team sports', 'Hot yoga', 'Running'], reason: 'Fire needs intense, social, heart-pumping activities' },
  Earth: { exercises: ['Walking', 'Strength training', 'Pilates', 'Grounding exercises'], reason: 'Earth benefits from steady, grounding, rhythmic movement' },
  Metal: { exercises: ['Breathing exercises', 'Swimming', 'Martial arts', 'Cycling'], reason: 'Metal needs disciplined, breath-focused, precise movement' },
  Water: { exercises: ['Meditation', 'Gentle yoga', 'Swimming', 'Qi gong'], reason: 'Water thrives with flowing, reflective, calm practices' },
};

const ELEMENT_COLORS: Record<string, { wear: string[]; use: string; avoid: string[] }> = {
  Wood: { wear: ['green', 'teal', 'turquoise'], use: 'Wear for growth and new beginnings', avoid: ['white', 'silver'] },
  Fire: { wear: ['red', 'orange', 'pink', 'purple'], use: 'Wear for passion and visibility', avoid: ['black', 'dark blue'] },
  Earth: { wear: ['yellow', 'brown', 'beige', 'terracotta'], use: 'Wear for stability and focus', avoid: ['green', 'teal'] },
  Metal: { wear: ['white', 'silver', 'gold', 'gray'], use: 'Wear for clarity and precision', avoid: ['red', 'orange'] },
  Water: { wear: ['black', 'navy', 'dark blue'], use: 'Wear for wisdom and depth', avoid: ['yellow', 'brown'] },
};

const ELEMENT_CRYSTALS: Record<string, { crystal: string; benefit: string }[]> = {
  Wood: [
    { crystal: 'Green Aventurine', benefit: 'Growth, luck, and opportunity' },
    { crystal: 'Malachite', benefit: 'Transformation and protection' },
    { crystal: 'Jade', benefit: 'Harmony, balance, and prosperity' },
  ],
  Fire: [
    { crystal: 'Carnelian', benefit: 'Confidence, creativity, and motivation' },
    { crystal: 'Ruby', benefit: 'Passion, courage, and vitality' },
    { crystal: 'Sunstone', benefit: 'Joy, leadership, and personal power' },
  ],
  Earth: [
    { crystal: 'Citrine', benefit: 'Abundance and manifestation' },
    { crystal: "Tiger's Eye", benefit: 'Stability, willpower, and protection' },
    { crystal: 'Jasper', benefit: 'Nurturing and grounding energy' },
  ],
  Metal: [
    { crystal: 'Clear Quartz', benefit: 'Clarity, amplification, and focus' },
    { crystal: 'Selenite', benefit: 'Purification and spiritual connection' },
    { crystal: 'Pyrite', benefit: 'Abundance and sharp mental energy' },
  ],
  Water: [
    { crystal: 'Lapis Lazuli', benefit: 'Wisdom, truth, and intuition' },
    { crystal: 'Amethyst', benefit: 'Intuition and spiritual awareness' },
    { crystal: 'Aquamarine', benefit: 'Calm, courage, and clear communication' },
  ],
};

const ELEMENT_RITUALS: Record<string, string[]> = {
  Wood: [
    'Morning stretch routine facing East',
    'Tend to a plant or garden as meditation',
    'Journal about growth goals each morning',
    'Walk among trees for at least 20 minutes',
  ],
  Fire: [
    'Light a candle during morning intention setting',
    'Practice gratitude for 3 things before bed',
    'Engage in creative expression daily (art, music, writing)',
    'Connect with someone socially each day',
  ],
  Earth: [
    'Eat mindfully at a set table without screens',
    'Spend 10 minutes organizing one area of your space',
    'Ground yourself by walking barefoot on earth',
    'Practice centering breathing (4-7-8 technique)',
  ],
  Metal: [
    'Practice deep breathing for 5 minutes upon waking',
    'Declutter one small area daily',
    'End each day with a brief review of accomplishments',
    'Polish or clean something meaningful to you',
  ],
  Water: [
    'Meditate near water or with water sounds for 10 minutes',
    'Take a mindful bath or shower as a cleansing ritual',
    'Spend quiet time in reflection before sleep',
    'Drink warm water with intention each morning',
  ],
};

const ELEMENT_SEASONS: Record<string, string> = {
  Wood: 'Spring is your power season. Use it for launching new ventures. Conserve energy in autumn (Metal season) when your element is naturally suppressed.',
  Fire: 'Summer amplifies your energy. Channel it into creative and social pursuits. Be extra mindful during winter (Water season) to maintain warmth.',
  Earth: 'The transitions between seasons (especially late summer) are your peak times. Stay grounded during spring (Wood season) when change is rapid.',
  Metal: 'Autumn is your power season. Use it for completion, harvest, and refinement. Be patient during summer (Fire season) when your element is challenged.',
  Water: 'Winter deepens your natural wisdom. Use it for planning and strategy. Stay hydrated and rested during late summer (Earth season).',
};

// ---------------------------------------------------------------------------
// Generator
// ---------------------------------------------------------------------------

export function generateWellnessPlan(chart: ChartAnalysis): WellnessPlan {
  const usefulGod = chart.usefulGod as string;
  const jealousyGod = chart.jealousyGod as string;

  // Primary = Useful God element, Secondary = element that generates Useful God
  const generatingElements: Record<string, string> = {
    Wood: 'Water', Fire: 'Wood', Earth: 'Fire', Metal: 'Earth', Water: 'Metal',
  };
  const secondaryElement = generatingElements[usefulGod] ?? 'Earth';

  const foods = ELEMENT_FOODS[usefulGod] ?? ELEMENT_FOODS['Earth'];
  const jealousyFoods = ELEMENT_FOODS[jealousyGod] ?? ELEMENT_FOODS['Earth'];
  const exercise = ELEMENT_EXERCISE[usefulGod] ?? ELEMENT_EXERCISE['Earth'];
  const colors = ELEMENT_COLORS[usefulGod] ?? ELEMENT_COLORS['Earth'];
  const jealousyColors = ELEMENT_COLORS[jealousyGod] ?? ELEMENT_COLORS['Earth'];
  const crystals = ELEMENT_CRYSTALS[usefulGod] ?? ELEMENT_CRYSTALS['Earth'];
  const rituals = ELEMENT_RITUALS[usefulGod] ?? ELEMENT_RITUALS['Earth'];
  const seasonal = ELEMENT_SEASONS[usefulGod] ?? ELEMENT_SEASONS['Earth'];

  return {
    primaryElement: usefulGod,
    secondaryElement,
    minimizeElement: jealousyGod,
    diet: {
      favorable: foods.favorable,
      minimize: jealousyFoods.favorable.map(f => ({
        food: f.food,
        reason: `${jealousyGod} energy food. Minimize to reduce Jealousy God influence.`,
      })),
    },
    exercise: {
      recommended: exercise.exercises,
      reason: exercise.reason,
    },
    colors: {
      wear: colors.wear,
      use: colors.use,
      avoid: jealousyColors.wear,
      avoidReason: `${jealousyGod} element colors may amplify unfavorable energy`,
    },
    crystals,
    dailyRituals: rituals,
    seasonalAdvice: seasonal,
  };
}
