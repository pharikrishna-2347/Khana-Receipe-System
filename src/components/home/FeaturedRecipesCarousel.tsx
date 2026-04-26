
import { useRef } from 'react';
import { motion } from 'framer-motion';
import RecipeCard from '@/components/RecipeCard';
import { Recipe } from '@/utils/recipeData';
import { useIsVisible } from '@/hooks/useIsVisible';
import { Sparkles } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';

interface FeaturedRecipesCarouselProps {
  recipes: Recipe[];
}

const FeaturedRecipesCarousel = ({ recipes }: FeaturedRecipesCarouselProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useIsVisible(sectionRef);

  return (
    <section 
      ref={sectionRef}
      className="py-24 md:py-32 relative overflow-hidden"
    >
      {/* Background gradient */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950"
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1 }}
      />
      
      {/* Animated background patterns */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/30 dark:bg-white/5"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
            }}
            initial={{ 
              opacity: 0,
              scale: 0
            }}
            animate={isVisible ? { 
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0],
            } : {}}
            transition={{ 
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div 
            className="inline-flex items-center justify-center mb-4"
            initial={{ scale: 0 }}
            animate={isVisible ? { scale: 1, rotate: [0, 5, 0, -5, 0] } : { scale: 0 }}
            transition={{ 
              scale: { duration: 0.5 },
              rotate: { duration: 2, delay: 1, repeat: Infinity, repeatDelay: 3 }
            }}
          >
            <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-blue/10 text-primary-blue">
              <Sparkles size={20} />
            </span>
          </motion.div>
          
          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-blue to-primary-blue/70"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Featured Recipes
          </motion.h2>
          
          <motion.p 
            className="text-muted-foreground text-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Discover our most popular and delicious recipes that our community loves
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-6xl mx-auto"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {recipes.slice(0, 6).map((recipe, index) => (
                <CarouselItem key={recipe.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <RecipeCard
                      id={recipe.id}
                      title={recipe.title}
                      description={recipe.description}
                      imageUrl={recipe.imageUrl}
                      cookingTime={recipe.cookingTime}
                      category={recipe.category}
                      className="h-full"
                      delay={index}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="flex justify-center mt-12">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <CarouselPrevious className="mr-4 bg-white hover:bg-primary-blue hover:text-white border-primary-blue/20 text-primary-blue static transform-none" />
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <CarouselNext className="bg-white hover:bg-primary-blue hover:text-white border-primary-blue/20 text-primary-blue static transform-none" />
              </motion.div>
            </div>
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedRecipesCarousel;
