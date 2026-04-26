
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SpoonacularRecipeDetails, getRecipeDetails } from '@/services/spoonacularService';
import { Clock, Users, ChevronLeft, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import NutritionCalculator from '@/components/recipes/NutritionCalculator';
import SaveRecipeButton from '@/components/recipes/SaveRecipeButton';
import { useAuth } from '@/contexts/AuthContext';
import { RecipeRatings } from '@/components/recipes/RecipeRatings';

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [recipe, setRecipe] = useState<SpoonacularRecipeDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        // Check if this is an AI-generated recipe (ID starts with 'ai-recipe-')
        if (id.startsWith('ai-recipe-')) {
          // AI recipes are stored as URL params, we can't fetch them directly
          toast({
            title: "AI Recipe",
            description: "This is an AI-generated recipe suggestion. Full details aren't available yet.",
            variant: "default"
          });
          setIsLoading(false);
          return;
        }
        
        // For regular recipes, fetch from Spoonacular
        const recipeId = parseInt(id);
        if (isNaN(recipeId)) {
          throw new Error('Invalid recipe ID');
        }
        
        const details = await getRecipeDetails(recipeId);
        setRecipe(details);
      } catch (error) {
        console.error('Error fetching recipe details:', error);
        toast({
          title: "Error",
          description: "Failed to load recipe details. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id, toast]);

  const getNutrientValue = (name: string) => {
    if (!recipe?.nutrition?.nutrients) return "N/A";
    
    const nutrient = recipe.nutrition.nutrients.find(n => n.name.toLowerCase() === name.toLowerCase());
    if (!nutrient) return "N/A";
    
    return `${Math.round(nutrient.amount)}${nutrient.unit}`;
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Parse AI recipe ID to extract name if applicable
  const getAIRecipeName = () => {
    if (!id || !id.startsWith('ai-recipe-')) return null;
    
    // Format: ai-recipe-{index}-{recipe-name-slug}
    const parts = id.split('-');
    if (parts.length < 4) return null;
    
    // Remove the first 3 parts (ai-recipe-{index}) and join the rest with spaces
    return parts.slice(3).join(' ').replace(/-/g, ' ');
  };

  const aiRecipeName = getAIRecipeName();

  return (
    <Layout>
      <div className="container px-4 py-8 mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="flex items-center text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to recipes
          </Button>
        </motion.div>

        {isLoading ? (
          <div className="w-full space-y-4">
            <div className="w-full h-[400px] bg-muted rounded-xl animate-pulse" />
            <div className="h-10 w-3/4 bg-muted rounded animate-pulse" />
            <div className="h-6 w-1/2 bg-muted rounded animate-pulse" />
            <div className="h-40 bg-muted rounded animate-pulse" />
          </div>
        ) : aiRecipeName ? (
          // Render for AI-generated recipe
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold mb-6">{aiRecipeName}</h1>
              <div className="bg-muted p-8 rounded-lg max-w-md mx-auto">
                <p className="text-lg mb-6">
                  This is an AI-generated recipe suggestion. Full recipe details aren't available yet.
                </p>
                <p className="text-muted-foreground mb-8">
                  You can view more personalized recipe suggestions on the home page.
                </p>
                <Button 
                  onClick={() => navigate('/')}
                  className="bg-primary-blue hover:bg-primary-blue/90"
                >
                  Back to Home
                </Button>
              </div>
            </motion.div>
          </div>
        ) : recipe ? (
          // Regular recipe view from Spoonacular
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="grid md:grid-cols-2 gap-8"
            >
              <motion.div 
                className="relative rounded-2xl overflow-hidden shadow-xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src={recipe.image} 
                  alt={recipe.title} 
                  className="w-full h-auto object-cover rounded-2xl" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </motion.div>

              <div className="space-y-6">
                <div>
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-4xl font-bold mb-3"
                  >
                    {recipe.title}
                  </motion.h1>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex flex-wrap gap-3 mb-4"
                  >
                    {recipe.cuisines && recipe.cuisines.length > 0 && (
                      recipe.cuisines.map((cuisine, index) => (
                        <span key={index} className="bg-primary-blue/10 text-primary-blue px-3 py-1 rounded-full text-sm">
                          {cuisine}
                        </span>
                      ))
                    )}
                    {recipe.dishTypes && recipe.dishTypes.length > 0 && (
                      recipe.dishTypes.slice(0, 3).map((type, index) => (
                        <span key={index} className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm">
                          {type}
                        </span>
                      ))
                    )}
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex gap-6 mb-6"
                  >
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-muted-foreground mr-2" />
                      <span className="text-muted-foreground">{recipe.readyInMinutes} min</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-muted-foreground mr-2" />
                      <span className="text-muted-foreground">{recipe.servings} servings</span>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="prose dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: recipe.summary }}
                  />
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="bg-muted/30 rounded-xl p-5 grid grid-cols-4 gap-3 text-center"
                >
                  <div>
                    <p className="text-sm text-muted-foreground">Calories</p>
                    <p className="font-bold text-lg">{getNutrientValue('calories')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Protein</p>
                    <p className="font-bold text-lg">{getNutrientValue('protein')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Carbs</p>
                    <p className="font-bold text-lg">{getNutrientValue('carbohydrates')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fat</p>
                    <p className="font-bold text-lg">{getNutrientValue('fat')}</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.5 }}>
              <Tabs defaultValue="ingredients" className="w-full">
                <TabsList className="w-full max-w-md mx-auto grid grid-cols-4">
                  <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                  <TabsTrigger value="instructions">Instructions</TabsTrigger>
                  <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="ingredients" className="mt-6">
                  <motion.ul 
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid md:grid-cols-2 gap-x-6 gap-y-2"
                  >
                    {recipe.extendedIngredients?.map((ingredient, index) => (
                      <motion.li 
                        key={ingredient.id || index} 
                        variants={item}
                        className="flex items-start py-2 border-b border-border/30 last:border-0"
                      >
                        <Check className="h-5 w-5 text-primary-blue mr-3 mt-0.5 flex-shrink-0" />
                        <span>
                          {ingredient.amount} {ingredient.unit} {ingredient.name}
                        </span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </TabsContent>
                
                <TabsContent value="instructions" className="mt-6">
                  {recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0 ? (
                    <motion.ol 
                      variants={container}
                      initial="hidden"
                      animate="show"
                      className="space-y-4 list-decimal list-inside"
                    >
                      {recipe.analyzedInstructions[0].steps.map((step) => (
                        <motion.li 
                          key={step.number} 
                          variants={item}
                          className="p-4 bg-muted/30 rounded-lg"
                        >
                          <span className="font-medium">Step {step.number}:</span> {step.step}
                        </motion.li>
                      ))}
                    </motion.ol>
                  ) : (
                    <div className="p-6 text-center bg-muted/30 rounded-lg">
                      <p className="text-muted-foreground">No detailed instructions available.</p>
                      {recipe.instructions && (
                        <div 
                          className="mt-4 text-left prose dark:prose-invert max-w-none"
                          dangerouslySetInnerHTML={{ __html: recipe.instructions }}
                        />
                      )}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="nutrition" className="mt-6">
                  {user && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <SaveRecipeButton recipe={recipe} />
                    </motion.div>
                  )}
                  <NutritionCalculator
                    nutritionFacts={{
                      calories: recipe.nutrition?.nutrients?.find(n => n.name.toLowerCase() === 'calories')?.amount || 0,
                      protein: recipe.nutrition?.nutrients?.find(n => n.name.toLowerCase() === 'protein')?.amount || 0,
                      carbs: recipe.nutrition?.nutrients?.find(n => n.name.toLowerCase() === 'carbohydrates')?.amount || 0,
                      fat: recipe.nutrition?.nutrients?.find(n => n.name.toLowerCase() === 'fat')?.amount || 0
                    }}
                    servingSize={recipe.servings || 1}
                  />
                </TabsContent>
                
                <TabsContent value="reviews" className="mt-6">
                  <RecipeRatings recipeId={id || ''} />
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-2">Recipe not found</h2>
            <p className="text-muted-foreground mb-6">The recipe you're looking for doesn't exist or has been removed.</p>
            <Button 
              onClick={() => navigate('/recipes')}
              className="bg-primary-blue hover:bg-primary-blue/90"
            >
              Browse all recipes
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RecipeDetails;
