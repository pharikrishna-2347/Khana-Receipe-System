export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  cookingTime: number;
  category: string;
  ingredients: string[];
  instructions: string[];
  nutritionFacts: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

// Mock data for initial app development
export const recipes: Recipe[] = [
  {
    id: "1",
    title: "Avocado & Black Bean Bowl",
    description: "A refreshing salad with creamy avocados and protein-rich black beans, topped with a tangy lime dressing.",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
    cookingTime: 15,
    category: "Salad",
    ingredients: [
      "2 ripe avocados, diced",
      "1 can black beans, rinsed and drained",
      "1 cup cherry tomatoes, halved",
      "1/2 red onion, finely diced",
      "1/4 cup cilantro, chopped",
      "2 tbsp olive oil",
      "1 lime, juiced",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Combine avocados, black beans, tomatoes, red onion, and cilantro in a large bowl.",
      "In a small bowl, whisk together olive oil, lime juice, salt, and pepper.",
      "Pour dressing over the salad and toss gently to combine.",
      "Serve immediately or chill for up to 1 hour before serving."
    ],
    nutritionFacts: {
      calories: 380,
      protein: 12,
      carbs: 35,
      fat: 22
    }
  },
  {
    id: "2",
    title: "Mediterranean Pasta",
    description: "Delicious pasta with olives, feta cheese, cherry tomatoes, and fresh herbs in a light olive oil sauce.",
    imageUrl: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
    cookingTime: 25,
    category: "Pasta",
    ingredients: [
      "8 oz spaghetti or linguine",
      "1/2 cup Kalamata olives, pitted and halved",
      "4 oz feta cheese, crumbled",
      "1 cup cherry tomatoes, halved",
      "1/4 cup fresh basil, chopped",
      "3 tbsp olive oil",
      "2 cloves garlic, minced",
      "1/4 tsp red pepper flakes",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Cook pasta according to package directions. Drain and reserve 1/2 cup pasta water.",
      "In a large skillet, heat olive oil over medium heat. Add garlic and red pepper flakes and cook for 1 minute.",
      "Add tomatoes and cook until slightly softened, about 2 minutes.",
      "Add cooked pasta, olives, and a splash of pasta water. Toss to combine.",
      "Remove from heat and stir in feta cheese and basil. Season with salt and pepper.",
      "Serve warm, garnished with additional basil if desired."
    ],
    nutritionFacts: {
      calories: 450,
      protein: 14,
      carbs: 55,
      fat: 19
    }
  },
  {
    id: "3",
    title: "Teriyaki Salmon Bowl",
    description: "Perfectly glazed salmon with a sweet and savory teriyaki sauce, served over steamed rice with fresh vegetables.",
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
    cookingTime: 30,
    category: "Seafood",
    ingredients: [
      "4 salmon fillets (6 oz each)",
      "1/4 cup soy sauce",
      "2 tbsp mirin",
      "2 tbsp honey",
      "1 tbsp grated ginger",
      "2 cloves garlic, minced",
      "2 cups steamed rice",
      "1 cup broccoli florets, steamed",
      "1 cup carrots, julienned",
      "1 avocado, sliced",
      "1 tbsp sesame seeds",
      "2 green onions, sliced"
    ],
    instructions: [
      "In a small saucepan, combine soy sauce, mirin, honey, ginger, and garlic. Bring to a simmer and cook until slightly thickened, about 5 minutes.",
      "Preheat oven to 400°F (200°C). Place salmon on a lined baking sheet.",
      "Brush salmon with half the teriyaki sauce. Bake for 12-15 minutes, or until salmon flakes easily.",
      "Divide rice among 4 bowls. Top with salmon, broccoli, carrots, and avocado.",
      "Drizzle with remaining sauce and garnish with sesame seeds and green onions."
    ],
    nutritionFacts: {
      calories: 520,
      protein: 35,
      carbs: 45,
      fat: 22
    }
  },
  {
    id: "4",
    title: "Southern Vegetable Curry",
    description: "A rich and aromatic vegetable curry made with seasonal vegetables and flavorful spices in a creamy coconut base.",
    imageUrl: "https://images.unsplash.com/photo-1604328471151-b82684152c7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3270&q=80",
    cookingTime: 40,
    category: "Curry",
    ingredients: [
      "2 tbsp vegetable oil",
      "1 onion, diced",
      "3 cloves garlic, minced",
      "1 tbsp grated ginger",
      "2 tbsp curry powder",
      "1 tsp turmeric",
      "1 tsp cumin",
      "1/4 tsp cayenne pepper",
      "1 can (14 oz) coconut milk",
      "1 cup vegetable broth",
      "2 cups mixed vegetables (cauliflower, carrots, peas)",
      "1 can (14 oz) chickpeas, drained",
      "Salt to taste",
      "Fresh cilantro for garnish",
      "Cooked rice for serving"
    ],
    instructions: [
      "Heat oil in a large pot over medium heat. Add onion and cook until softened, about 5 minutes.",
      "Add garlic and ginger, cook for 1 minute until fragrant.",
      "Stir in curry powder, turmeric, cumin, and cayenne. Cook for 30 seconds until spices are fragrant.",
      "Add coconut milk and vegetable broth, bring to a simmer.",
      "Add vegetables and chickpeas. Simmer for 15-20 minutes until vegetables are tender.",
      "Season with salt to taste. Serve over rice, garnished with fresh cilantro."
    ],
    nutritionFacts: {
      calories: 420,
      protein: 10,
      carbs: 45,
      fat: 25
    }
  },
  {
    id: "5",
    title: "Mediterranean Quinoa Bowl",
    description: "A protein-rich quinoa bowl with roasted vegetables, feta cheese, and a tangy lemon dressing.",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
    cookingTime: 25,
    category: "Vegetarian",
    ingredients: [
      "1 cup quinoa, rinsed",
      "2 cups vegetable broth",
      "1 zucchini, diced",
      "1 red bell pepper, diced",
      "1 yellow bell pepper, diced",
      "1 red onion, sliced",
      "2 tbsp olive oil",
      "1 tsp dried oregano",
      "1/2 cup feta cheese, crumbled",
      "1/4 cup kalamata olives, pitted and halved",
      "2 tbsp fresh lemon juice",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Cook quinoa in vegetable broth according to package directions. Let cool slightly.",
      "Preheat oven to 425°F (220°C). Toss zucchini, bell peppers, and onion with olive oil, oregano, salt, and pepper.",
      "Roast vegetables for 20 minutes, stirring halfway through, until tender and slightly charred.",
      "Combine cooked quinoa and roasted vegetables in a large bowl.",
      "Add feta cheese, olives, and lemon juice. Toss gently to combine.",
      "Season with additional salt and pepper if needed. Serve warm or at room temperature."
    ],
    nutritionFacts: {
      calories: 320,
      protein: 11,
      carbs: 42,
      fat: 14
    }
  },
  {
    id: "6",
    title: "Maple Glazed Salmon",
    description: "Perfectly seared salmon fillets with a sweet and savory maple glaze, served with roasted vegetables.",
    imageUrl: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
    cookingTime: 25,
    category: "Seafood",
    ingredients: [
      "4 salmon fillets (6 oz each)",
      "3 tbsp maple syrup",
      "2 tbsp soy sauce",
      "1 tbsp Dijon mustard",
      "1 clove garlic, minced",
      "1 tsp fresh ginger, grated",
      "1 tbsp olive oil",
      "Salt and pepper to taste",
      "1 lemon, cut into wedges",
      "Fresh herbs for garnish"
    ],
    instructions: [
      "Preheat oven to 400°F (200°C).",
      "In a small bowl, whisk together maple syrup, soy sauce, Dijon mustard, garlic, and ginger.",
      "Pat salmon fillets dry and season with salt and pepper.",
      "Heat olive oil in an oven-safe skillet over medium-high heat. Add salmon, skin side down, and sear for 3 minutes.",
      "Brush the maple glaze over the salmon fillets.",
      "Transfer the skillet to the oven and bake for 8-10 minutes, until salmon is cooked through.",
      "Drizzle with remaining glaze and garnish with fresh herbs and lemon wedges."
    ],
    nutritionFacts: {
      calories: 380,
      protein: 34,
      carbs: 18,
      fat: 19
    }
  },
  {
    id: "7",
    title: "Spicy Chickpea Tacos",
    description: "Flavorful plant-based tacos filled with spiced chickpeas, fresh vegetables, and a zesty lime crema.",
    imageUrl: "https://images.unsplash.com/photo-1464219222984-216ebffaaf85?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
    cookingTime: 20,
    category: "Vegan",
    ingredients: [
      "2 cans (15 oz each) chickpeas, drained and rinsed",
      "2 tbsp olive oil",
      "1 tbsp chili powder",
      "1 tsp cumin",
      "1 tsp smoked paprika",
      "1/2 tsp garlic powder",
      "1/4 tsp cayenne pepper (optional)",
      "Salt to taste",
      "8 small corn tortillas",
      "1 avocado, sliced",
      "1 cup shredded red cabbage",
      "1/4 cup red onion, diced",
      "1/4 cup cilantro, chopped",
      "Lime wedges for serving"
    ],
    instructions: [
      "In a large skillet, heat olive oil over medium heat. Add chickpeas and spices. Cook for 8-10 minutes, stirring occasionally, until chickpeas are golden and slightly crispy.",
      "Warm tortillas according to package directions.",
      "Fill each tortilla with spiced chickpeas, avocado slices, shredded cabbage, red onion, and cilantro.",
      "Serve with lime wedges on the side."
    ],
    nutritionFacts: {
      calories: 310,
      protein: 11,
      carbs: 45,
      fat: 12
    }
  },
  {
    id: "8",
    title: "Classic Tiramisu",
    description: "A traditional Italian dessert made with layers of coffee-soaked ladyfingers and mascarpone cream.",
    imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
    cookingTime: 30,
    category: "Dessert",
    ingredients: [
      "6 egg yolks",
      "3/4 cup granulated sugar",
      "2/3 cup milk",
      "1 1/4 cups heavy cream",
      "1 tsp vanilla extract",
      "1 lb (16 oz) mascarpone cheese",
      "1 cup strong brewed coffee, cooled",
      "2 tbsp coffee liqueur (optional)",
      "24 ladyfinger cookies",
      "2 tbsp unsweetened cocoa powder",
      "Dark chocolate shavings for garnish"
    ],
    instructions: [
      "In a medium saucepan, whisk together egg yolks and sugar until well blended. Whisk in milk and cook over medium heat, stirring constantly, until mixture boils. Boil gently for 1 minute, then remove from heat and allow to cool slightly.",
      "Cover tightly and chill in refrigerator for 1 hour.",
      "In a medium bowl, beat cream with vanilla until stiff peaks form.",
      "Whisk mascarpone into the yolk mixture until smooth.",
      "Gently fold in the whipped cream into the mascarpone mixture.",
      "In a small bowl, combine coffee and coffee liqueur. Dip ladyfingers into coffee mixture, about 1 second per side.",
      "Arrange half of the soaked ladyfingers in the bottom of a 9x9 inch baking dish.",
      "Spread half of the mascarpone mixture over the ladyfingers. Repeat with remaining ladyfingers and mascarpone mixture.",
      "Cover and refrigerate for at least 4 hours or overnight.",
      "Before serving, dust with cocoa powder and garnish with chocolate shavings."
    ],
    nutritionFacts: {
      calories: 420,
      protein: 7,
      carbs: 38,
      fat: 28
    }
  }
];

