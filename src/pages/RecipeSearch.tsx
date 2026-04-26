
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import SearchBar from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { SpoonacularRecipe, searchRecipesByName, searchRecipesByIngredients } from '@/services/spoonacularService';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const RecipeSearch = () => {
  const [recipes, setRecipes] = useState<SpoonacularRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState<'recipe' | 'ingredient'>('recipe');
  const [lastQuery, setLastQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Load some initial recipes
    handleSearch('', 'recipe');
  }, []);

  const handleSearch = async (query: string, type: 'recipe' | 'ingredient') => {
    setIsLoading(true);
    setSearchType(type);
    setLastQuery(query);

    try {
      let searchResults: SpoonacularRecipe[] = [];
      
      if (type === 'ingredient') {
        searchResults = await searchRecipesByIngredients(query || 'chicken');
      } else {
        searchResults = await searchRecipesByName(query || 'pasta');
      }
      
      setRecipes(searchResults);
      
      if (searchResults.length === 0) {
        toast({
          description: "No recipes found. Try a different search term.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Error",
        description: "Failed to search recipes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const viewRecipeDetails = (id: number) => {
    navigate(`/recipes/${id}`);
  };

  return (
    <Layout>
      <div className="container px-4 py-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Recipe Search</h1>
          <p className="text-muted-foreground mb-6">
            Find recipes by name or ingredients you have on hand
          </p>
          
          <div className="mb-8">
            <SearchBar onSearch={handleSearch} />
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
            <span className="ml-2 text-lg">Searching for recipes...</span>
          </div>
        ) : (
          <>
            {recipes.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, staggerChildren: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {recipes.map((recipe) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-border hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => viewRecipeDetails(recipe.id)}
                  >
                    <div className="h-48 relative overflow-hidden">
                      <img 
                        src={recipe.image || '/placeholder.svg'} 
                        alt={recipe.title}
                        className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-lg mb-2 line-clamp-2">{recipe.title}</h3>
                      <Button 
                        variant="outline" 
                        className="w-full mt-2 text-primary-blue border-primary-blue/30 hover:bg-primary-blue hover:text-white"
                      >
                        View Recipe
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-20 bg-muted/30 rounded-xl">
                <h3 className="text-2xl font-medium mb-2">No recipes found</h3>
                <p className="text-muted-foreground mb-6">Try a different search term</p>
                <Button onClick={() => handleSearch('', 'recipe')}>
                  Show all recipes
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default RecipeSearch;
