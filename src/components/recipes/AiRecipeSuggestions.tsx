
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { generatePersonalizedRecipeRecommendations } from '@/services/geminiService';
import RecipeCard from '@/components/RecipeCard';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle, Settings, Clock, UtensilsCrossed } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Skeleton } from '@/components/ui/skeleton';

interface Recipe {
  name: string;
  description: string;
  difficulty: string;
  cookingTime: string;
  ingredients: string[];
  imageUrl?: string;
  instructions?: string[];
}

export const AiRecipeSuggestions = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPrefs, setShowPrefs] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('GEMINI_API_KEY') || '');
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [expandedRecipeIndex, setExpandedRecipeIndex] = useState<number | null>(null);
  const [imageLoadErrors, setImageLoadErrors] = useState<{[key: string]: boolean}>({});
  const [imageFallbacks, setImageFallbacks] = useState<{[key: string]: string}>({});

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('GEMINI_API_KEY', apiKey.trim());
      setApiKeyDialogOpen(false);
      toast.success('API key saved. Refreshing recipes...');
      setTimeout(fetchSuggestions, 500);
    } else {
      toast.error('Please enter a valid API key');
    }
  };

  const fetchSuggestions = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    setImageLoadErrors({});
    setImageFallbacks({});
    
    try {
      const recommendations = await generatePersonalizedRecipeRecommendations(user.id);
      console.log('Received recommendations:', recommendations);
      // Only take the first 3 recipes
      setRecipes(recommendations.slice(0, 3));
      toast.success(`Generated ${Math.min(recommendations.length, 3)} personalized recipes`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch recipe suggestions';
      console.error('Error fetching recipe suggestions:', err);
      setError(errorMessage);
      
      if (errorMessage.includes('API key')) {
        setApiKeyDialogOpen(true);
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSuggestions();
    }
  }, [user]);

  if (!user) {
    return null;
  }

  const togglePrefsView = () => {
    setShowPrefs(prev => !prev);
  };

  const toggleRecipeDetails = (index: number) => {
    setExpandedRecipeIndex(expandedRecipeIndex === index ? null : index);
  };

  const handleImageError = (recipeName: string, index: number) => {
    console.log(`Image load error for ${recipeName}`);
    
    setImageLoadErrors(prev => ({
      ...prev,
      [`${index}-${recipeName}`]: true
    }));
    
    // Create a more specific fallback with multiple food-related terms
    const keywords = recipeName.split(' ').slice(0, 2).join(',');
    const fallbackUrl = `https://source.unsplash.com/featured/800x600/?food,${encodeURIComponent(keywords)},dish,meal`;
    
    setImageFallbacks(prev => ({
      ...prev,
      [`${index}-${recipeName}`]: fallbackUrl
    }));
  };

  const getImageUrl = (recipe: Recipe, index: number) => {
    const key = `${index}-${recipe.name}`;
    
    if (imageFallbacks[key]) {
      return imageFallbacks[key];
    }
    
    if (imageLoadErrors[key] || !recipe.imageUrl) {
      // More diverse food-related terms for better results
      const keywords = recipe.name.split(' ').slice(0, 2).join(',');
      return `https://source.unsplash.com/featured/800x600/?food,${encodeURIComponent(keywords)},dish,meal`;
    }
    
    return recipe.imageUrl;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Personalized Recipe Suggestions</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={togglePrefsView}
          >
            <Settings className="h-4 w-4 mr-2" />
            {showPrefs ? 'Hide' : 'Show'} Preferences
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSuggestions}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[300px] rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16 bg-muted rounded-lg border border-border">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-xl font-medium text-destructive mb-2">{error}</p>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Make sure you've set your preferences and that your Gemini API key is configured correctly.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={fetchSuggestions} variant="default">
              Try Again
            </Button>
            {!showPrefs && (
              <Button onClick={togglePrefsView} variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Update Preferences
              </Button>
            )}
            <Button onClick={() => setApiKeyDialogOpen(true)} variant="outline">
              Set API Key
            </Button>
          </div>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {recipes.length > 0 ? (
            recipes.map((recipe, index) => (
              <RecipeCard
                key={`${recipe.name}-${index}`}
                id={`ai-recipe-${index}-${recipe.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')}`}
                title={recipe.name}
                description={recipe.description}
                imageUrl={getImageUrl(recipe, index)}
                cookingTime={parseInt(recipe.cookingTime) || 30}
                category="AI Suggested"
                delay={index}
                onImageError={() => handleImageError(recipe.name, index)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-muted-foreground">
                No recipe suggestions yet. Try refreshing or updating your preferences.
              </p>
              <Button onClick={fetchSuggestions} className="mt-4">
                Generate Suggestions
              </Button>
            </div>
          )}
        </motion.div>
      )}

      <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Gemini API Key</DialogTitle>
            <DialogDescription>
              Enter your Gemini API key to enable personalized recipe suggestions.
              You can get a key from the Google AI Studio.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              id="gemini-api-key"
              placeholder="Enter your Gemini API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="col-span-3"
            />
            <p className="text-xs text-muted-foreground">
              Your API key will be stored locally in your browser and not sent to our servers.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={saveApiKey}>Save API Key</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {recipes.length > 0 && (
        <div className="mt-8 bg-card shadow-sm p-6 rounded-lg border">
          <h3 className="text-xl font-semibold mb-4">Recipe Details</h3>
          <div className="grid grid-cols-1 gap-6">
            {recipes.map((recipe, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                    <div className="relative">
                      <AspectRatio ratio={4/3}>
                        {recipe.imageUrl ? (
                          <img 
                            src={getImageUrl(recipe, index)}
                            alt={recipe.name}
                            className="w-full h-full object-cover"
                            onError={() => handleImageError(recipe.name, index)}
                          />
                        ) : (
                          <Skeleton className="w-full h-full" />
                        )}
                      </AspectRatio>
                    </div>
                    <div className="md:col-span-2 p-5">
                      <h4 className="font-semibold text-lg mb-2">{recipe.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{recipe.description}</p>
                      <div className="flex flex-wrap gap-3 mb-3">
                        <div className="flex items-center text-sm">
                          <Clock className="w-4 h-4 mr-1 text-primary-blue" />
                          <span>{recipe.cookingTime}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <UtensilsCrossed className="w-4 h-4 mr-1 text-primary-blue" />
                          <span>{recipe.difficulty}</span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <h5 className="text-sm font-medium mb-1">Key Ingredients:</h5>
                        <p className="text-sm text-muted-foreground">
                          {recipe.ingredients && recipe.ingredients.length > 0 
                            ? recipe.ingredients.slice(0, 5).join(', ') + (recipe.ingredients.length > 5 ? '...' : '')
                            : 'No ingredients specified'}
                        </p>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="mt-2"
                        onClick={() => toggleRecipeDetails(index)}
                      >
                        {expandedRecipeIndex === index ? 'Hide Details' : 'Show Details'}
                      </Button>
                      
                      {expandedRecipeIndex === index && (
                        <div className="mt-4">
                          <h5 className="text-sm font-medium mb-1">Instructions:</h5>
                          {recipe.instructions && recipe.instructions.length > 0 ? (
                            <ol className="text-sm text-muted-foreground list-decimal list-inside">
                              {recipe.instructions.map((step, i) => (
                                <li key={i} className="mb-1">{step}</li>
                              ))}
                            </ol>
                          ) : (
                            <p className="text-sm text-muted-foreground">No instructions specified</p>
                          )}
                          
                          <h5 className="text-sm font-medium mb-1 mt-3">All Ingredients:</h5>
                          {recipe.ingredients && recipe.ingredients.length > 0 ? (
                            <ul className="text-sm text-muted-foreground list-disc list-inside">
                              {recipe.ingredients.map((ingredient, i) => (
                                <li key={i} className="mb-1">{ingredient}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-muted-foreground">No ingredients specified</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