export const categories = [
  "All",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Salad",
  "Pasta", 
  "Pizza",
  "Rice",
  "Seafood",
  "Vegan",
  "Vegetarian",
  "Dessert",
  "North",
  "South",
  "Curry"
];

// Filter recipes by category
export const getFilteredRecipes = (categoryName: string): Recipe[] => {
  if (categoryName === 'All') {
    return recipes;
  }
  return recipes.filter(recipe => recipe.category === categoryName);
};

// Search recipes by query
export const searchRecipes = (query: string, type: 'recipe' | 'ingredient'): Recipe[] => {
  const searchTerm = query.toLowerCase().trim();
  
  if (!searchTerm) return recipes;
  
  return recipes.filter(recipe => {
    if (type === 'recipe') {
      // Search by recipe name, category, or description
      return (
        recipe.title.toLowerCase().includes(searchTerm) ||
        recipe.category.toLowerCase().includes(searchTerm) ||
        recipe.description.toLowerCase().includes(searchTerm)
      );
    } else {
      // Search by ingredients
      return recipe.ingredients.some(ingredient => 
        ingredient.toLowerCase().includes(searchTerm)
      );
    }
  });
};

// Get recipe by ID
export const getRecipeById = (id: string): Recipe | undefined => {
  return recipes.find(recipe => recipe.id === id);
};
