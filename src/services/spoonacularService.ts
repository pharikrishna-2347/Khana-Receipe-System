/**
 * Service for interacting with Spoonacular API to get recipe information
 */

import { Recipe, recipes as localRecipes } from '@/utils/recipeData';

const SPOONACULAR_API_KEY = "5230d94cd5ef43a59544eef9127c53aa";

export interface SpoonacularRecipe {
  id: number;
  title: string;
  image: string;
  imageType: string;
}

export interface SpoonacularRecipeDetails {
  id: number;
  title: string;
  image: string;
  summary: string;
  instructions: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
  cuisines: string[];
  dishTypes: string[];
  diets: string[];
  analyzedInstructions: {
    name: string;
    steps: {
      number: number;
      step: string;
      ingredients: {
        id: number;
        name: string;
        localizedName: string;
        image: string;
      }[];
    }[];
  }[];
  extendedIngredients: {
    id: number;
    aisle: string;
    image: string;
    name: string;
    amount: number;
    unit: string;
    originalString: string;
  }[];
  nutrition: {
    nutrients: {
      name: string;
      amount: number;
      unit: string;
    }[];
  };
}

export interface GroceryItem {
  id: number;
  name: string;
  amount: number;
  unit: string;
  aisle: string;
  image: string;
}

// Utility function to convert local recipes to Spoonacular format
const mapLocalToSpoonacularFormat = (recipes: Recipe[], query: string): SpoonacularRecipe[] => {
  return recipes
    .filter(recipe => 
      recipe.title.toLowerCase().includes(query.toLowerCase()) || 
      recipe.category.toLowerCase().includes(query.toLowerCase())
    )
    .map(recipe => ({
      id: parseInt(recipe.id),
      title: recipe.title,
      image: recipe.imageUrl,
      imageType: 'jpg'
    }));
};

export const getRandomRecipes = async (number: number = 8): Promise<SpoonacularRecipe[]> => {
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/random?number=${number}&apiKey=${SPOONACULAR_API_KEY}`
    );

    if (!response.ok) {
      console.error('Error getting random recipes:', await response.text());
      console.log('Falling back to local recipe data for random recipes');
      return localRecipes.slice(0, number).map(recipe => ({
        id: parseInt(recipe.id),
        title: recipe.title,
        image: recipe.imageUrl,
        imageType: 'jpg'
      }));
    }

    const data = await response.json();
    return data.recipes.map((recipe: any) => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      imageType: 'jpg'
    }));
  } catch (error) {
    console.error('Error in getRandomRecipes:', error);
    console.log('Falling back to local recipe data for random recipes');
    return localRecipes.slice(0, number).map(recipe => ({
      id: parseInt(recipe.id),
      title: recipe.title,
      image: recipe.imageUrl,
      imageType: 'jpg'
    }));
  }
};

export const searchRecipesByName = async (query: string): Promise<SpoonacularRecipe[]> => {
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(
        query
      )}&apiKey=${SPOONACULAR_API_KEY}&number=8`
    );

    if (!response.ok) {
      console.error('Error searching recipes:', await response.text());
      console.log('Falling back to local recipe data for search:', query);
      return mapLocalToSpoonacularFormat(localRecipes, query);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error in searchRecipesByName:', error);
    console.log('Falling back to local recipe data for search:', query);
    return mapLocalToSpoonacularFormat(localRecipes, query);
  }
};

