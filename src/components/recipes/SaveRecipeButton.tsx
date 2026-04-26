
import { Button } from "@/components/ui/button";
import { BookmarkPlus } from "lucide-react";
import { SpoonacularRecipeDetails } from "@/services/spoonacularService";
import { useSavedRecipes } from "@/hooks/useSavedRecipes";
import { useToast } from "@/hooks/use-toast";

interface SaveRecipeButtonProps {
  recipe: SpoonacularRecipeDetails;
}

const SaveRecipeButton = ({ recipe }: SaveRecipeButtonProps) => {
  const { saveRecipe } = useSavedRecipes();
  const { toast } = useToast();

  const handleSaveRecipe = async () => {
    try {
      await saveRecipe(recipe);
      toast({
        title: "Recipe saved",
        description: "You can find it in your saved recipes"
      });
    } catch (error) {
      console.error("Error saving recipe:", error);
      toast({
        title: "Error",
        description: "Failed to save recipe",
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      onClick={handleSaveRecipe}
      variant="outline"
      className="gap-2"
    >
      <BookmarkPlus className="h-4 w-4" />
      Save Recipe
    </Button>
  );
};

export default SaveRecipeButton;
