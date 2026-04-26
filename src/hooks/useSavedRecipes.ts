
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SpoonacularRecipeDetails } from '@/services/spoonacularService';
import { useAuth } from '@/contexts/AuthContext';

export interface SavedRecipe {
  id: string;
  recipe_id: string;
  recipe_data: SpoonacularRecipeDetails;
  notes?: string;
  is_favorite: boolean;
  created_at: string;
}

export const useSavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchSavedRecipes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('saved_recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Convert the JSON data from Supabase to our SavedRecipe type
      const typedData: SavedRecipe[] = (data || []).map(item => ({
        id: item.id,
        recipe_id: item.recipe_id,
        recipe_data: item.recipe_data as unknown as SpoonacularRecipeDetails,
        notes: item.notes || undefined,
        is_favorite: !!item.is_favorite,
        created_at: item.created_at
      }));
      
      setSavedRecipes(typedData);
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
      toast({
        title: "Error",
        description: "Failed to load your saved recipes",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveRecipe = async (recipe: SpoonacularRecipeDetails) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save recipes",
        variant: "destructive"
      });
      return;
    }

    try {
      // Convert SpoonacularRecipeDetails to a plain object that Supabase can handle
      const recipeData = {
        recipe_id: recipe.id.toString(),
        recipe_data: recipe as unknown as Record<string, any>,
        user_id: user.id
      };
      
      const { error } = await supabase
        .from('saved_recipes')
        .insert(recipeData);

      if (error) throw error;

      toast({
        title: "Recipe saved",
        description: "Recipe has been added to your collection"
      });

      await fetchSavedRecipes();
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast({
        title: "Error",
        description: "Failed to save recipe",
        variant: "destructive"
      });
    }
  };

  const toggleFavorite = async (recipeId: string, isFavorite: boolean) => {
    try {
      const { error } = await supabase
        .from('saved_recipes')
        .update({ is_favorite: !isFavorite })
        .eq('id', recipeId);

      if (error) throw error;

      toast({
        title: !isFavorite ? "Added to favorites" : "Removed from favorites",
        description: !isFavorite ? "Recipe marked as favorite" : "Recipe removed from favorites"
      });

      await fetchSavedRecipes();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive"
      });
    }
  };

  const removeRecipe = async (recipeId: string) => {
    try {
      const { error } = await supabase
        .from('saved_recipes')
        .delete()
        .eq('id', recipeId);

      if (error) throw error;

      toast({
        title: "Recipe removed",
        description: "Recipe has been removed from your collection"
      });

      await fetchSavedRecipes();
    } catch (error) {
      console.error('Error removing recipe:', error);
      toast({
        title: "Error",
        description: "Failed to remove recipe",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchSavedRecipes();
  }, [user]);

  return {
    savedRecipes,
    isLoading,
    saveRecipe,
    toggleFavorite,
    removeRecipe,
    fetchSavedRecipes
  };
};
