import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { useSavedRecipes, SavedRecipe } from '@/hooks/useSavedRecipes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookmarkCheck, Heart, Search, Trash2 } from 'lucide-react';
import RecipeCard from '@/components/RecipeCard';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { stripHtmlTags } from '@/utils/textUtils';

const SavedRecipes = () => {
  const { savedRecipes, isLoading, toggleFavorite, removeRecipe } = useSavedRecipes();
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/auth');
    return null;
  }

  const filteredRecipes = savedRecipes.filter(recipe => 
    recipe.recipe_data.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const favoriteRecipes = filteredRecipes.filter(recipe => recipe.is_favorite);
  const allRecipes = filteredRecipes;

  return (
    <Layout>
      <div className="container px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto mb-12 text-center"
        >
          <h1 className="text-4xl font-bold mb-4">Your Recipe Collection</h1>
          <p className="text-muted-foreground">Manage and organize your saved recipes</p>
        </motion.div>

        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="all" className="gap-2">
              <BookmarkCheck className="h-4 w-4" />
              All Recipes
            </TabsTrigger>
            <TabsTrigger value="favorites" className="gap-2">
              <Heart className="h-4 w-4" />
              Favorites
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-[300px] bg-muted animate-pulse rounded-xl" />
                ))}
              </div>
            ) : allRecipes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allRecipes.map((saved: SavedRecipe) => (
                  <div key={saved.id} className="relative group">
                    <RecipeCard
                      id={saved.recipe_data.id.toString()}
                      title={saved.recipe_data.title}
                      description={stripHtmlTags(saved.recipe_data.summary).slice(0, 100) + '...'}
                      imageUrl={saved.recipe_data.image}
                      cookingTime={saved.recipe_data.readyInMinutes}
                      category={saved.recipe_data.cuisines?.[0] || 'Recipe'}
                    />
                    <div className="absolute top-2 right-2 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant={saved.is_favorite ? "default" : "outline"}
                        onClick={() => toggleFavorite(saved.id, saved.is_favorite)}
                      >
                        <Heart className={`h-4 w-4 ${saved.is_favorite ? 'fill-current' : ''}`} />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => removeRecipe(saved.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookmarkCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No recipes saved yet</h3>
                <p className="text-muted-foreground mb-6">Start saving recipes to build your collection</p>
                <Button onClick={() => navigate('/recipes')}>Browse Recipes</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-[300px] bg-muted animate-pulse rounded-xl" />
                ))}
              </div>
            ) : favoriteRecipes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteRecipes.map((saved: SavedRecipe) => (
                  <div key={saved.id} className="relative group">
                    <RecipeCard
                      id={saved.recipe_data.id.toString()}
                      title={saved.recipe_data.title}
                      description={stripHtmlTags(saved.recipe_data.summary).slice(0, 100) + '...'}
                      imageUrl={saved.recipe_data.image}
                      cookingTime={saved.recipe_data.readyInMinutes}
                      category={saved.recipe_data.cuisines?.[0] || 'Recipe'}
                    />
                    <div className="absolute top-2 right-2 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="default"
                        onClick={() => toggleFavorite(saved.id, saved.is_favorite)}
                      >
                        <Heart className="h-4 w-4 fill-current" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => removeRecipe(saved.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No favorite recipes yet</h3>
                <p className="text-muted-foreground mb-6">Mark recipes as favorites to see them here</p>
                <Button onClick={() => navigate('/recipes')}>Browse Recipes</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SavedRecipes;