export const searchRecipesByIngredients = async (ingredients: string): Promise<SpoonacularRecipe[]> => {
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(
        ingredients
      )}&apiKey=${SPOONACULAR_API_KEY}&number=8`
    );

    if (!response.ok) {
      console.error('Error searching recipes by ingredients:', await response.text());
      console.log('Falling back to local recipe data for ingredients:', ingredients);
      return mapLocalToSpoonacularFormat(localRecipes, ingredients);
    }

    const data = await response.json();
    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      image: item.image,
      imageType: 'jpg'
    }));
  } catch (error) {
    console.error('Error in searchRecipesByIngredients:', error);
    console.log('Falling back to local recipe data for ingredients:', ingredients);
    return mapLocalToSpoonacularFormat(localRecipes, ingredients);
  }
};

// Mock recipe details from local data
const createMockRecipeDetails = (recipeId: number): SpoonacularRecipeDetails | null => {
  const localRecipe = localRecipes.find(r => parseInt(r.id) === recipeId);
  if (!localRecipe) return null;
  
  return {
    id: parseInt(localRecipe.id),
    title: localRecipe.title,
    image: localRecipe.imageUrl,
    summary: localRecipe.description,
    instructions: "This is a placeholder for recipe instructions. In a real implementation, this would contain detailed cooking steps.",
    readyInMinutes: localRecipe.cookingTime,
    servings: 4,
    sourceUrl: "",
    cuisines: [localRecipe.category],
    dishTypes: [localRecipe.category],
    diets: [],
    analyzedInstructions: [{
      name: "",
      steps: [
        {
          number: 1,
          step: "Prepare all ingredients",
          ingredients: []
        },
        {
          number: 2,
          step: "Follow cooking instructions for the recipe",
          ingredients: []
        }
      ]
    }],
    extendedIngredients: [
      {
        id: 1,
        aisle: "Produce",
        image: "",
        name: "Sample Ingredient 1",
        amount: 2,
        unit: "cups",
        originalString: "2 cups of Sample Ingredient 1"
      },
      {
        id: 2,
        aisle: "Spices",
        image: "",
        name: "Sample Ingredient 2",
        amount: 1,
        unit: "tbsp",
        originalString: "1 tablespoon of Sample Ingredient 2"
      }
    ],
    nutrition: {
      nutrients: [
        {
          name: "Calories",
          amount: 350,
          unit: "kcal"
        },
        {
          name: "Protein",
          amount: 15,
          unit: "g"
        }
      ]
    }
  };
};

export const getRecipeDetails = async (id: number): Promise<SpoonacularRecipeDetails | null> => {
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${SPOONACULAR_API_KEY}&includeNutrition=true`
    );

    if (!response.ok) {
      console.error('Error getting recipe details:', await response.text());
      console.log('Falling back to local recipe data for details, ID:', id);
      return createMockRecipeDetails(id);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getRecipeDetails:', error);
    console.log('Falling back to local recipe data for details, ID:', id);
    return createMockRecipeDetails(id);
  }
};

// Generate a grocery list from recipe IDs
export const generateGroceryList = async (recipeIds: number[]): Promise<GroceryItem[]> => {
  try {
    if (recipeIds.length === 0) {
      return [];
    }

    const idsParam = recipeIds.join(',');
    const response = await fetch(
      `https://api.spoonacular.com/recipes/informationBulk?ids=${idsParam}&apiKey=${SPOONACULAR_API_KEY}`
    );

    if (!response.ok) {
      console.error('Error getting recipe information:', await response.text());
      return generateMockGroceryList();
    }

    const recipes = await response.json();
    
    // Extract ingredients from all recipes and consolidate
    const groceryMap = new Map<string, GroceryItem>();
    
    recipes.forEach((recipe: any) => {
      if (recipe.extendedIngredients) {
        recipe.extendedIngredients.forEach((ingredient: any) => {
          const key = ingredient.name.toLowerCase();
          
          if (groceryMap.has(key)) {
            // If ingredient already exists, update the amount
            const existingItem = groceryMap.get(key)!;
            existingItem.amount += ingredient.amount;
          } else {
            // Otherwise add new ingredient
            groceryMap.set(key, {
              id: ingredient.id || Math.floor(Math.random() * 10000),
              name: ingredient.name,
              amount: ingredient.amount,
              unit: ingredient.unit,
              aisle: ingredient.aisle || 'Other',
              image: ingredient.image || `https://spoonacular.com/cdn/ingredients_100x100/${key}.jpg`
            });
          }
        });
      }
    });
    
    return Array.from(groceryMap.values());
  } catch (error) {
    console.error('Error generating grocery list:', error);
    return generateMockGroceryList();
  }
};

