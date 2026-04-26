import { supabase } from "@/integrations/supabase/client";
import { getRecipeImageFromSpoonacular } from "./spoonacularService";

// Use environment variable or fallback to checking localStorage if needed
const getGeminiApiKey = () => {
  const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  // Check if key exists in environment variables
  if (envApiKey) {
    return envApiKey;
  }
  
  // Fallback to localStorage if the user stored it there
  const localStorageKey = localStorage.getItem('GEMINI_API_KEY');
  if (localStorageKey) {
    return localStorageKey;
  }
  
  return null;
};

const GEMINI_API_KEY = getGeminiApiKey();
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export const generateRecipeImage = async (recipeName: string): Promise<string> => {
  try {
    // Get a more reliable image by using specific food-related terms
    const keywords = recipeName.split(' ').slice(0, 2).join(',');
    return `https://source.unsplash.com/featured/800x600/?food,${encodeURIComponent(keywords)},cooking,meal`;
  } catch (error) {
    console.error('Error in generateRecipeImage:', error);
    return `https://source.unsplash.com/featured/800x600/?${encodeURIComponent(recipeName)},food`;
  }
};

export const generatePersonalizedRecipeRecommendations = async (userId: string) => {
  try {
    // Get API key with our new function
    const apiKey = getGeminiApiKey();
    
    // Check if API key exists
    if (!apiKey) {
      console.error('Gemini API key is not available');
      throw new Error('API key is missing. Please add your Gemini API key in project settings or reload the page if you just added it.');
    }

    // Fetch user preferences
    const { data: preferences, error: prefsError } = await supabase
      .from('user_preferences')
      .select('dietary_preferences, favorite_cuisines, cooking_skill_level')
      .eq('user_id', userId)
      .single();

    if (prefsError) {
      console.error('Error fetching user preferences:', prefsError);
      throw new Error('Could not fetch your preferences');
    }

    if (!preferences) {
      console.warn('No preferences found for user');
      throw new Error('No preferences found. Please set your dietary preferences, cuisines, and skill level.');
    }

    // Verify preferences have some content
    if ((!preferences.dietary_preferences || preferences.dietary_preferences.length === 0) && 
        (!preferences.favorite_cuisines || preferences.favorite_cuisines.length === 0) && 
        !preferences.cooking_skill_level) {
      throw new Error('Please set at least some dietary preferences, favorite cuisines, or cooking skill level');
    }

    // Construct AI prompt based on user preferences
    const prompt = `As a culinary expert, generate 5 unique and creative recipe recommendations for a user with these preferences:
    - Dietary Preferences: ${preferences.dietary_preferences?.join(', ') || 'None specified'}
    - Favorite Cuisines: ${preferences.favorite_cuisines?.join(', ') || 'None specified'}
    - Cooking Skill Level: ${preferences.cooking_skill_level || 'Intermediate'}

    For each recipe, provide:
    - Recipe Name: [name]
    - Short Description: [2-3 sentences about taste, texture, and appeal]
    - Difficulty Level: [level]
    - Estimated Cooking Time: [time]
    - Primary Ingredients: [5-7 key ingredients]

    Make sure recipes are practical, flavorful, and match the user's skill level and dietary needs. 
    Do not include markdown formatting like asterisks or bullet points in your response.
    Do not number or prefix recipes with "Recipe 1:", "Recipe 2:", etc.`;

    console.log('Sending request to Gemini API with prompt:', prompt);
    console.log('Using API key (first 4 chars):', apiKey.substring(0, 4) + '...');

    const response = await fetch(
      `${GEMINI_API_URL}?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error generating recipe recommendations:', errorText);
      throw new Error('Failed to generate recipes. API request failed.');
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
      console.error('Unexpected API response structure:', data);
      throw new Error('Received invalid response from the API');
    }
    
    const recommendations = data.candidates[0].content.parts[0].text;

    if (!recommendations || recommendations.trim().length === 0) {
      console.error('Empty recommendations received');
      throw new Error('Received empty recommendations from the API');
    }

    console.log('Raw recommendations received:', recommendations);

    // Improved parsing logic to extract recipes correctly
    const recipes = [];
    
    // Split by Recipe Name pattern to get individual recipe blocks
    const recipeBlocks = recommendations.split(/Recipe Name:|^\d+\.|Recipe \d+:/m)
      .filter(block => block && block.trim().length > 0);
    
    // Process each recipe block
    for (const block of recipeBlocks) {
      try {
        // Clean up the block
        const cleanBlock = block.trim();
        
        // Parse recipe details
        const nameMatch = cleanBlock.match(/^\s*(.+?)(?:\n|$)/);
        const descMatch = cleanBlock.match(/Short Description:?\s*(.+?)(?:\n|Difficulty Level:|$)/is);
        const difficultyMatch = cleanBlock.match(/Difficulty Level:?\s*(.+?)(?:\n|Estimated Cooking Time:|$)/i);
        const timeMatch = cleanBlock.match(/Estimated Cooking Time:?\s*(.+?)(?:\n|Primary Ingredients:|$)/i);
        const ingredientsMatch = cleanBlock.match(/Primary Ingredients:?\s*(.+?)(?:\n\n|$)/is);
        
        if (!nameMatch) continue; // Skip if no name found
        
        // Clean up any numbering or "Recipe X:" prefixes in the name
        let name = nameMatch[1].replace(/\*/g, '').trim();
        name = name.replace(/^Recipe \d+:\s*/, ''); // Remove "Recipe X:" prefix
        name = name.replace(/^\d+\.\s*/, ''); // Remove numbering 
        
        // Construct recipe object
        const recipe = {
          name,
          description: descMatch 
            ? descMatch[1].replace(/\*/g, '').trim() 
            : "A delicious recipe tailored to your preferences.",
          difficulty: difficultyMatch 
            ? difficultyMatch[1].replace(/\*/g, '').trim() 
            : "Intermediate",
          cookingTime: timeMatch 
            ? timeMatch[1].replace(/\*/g, '').trim() 
            : "30 minutes",
          ingredients: ingredientsMatch 
            ? ingredientsMatch[1].split(/,|\n/).map(ing => ing.replace(/\*/g, '').trim()).filter(Boolean)
            : [],
          instructions: [
            "Prepare all ingredients as listed.",
            "Follow cooking instructions for the recipe.",
            "Serve hot and enjoy your meal."
          ]
        };
        
        // If the recipe name looks like "Recipe X" without a proper name, skip it
        if (/^Recipe \d+$/.test(recipe.name)) continue;
        
        recipes.push(recipe);
      } catch (error) {
        console.error('Error parsing recipe block:', error);
      }
    }
    
    // Fallback if parsing failed
    if (recipes.length === 0) {
      throw new Error('Could not parse any recipes from the response');
    }
    
    // Use Spoonacular API for images instead of Unsplash
    const recipesWithImagePromises = recipes.slice(0, 3).map(async (recipe, index) => {
      try {
        console.log(`Fetching image for recipe ${index + 1}: ${recipe.name}`);
        const imageUrl = await getRecipeImageFromSpoonacular(recipe.name);
        return { 
          ...recipe, 
          imageUrl 
        };
      } catch (err) {
        console.error(`Error getting image for recipe ${recipe.name}:`, err);
        // Fallback to Unsplash with more specific food-related tags
        const keywords = recipe.name.split(' ').slice(0, 2).join(',');
        return { 
          ...recipe, 
          imageUrl: `https://source.unsplash.com/featured/800x600/?food,${encodeURIComponent(keywords)},dish,meal,cooking` 
        };
      }
    });

    const recipesWithImages = await Promise.all(recipesWithImagePromises);

    console.log('Parsed recipes with images from Spoonacular:', recipesWithImages);
    return recipesWithImages;
  } catch (error) {
    console.error('Unexpected error in recipe recommendations:', error);
    throw error; // Rethrow to let the component handle it
  }
};
