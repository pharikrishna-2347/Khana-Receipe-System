
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import { getFilteredRecipes, Recipe, searchRecipes } from '@/utils/recipeData';
import { getRandomRecipes, SpoonacularRecipe } from '@/services/spoonacularService';

import SearchSection from '@/components/home/SearchSection';
import RecipesSection from '@/components/home/RecipesSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import MealPlanningSection from '@/components/home/MealPlanningSection';
import FeaturedRecipesCarousel from '@/components/home/FeaturedRecipesCarousel';
import { PreferencesForm } from '@/components/recipes/PreferencesForm';
import { AiRecipeSuggestions } from '@/components/recipes/AiRecipeSuggestions';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [recipes, setRecipes] = useState<Recipe[]>(getFilteredRecipes('All'));
  const [showPreferences, setShowPreferences] = useState(false);
  const { user } = useAuth();
  
  const { data: randomSpoonacularRecipes, isLoading, error } = useQuery({
    queryKey: ['randomRecipes'],
    queryFn: () => getRandomRecipes(3), 
  });

  useEffect(() => {
    if (error) {
      toast.error("Could not load random recipes. Using fallback data.");
      console.error("Error loading random recipes:", error);
    }
  }, [error]);
  
  const convertedRandomRecipes: Recipe[] = randomSpoonacularRecipes?.map((spoonRecipe: SpoonacularRecipe) => ({
    id: spoonRecipe.id.toString(),
    title: spoonRecipe.title,
    description: "Discover this delightful recipe from our curated collection.",
    imageUrl: spoonRecipe.image,
    cookingTime: Math.floor(Math.random() * 30) + 15, // Random cooking time between 15-45 min
    category: "Featured",
    ingredients: [],
    instructions: [],
    nutritionFacts: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    }
  })) || [];

  const handleSearch = (query: string, type: 'recipe' | 'ingredient') => {
    const results = searchRecipes(query, type);
    setRecipes(results);
    setActiveCategory('All');
  };

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    setRecipes(getFilteredRecipes(category));
  };

  const resetRecipes = () => {
    setActiveCategory('All');
    setRecipes(getFilteredRecipes('All'));
  };

  return (
    <Layout>
      <Hero />
      
      <SearchSection 
        activeCategory={activeCategory}
        onCategorySelect={handleCategorySelect}
        onSearch={handleSearch}
      />
      
      <div className="container px-4 md:px-6">
        {user && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Recipe Preferences</h2>
              <Button 
                variant="ghost" 
                onClick={() => setShowPreferences(!showPreferences)}
              >
                {showPreferences ? 'Hide' : 'Show'} Preferences
              </Button>
            </div>
            
            {showPreferences && <PreferencesForm />}
            
            <div className="mt-12">
              <AiRecipeSuggestions />
            </div>
          </div>
        )}

        <RecipesSection 
          recipes={isLoading ? [] : (convertedRandomRecipes.length > 0 ? convertedRandomRecipes : recipes)}
          emptyRecipesHandler={resetRecipes} 
          isLoading={isLoading}
        />
      </div>
      
      <FeaturesSection />
      
      <MealPlanningSection />

      <FeaturedRecipesCarousel recipes={recipes} />
    </Layout>
  );
};

export default Index;
