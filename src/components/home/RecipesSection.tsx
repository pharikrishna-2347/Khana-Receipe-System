
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import RecipeCard from '@/components/RecipeCard';
import { Recipe } from '@/utils/recipeData';
import { useIsVisible } from '@/hooks/useIsVisible';
import { ArrowRight, RefreshCw } from 'lucide-react';

interface RecipesSectionProps {
  recipes: Recipe[];
  emptyRecipesHandler: () => void;
  isLoading?: boolean;
}

const RecipesSection = ({ recipes, emptyRecipesHandler, isLoading = false }: RecipesSectionProps) => {
  const navigate = useNavigate();
  const recipesRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const recipesVisible = useIsVisible(recipesRef);
  const titleVisible = useIsVisible(titleRef);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      ref={recipesRef}
      className="mb-24 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg width="100%" height="100%" className="absolute opacity-5">
          <pattern id="pattern-circles" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
            <circle id="pattern-circle" cx="10" cy="10" r="1.6257413380501518" fill="currentColor"></circle>
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
        </svg>
      </div>
      
      <motion.div 
        ref={titleRef}
        className="flex justify-between items-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={titleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <motion.span 
            className="block text-sm font-medium text-primary-blue mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={titleVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            CHEF'S SELECTION
          </motion.span>
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-foreground relative"
            initial={{ opacity: 0, x: -20 }}
            animate={titleVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            Explore Our Recipes
            <motion.span 
              className="absolute bottom-0 left-0 h-1 bg-primary-blue/30 rounded-full"
              initial={{ width: 0 }}
              animate={titleVisible ? { width: "60px" } : { width: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            />
          </motion.h2>
        </div>
        
        {recipes.length > 8 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={titleVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button 
              variant="outline" 
              onClick={() => navigate('/recipes')}
              className="group hover:bg-primary-blue hover:text-white border-primary-blue/30 text-primary-blue rounded-full px-6"
            >
              View All
              <motion.div
                className="ml-2"
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 0.5 }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            </Button>
          </motion.div>
        )}
      </motion.div>
      
      {isLoading ? (
        <motion.div 
          className="text-center py-20 bg-muted/30 rounded-2xl border border-border/50"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <RefreshCw className="h-10 w-10 text-primary-blue/70 mb-4 animate-spin" />
            <h3 className="text-2xl font-medium mb-2">Loading recipes...</h3>
            <p className="text-muted-foreground">Fetching delicious ideas for you</p>
          </motion.div>
        </motion.div>
      ) : recipes.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={recipesVisible ? "visible" : "hidden"}
        >
          {recipes.slice(0, 8).map((recipe, index) => (
            <RecipeCard
              key={recipe.id}
              id={recipe.id}
              title={recipe.title}
              description={recipe.description}
              imageUrl={recipe.imageUrl}
              cookingTime={recipe.cookingTime}
              category={recipe.category}
              className="h-full"
              delay={index}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div 
          className="text-center py-20 bg-muted/30 rounded-2xl border border-border/50"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h3 className="text-2xl font-medium mb-2">No recipes found</h3>
            <p className="text-muted-foreground mb-6">Try a different search term or category</p>
            <Button 
              onClick={emptyRecipesHandler}
              className="bg-primary-blue hover:bg-primary-blue/90"
            >
              View all recipes
            </Button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RecipesSection;