// Generate a mock grocery list for fallback
const generateMockGroceryList = (): GroceryItem[] => {
  return [
    { id: 1, name: 'Avocados', amount: 2, unit: '', aisle: 'Produce', image: 'https://spoonacular.com/cdn/ingredients_100x100/avocado.jpg' },
    { id: 2, name: 'Black beans', amount: 1, unit: 'can', aisle: 'Canned Goods', image: 'https://spoonacular.com/cdn/ingredients_100x100/black-beans.jpg' },
    { id: 3, name: 'Cherry tomatoes', amount: 1, unit: 'pint', aisle: 'Produce', image: 'https://spoonacular.com/cdn/ingredients_100x100/cherry-tomatoes.jpg' },
    { id: 4, name: 'Red onion', amount: 1, unit: '', aisle: 'Produce', image: 'https://spoonacular.com/cdn/ingredients_100x100/red-onion.jpg' },
    { id: 5, name: 'Cilantro', amount: 1, unit: 'bunch', aisle: 'Produce', image: 'https://spoonacular.com/cdn/ingredients_100x100/cilantro.jpg' },
    { id: 6, name: 'Olive oil', amount: 0.25, unit: 'cup', aisle: 'Oil, Vinegar, Salad Dressing', image: 'https://spoonacular.com/cdn/ingredients_100x100/olive-oil.jpg' },
    { id: 7, name: 'Lime', amount: 2, unit: '', aisle: 'Produce', image: 'https://spoonacular.com/cdn/ingredients_100x100/lime.jpg' },
    { id: 8, name: 'Spaghetti', amount: 8, unit: 'oz', aisle: 'Pasta and Rice', image: 'https://spoonacular.com/cdn/ingredients_100x100/spaghetti.jpg' },
    { id: 9, name: 'Kalamata olives', amount: 0.5, unit: 'cup', aisle: 'Canned Goods', image: 'https://spoonacular.com/cdn/ingredients_100x100/kalamata-olives.jpg' },
    { id: 10, name: 'Feta cheese', amount: 4, unit: 'oz', aisle: 'Dairy', image: 'https://spoonacular.com/cdn/ingredients_100x100/feta-cheese.jpg' },
    { id: 11, name: 'Garlic', amount: 1, unit: 'head', aisle: 'Produce', image: 'https://spoonacular.com/cdn/ingredients_100x100/garlic.jpg' },
    { id: 12, name: 'Red pepper flakes', amount: 1, unit: 'tsp', aisle: 'Spices and Seasonings', image: 'https://spoonacular.com/cdn/ingredients_100x100/red-pepper-flakes.jpg' },
    { id: 13, name: 'Salmon fillets', amount: 4, unit: '', aisle: 'Seafood', image: 'https://spoonacular.com/cdn/ingredients_100x100/salmon.jpg' },
    { id: 14, name: 'Soy sauce', amount: 0.25, unit: 'cup', aisle: 'Condiments', image: 'https://spoonacular.com/cdn/ingredients_100x100/soy-sauce.jpg' },
    { id: 15, name: 'Honey', amount: 2, unit: 'tbsp', aisle: 'Condiments', image: 'https://spoonacular.com/cdn/ingredients_100x100/honey.jpg' },
  ];
};

// Get recipe IDs from the meal plan
export const getRecipeIdsFromMealPlan = (mealPlan: {[key: string]: Recipe | null}): number[] => {
  return Object.values(mealPlan)
    .filter((recipe): recipe is Recipe => recipe !== null)
    .map(recipe => parseInt(recipe.id))
    .filter(id => !isNaN(id));
};

// New function to get recipe images from Spoonacular
export const getRecipeImageFromSpoonacular = async (recipeName: string): Promise<string> => {
  try {
    console.log('Fetching image for recipe:', recipeName);
    
    // Try to find an exact or close match for the recipe
    const response = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(
        recipeName
      )}&apiKey=${SPOONACULAR_API_KEY}&number=1`
    );

    if (!response.ok) {
      console.error('Error getting recipe image:', await response.text());
      // Fallback to a more generic search
      return getGenericFoodImage(recipeName);
    }

    const data = await response.json();
    console.log('Spoonacular image search results:', data);
    
    if (data.results && data.results.length > 0) {
      console.log('Found image for', recipeName, ':', data.results[0].image);
      return data.results[0].image;
    } else {
      console.log('No exact match found, trying more generic search');
      return getGenericFoodImage(recipeName);
    }
  } catch (error) {
    console.error('Error in getRecipeImageFromSpoonacular:', error);
    return getGenericFoodImage(recipeName);
  }
};

// Helper function to get generic food images
const getGenericFoodImage = async (foodName: string): Promise<string> => {
  try {
    // Try with just the main part of the recipe name (e.g., "Curry" instead of "Butternut Squash Curry")
    const simplifiedName = simplifyRecipeName(foodName);
    console.log('Trying simplified name search:', simplifiedName);
    
    const response = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(
        simplifiedName
      )}&apiKey=${SPOONACULAR_API_KEY}&number=1`
    );

    if (!response.ok) {
      throw new Error('Generic search also failed');
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      console.log('Found generic image for', foodName, ':', data.results[0].image);
      return data.results[0].image;
    }
    
    // If all else fails, use Unsplash
    return `https://source.unsplash.com/random/800x600/?${encodeURIComponent(foodName)},food,cooking`;
  } catch (error) {
    console.log('Falling back to Unsplash for', foodName);
    return `https://source.unsplash.com/random/800x600/?${encodeURIComponent(foodName)},food,cooking`;
  }
};

// Helper to simplify recipe names for better image matching
const simplifyRecipeName = (recipeName: string): string => {
  // Extract main food item from complex recipe names
  const mainFoodItems = recipeName.split(/\s+and\s+|\s+with\s+|\s*\(\s*|\s*\)\s*/).filter(Boolean);
  const simplifiedName = mainFoodItems[0].trim().split(' ').slice(-2).join(' ');
  return simplifiedName || recipeName;
};
