
import { motion } from 'framer-motion';
import SearchBar from '@/components/SearchBar';
import CategoryPills from '@/components/CategoryPills';
import { categories } from '@/utils/recipeData';

interface SearchSectionProps {
  activeCategory: string;
  onCategorySelect: (category: string) => void;
  onSearch: (query: string, type: 'recipe' | 'ingredient') => void;
}

const SearchSection = ({ 
  activeCategory, 
  onCategorySelect, 
  onSearch 
}: SearchSectionProps) => {
  // Food emoji elements that will float around
  const foodElements = [
    { emoji: '🍴', delay: 0, duration: 25, rotate: 10 },
    { emoji: '🍲', delay: 5, duration: 30, rotate: -5 },
    { emoji: '🥘', delay: 10, duration: 28, rotate: 8 },
    { emoji: '🍜', delay: 15, duration: 32, rotate: -10 },
    { emoji: '🍝', delay: 7, duration: 27, rotate: 15 },
    { emoji: '🍛', delay: 12, duration: 29, rotate: -8 },
  ];

  return (
    <section className="relative z-10 py-16 md:py-20">
      <div className="container px-4 md:px-6">
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 relative inline-block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <motion.span 
              className="absolute -left-8 -top-6 text-2xl opacity-70"
              animate={{ 
                y: [0, -10, 0],
                rotate: [-5, 5, -5],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              🧁
            </motion.span>
            Find Your Perfect Recipe
            <motion.span 
              className="absolute -right-8 -bottom-4 text-2xl opacity-70"
              animate={{ 
                y: [0, -8, 0],
                rotate: [5, -5, 5],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1
              }}
            >
              🍳
            </motion.span>
          </motion.h2>
          <motion.p 
            className="text-muted-foreground text-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Search by recipe name or ingredients you have on hand
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="mb-12 relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Animated food elements around search bar */}
          {foodElements.map((food, index) => (
            <motion.div
              key={index}
              className="absolute text-2xl opacity-30 pointer-events-none"
              style={{
                left: `${10 + (index * 15)}%`,
                top: index % 2 === 0 ? '-20px' : 'auto',
                bottom: index % 2 === 0 ? 'auto' : '-20px',
              }}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 0.3, 0],
                y: index % 2 === 0 ? [0, -30, 0] : [0, 30, 0],
                rotate: [0, food.rotate, 0],
                scale: [0.8, 1, 0.8]
              }}
              transition={{
                duration: food.duration,
                repeat: Infinity,
                delay: food.delay,
                ease: "easeInOut"
              }}
            >
              {food.emoji}
            </motion.div>
          ))}
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <SearchBar onSearch={onSearch} />
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="mb-8 overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <motion.div
            initial={{ x: -20 }}
            whileInView={{ x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <CategoryPills
              categories={categories}
              activeCategory={activeCategory}
              onSelectCategory={onCategorySelect}
            />
          </motion.div>
        </motion.div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -right-20 top-20 w-64 h-64 rounded-full bg-blue-100/30 dark:bg-blue-900/10 blur-3xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        />
        <motion.div 
          className="absolute -left-20 bottom-20 w-64 h-64 rounded-full bg-amber-100/30 dark:bg-amber-900/10 blur-3xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
        />
        
        {/* Animated utensil icons */}
        <motion.div 
          className="absolute right-10 bottom-10 text-3xl opacity-20"
          animate={{ 
            rotate: [0, 10, 0, -10, 0],
            scale: [1, 1.1, 1, 0.9, 1]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        >
          🍽️
        </motion.div>
        <motion.div 
          className="absolute left-10 top-20 text-3xl opacity-20"
          animate={{ 
            rotate: [0, -10, 0, 10, 0],
            scale: [1, 0.9, 1, 1.1, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, delay: 2 }}
        >
          🥄
        </motion.div>
      </div>
    </section>
  );
};

export default SearchSection;
