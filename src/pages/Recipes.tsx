
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import SearchBar from '@/components/SearchBar';
import CategoryPills from '@/components/CategoryPills';
import RecipeCard from '@/components/RecipeCard';
import FoodBackgroundAnimation from '@/components/FoodBackgroundAnimation';
import { categories } from '@/utils/recipeData';
import { 
  SpoonacularRecipe, 
  searchRecipesByName, 
  searchRecipesByIngredients,
  getRandomRecipes 
} from '@/services/spoonacularService';
import { generateRecipeImage } from '@/services/geminiService';
import { useToast } from '@/hooks/use-toast';

const Recipes = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [recipes, setRecipes] = useState<SpoonacularRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recipeImages, setRecipeImages] = useState<Record<number, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    // For initial load, get random recipes
    const loadInitialRecipes = async () => {
      try {
        setIsLoading(true);
        const results = await getRandomRecipes(8);
        setRecipes(results);
        
        // Generate images for recipes without images
        for (const recipe of results) {
          if (!recipe.image) {
            const imageUrl = await generateRecipeImage(recipe.title);
            setRecipeImages(prev => ({
              ...prev,
              [recipe.id]: imageUrl
            }));
          }
        }
      } catch (error) {
        console.error('Error loading initial recipes:', error);
        toast({
          title: "Error loading recipes",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialRecipes();
  }, [toast]);

  const handleSearch = async (query: string, type: 'recipe' | 'ingredient') => {
    setIsLoading(true);
    
    try {
      let results: SpoonacularRecipe[] = [];
      
      if (type === 'recipe') {
        results = await searchRecipesByName(query);
      } else {
        results = await searchRecipesByIngredients(query);
      }
      
      setRecipes(results);
      
      // Generate images for recipes without images
      for (const recipe of results) {
        if (!recipe.image) {
          const imageUrl = await generateRecipeImage(recipe.title);
          setRecipeImages(prev => ({
            ...prev,
            [recipe.id]: imageUrl
          }));
        }
      }
      
      // Reset category selection when searching
      setActiveCategory('All');
    } catch (error) {
      console.error('Error searching recipes:', error);
      toast({
        title: "Search failed",
        description: "Unable to search recipes at this time",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = async (category: string) => {
    setActiveCategory(category);
    setIsLoading(true);
    
    try {
      // When a category is selected, search for recipes in that category
      if (category === 'All') {
        const results = await getRandomRecipes(8);
        setRecipes(results);
      } else {
        const results = await searchRecipesByName(category);
        setRecipes(results);
      }
    } catch (error) {
      console.error('Error filtering recipes by category:', error);
      toast({
        title: "Error",
        description: "Failed to load recipes for this category",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container px-4 md:px-6 py-12 relative">
        {/* Add the food background animation */}
        <div className="absolute inset-0 overflow-hidden">
          <FoodBackgroundAnimation />
        </div>
        
        <div className="max-w-4xl mx-auto text-center mb-12 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
          >
            Discover <span className="text-primary-blue">Delicious</span> Recipes
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground text-lg mb-8"
          >
            Find the perfect recipe for any occasion, cuisine, or dietary preference
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <SearchBar onSearch={handleSearch} />
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8 relative z-10"
        >
          <CategoryPills
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={handleCategorySelect}
          />
        </motion.div>
        
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="rounded-2xl overflow-hidden bg-card border border-border">
                  <div className="aspect-[4/3] bg-muted animate-pulse" />
                  <div className="p-4">
                    <div className="h-6 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {recipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {recipes.map((recipe, index) => (
                    <RecipeCard
                      key={recipe.id}
                      id={recipe.id.toString()}
                      title={recipe.title}
                      description="Click to view recipe details"
                      imageUrl={recipe.image || recipeImages[recipe.id] || `https://source.unsplash.com/random/800x600/?${encodeURIComponent(recipe.title)},food`}
                      cookingTime={30} // Placeholder, will be filled in detail page
                      category={activeCategory !== 'All' ? activeCategory : "Recipe"}
                      delay={index}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <h3 className="text-xl font-medium mb-2">No recipes found</h3>
                  <p className="text-muted-foreground mb-6">Try a different search term or category</p>
                  <button
                    onClick={() => handleCategorySelect('All')}
                    className="bg-primary-blue text-white rounded-full px-6 py-2 hover:bg-primary-blue/90 transition-colors"
                  >
                    View all recipes
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default Recipes;
