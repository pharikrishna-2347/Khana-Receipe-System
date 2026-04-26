
import { useState } from 'react';
import { Star, StarHalf, StarOff, MessageSquare, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useRecipeRatings } from '@/hooks/useRecipeRatings';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface RecipeRatingsProps {
  recipeId: string;
}

export function RecipeRatings({ recipeId }: RecipeRatingsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { ratings, isLoading, isSubmitting, submitRating, averageRating } = useRecipeRatings({
    recipeId,
  });
  
  const [selectedRating, setSelectedRating] = useState(0);
  const [review, setReview] = useState('');
  const [isWritingReview, setIsWritingReview] = useState(false);

  const handleRatingSubmit = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to rate this recipe.",
        variant: "destructive",
      });
      return;
    }

    if (selectedRating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    submitRating({ rating: selectedRating, review: review.trim() || undefined });
    setSelectedRating(0);
    setReview('');
    setIsWritingReview(false);
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const StarIcon = star <= rating ? Star : star - rating === 0.5 ? StarHalf : StarOff;
          return (
            <button
              key={star}
              onClick={() => interactive && setSelectedRating(star)}
              className={cn(
                "text-primary transition-colors",
                interactive && "hover:text-primary/80 cursor-pointer",
                !interactive && "cursor-default"
              )}
              disabled={!interactive}
            >
              <StarIcon className="w-5 h-5" />
            </button>
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="h-20 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Reviews ({ratings.length})</span>
          {averageRating > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-normal">Average:</span>
              {renderStars(averageRating)}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!user && (
          <Alert variant="default" className="bg-muted/50 mb-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>
              Please sign in to rate and review this recipe.
            </AlertDescription>
          </Alert>
        )}
        
        {user && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {renderStars(selectedRating, true)}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsWritingReview(!isWritingReview)}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Add Review
              </Button>
            </div>
            
            {isWritingReview && (
              <div className="space-y-4">
                <Textarea
                  placeholder="Write your review here..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsWritingReview(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleRatingSubmit}
                    disabled={isSubmitting}
                  >
                    Submit Review
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="space-y-4">
          {ratings.length > 0 ? (
            ratings.map((rating) => (
              <div key={rating.id} className="border-b border-border pb-4 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  {renderStars(rating.rating)}
                  <span className="text-sm text-muted-foreground">
                    {new Date(rating.created_at).toLocaleDateString()}
                  </span>
                </div>
                {rating.review && (
                  <p className="text-sm text-muted-foreground">{rating.review}</p>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-2">
                No reviews yet. Be the first to review this recipe!
              </p>
              <Alert variant="default" className="bg-muted/30 border-muted">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription className="text-sm">
                  The rating system requires setup in the database. Currently it's in development mode.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
