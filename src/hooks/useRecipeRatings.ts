import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface RecipeRating {
  id: string;
  user_id: string;
  recipe_id: string;
  rating: number;
  review: string | null;
  created_at: string;
  updated_at: string;
}

interface UseRecipeRatingsProps {
  recipeId: string;
}

export function useRecipeRatings({ recipeId }: UseRecipeRatingsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const { data: ratings = [], isLoading } = useQuery({
    queryKey: ['recipe-ratings', recipeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_recipe_ratings', { recipe_id_param: recipeId } as never)
        .returns<RecipeRating[]>();

      if (error) {
        console.error('Error fetching ratings:', error);
        return [];
      }
      
      return data || [];
    },
  });

  const { mutate: submitRating } = useMutation({
    mutationFn: async ({ rating, review }: { rating: number; review?: string }) => {
      if (!user) {
        throw new Error('User must be authenticated to submit a rating');
      }
      
      setIsSubmitting(true);
      
      const { data, error } = await supabase
        .rpc('submit_recipe_rating', {
          recipe_id_param: recipeId,
          user_id_param: user.id,
          rating_param: rating,
          review_param: review || null
        } as never);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipe-ratings', recipeId] });
      toast({
        title: "Success",
        description: "Your rating has been submitted!",
      });
    },
    onError: (error: any) => {
      console.error('Error submitting rating:', error);
      toast({
        title: "Rating Submission Failed",
        description: "Unable to submit your rating. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const averageRating = ratings.length > 0
    ? parseFloat((ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length).toFixed(1))
    : 0;

  return {
    ratings,
    isLoading,
    isSubmitting,
    submitRating,
    averageRating,
  };
}
