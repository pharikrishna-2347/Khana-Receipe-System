
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeroProps {
  className?: string;
}

const Hero = ({ className }: HeroProps) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { ease: [0.22, 1, 0.36, 1], duration: 0.7 } }
  };

  const decorativeCircles = [
    { size: 'w-64 h-64', position: '-left-20 -bottom-20', color: 'bg-primary-blue/5', blur: 'blur-2xl' },
    { size: 'w-80 h-80', position: '-right-20 top-20', color: 'bg-primary-orange/5', blur: 'blur-3xl' },
    { size: 'w-72 h-72', position: 'left-1/4 top-10', color: 'bg-green-500/5', blur: 'blur-3xl' }
  ];

  // Food items with their respective colors and animations
  const foodItems = [
    { emoji: '🥗', color: 'text-green-500', size: 'text-4xl', rotationSpeed: 15 },
    { emoji: '🍲', color: 'text-amber-600', size: 'text-5xl', rotationSpeed: 20 },
    { emoji: '🍜', color: 'text-amber-400', size: 'text-4xl', rotationSpeed: 18 },
    { emoji: '🍕', color: 'text-red-500', size: 'text-5xl', rotationSpeed: 22 },
    { emoji: '🥑', color: 'text-green-600', size: 'text-3xl', rotationSpeed: 17 },
    { emoji: '🍔', color: 'text-amber-700', size: 'text-4xl', rotationSpeed: 19 },
    { emoji: '🍳', color: 'text-yellow-400', size: 'text-3xl', rotationSpeed: 16 },
    { emoji: '🍱', color: 'text-indigo-400', size: 'text-4xl', rotationSpeed: 21 },
    { emoji: '🍎', color: 'text-red-600', size: 'text-3xl', rotationSpeed: 14 },
    { emoji: '🥐', color: 'text-amber-300', size: 'text-4xl', rotationSpeed: 16 },
    { emoji: '🍇', color: 'text-purple-500', size: 'text-3xl', rotationSpeed: 18 },
    { emoji: '🍰', color: 'text-pink-400', size: 'text-4xl', rotationSpeed: 20 }
  ];

  // Recipe card animations
  const recipeCards = [
    { title: 'Avocado Toast', color: 'from-green-100 to-green-200', delay: 0 },
    { title: 'Pasta Carbonara', color: 'from-amber-100 to-amber-200', delay: 0.5 },
    { title: 'Berry Smoothie', color: 'from-purple-100 to-purple-200', delay: 1 },
    { title: 'Chicken Curry', color: 'from-yellow-100 to-yellow-200', delay: 1.5 }
  ];

  // Food background images with animations
  const foodImages = [
    { 
      src: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c", 
      alt: "Healthy food bowl", 
      position: "top-10 -right-16 md:-right-10",
      size: "w-72 h-72",
      rotation: -5,
      delay: 0.3
    },
    { 
      src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836", 
      alt: "Food plate", 
      position: "bottom-24 -left-20 md:-left-10",
      size: "w-80 h-80",
      rotation: 8,
      delay: 0.6
    },
    { 
      src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd", 
      alt: "Fresh salad", 
      position: "-bottom-20 left-1/4",
      size: "w-64 h-64",
      rotation: -7,
      delay: 0.9
    },
    { 
      src: "https://images.unsplash.com/photo-1561043433-aaf687c4cf04", 
      alt: "Fruit platter", 
      position: "top-28 left-10 md:left-20",
      size: "w-60 h-60",
      rotation: 6,
      delay: 1.2
    }
  ];

  return (
    <div className={cn("relative overflow-hidden py-28 md:py-36", className)}>
      {/* Animated background gradient */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-orange-50/30 dark:from-blue-950/20 dark:to-orange-950/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />
      
      {/* Decorative circles */}
      {decorativeCircles.map((circle, index) => (
        <motion.div
          key={index}
          className={`absolute ${circle.position} ${circle.size} rounded-full ${circle.color} ${circle.blur}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: 0.2 * index }}
        />
      ))}

      {/* Animated food background images */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {foodImages.map((img, index) => (
          <motion.div
            key={`food-img-${index}`}
            className={`absolute ${img.position} ${img.size} rounded-full overflow-hidden opacity-20 shadow-xl`}
            initial={{ 
              opacity: 0, 
              scale: 0.8,
              rotate: img.rotation,
              y: 30
            }}
            animate={{ 
              opacity: [0, 0.15, 0.1, 0.15], 
              scale: [0.8, 1, 0.95, 1],
              y: [30, 0, 15, 0],
              rotate: [img.rotation, img.rotation + 3, img.rotation - 2, img.rotation]
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity,
              delay: img.delay,
              ease: "easeInOut"
            }}
          >
            <motion.div
              className="w-full h-full"
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
        ))}
      </div>
      
      {/* Floating food recipe cards */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {recipeCards.map((card, index) => (
          <motion.div
            key={`card-${index}`}
            className={`absolute rounded-xl shadow-lg bg-gradient-to-br ${card.color} dark:bg-opacity-20 p-3 w-48 h-32 flex flex-col justify-between`}
            style={{
              left: `${15 + (index * 20)}%`,
              top: `${70 - (index * 15)}%`,
            }}
            initial={{ opacity: 0, y: 100, rotate: index % 2 === 0 ? -5 : 5 }}
            animate={{ 
              opacity: [0, 0.8, 0.6, 0],
              y: -300,
              rotate: [index % 2 === 0 ? -5 : 5, index % 2 === 0 ? 5 : -5]
            }}
            transition={{ 
              duration: 15 + index * 2, 
              repeat: Infinity, 
              delay: card.delay * 3,
              ease: "easeInOut"
            }}
          >
            <div className="text-sm font-bold">{card.title}</div>
            <div className="flex justify-between items-end">
              <div className="text-xs opacity-70">30 min</div>
              <div className="text-lg">{foodItems[index].emoji}</div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Floating food icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {foodItems.map((item, index) => (
          <motion.div
            key={`food-${index}`}
            className={`absolute ${item.color} ${item.size} opacity-20 dark:opacity-10`}
            style={{ 
              left: `${Math.random() * 90 + 5}%`, 
              top: `${Math.random() * 100}%`,
            }}
            initial={{ 
              scale: 0,
              rotate: 0,
            }}
            animate={{ 
              y: [0, -500 - (index * 50)],
              scale: [0, 1, 0.8, 0],
              rotate: 360
            }}
            transition={{ 
              duration: item.rotationSpeed,
              repeat: Infinity,
              delay: index * 1.5,
              ease: "easeInOut"
            }}
          >
            {item.emoji}
          </motion.div>
        ))}
      </div>
      
      {/* Content container */}
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item} className="mb-3 inline-block">
            <span className="inline-flex items-center px-4 py-1.5 text-sm font-medium rounded-full bg-primary-blue/10 text-primary-blue">
              <motion.span 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                className="mr-1"
              >
                ✨
              </motion.span>
              Discover recipes that match your lifestyle
            </span>
          </motion.div>
          
          <motion.h1 
            variants={item}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8"
          >
            <motion.span 
              className="block"
              whileHover={{ scale: 1.05, color: "#007AFF" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Discover
            </motion.span>
            <motion.span 
              className="text-primary-blue bg-clip-text"
              animate={{ 
                backgroundImage: [
                  "linear-gradient(90deg, #007AFF, #007AFF)",
                  "linear-gradient(90deg, #007AFF, #FF9500)",
                  "linear-gradient(90deg, #FF9500, #007AFF)",
                  "linear-gradient(90deg, #007AFF, #007AFF)"
                ]
              }}
              transition={{ duration: 8, repeat: Infinity }}
              style={{ 
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Delicious
            </motion.span>
            <motion.span 
              className="block"
              whileHover={{ scale: 1.05, color: "#FF9500" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Recipes
            </motion.span>
          </motion.h1>
          
          <motion.p 
            variants={item}
            className="text-muted-foreground text-lg md:text-xl mb-10 max-w-2xl mx-auto"
          >
            Find, plan and cook amazing recipes that match your taste, dietary needs, and available ingredients.
          </motion.p>
          
          <motion.div 
            variants={item} 
            className="flex flex-col sm:flex-row gap-5 justify-center"
          >
            <Button
              asChild
              size="lg"
              className="bg-primary-blue hover:bg-primary-blue/90 text-white font-medium rounded-full px-8 h-14 text-lg relative overflow-hidden group"
            >
              <Link to="/recipes">
                <motion.span className="relative z-10">
                  Explore Recipes
                </motion.span>
                <motion.span 
                  className="absolute inset-0 bg-white"
                  initial={{ x: "-100%", opacity: 0.3 }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
              </Link>
            </Button>
            
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary-blue text-primary-blue hover:bg-primary-blue/10 font-medium rounded-full px-8 h-14 text-lg"
            >
              <Link to="/meal-planner">
                <motion.span 
                  initial={{ opacity: 1 }}
                  whileHover={{ 
                    scale: [1, 1.12, 1.1], 
                    transition: { duration: 0.3 } 
                  }}
                >
                  Try Meal Planner
                </motion.span>
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Bottom wave decoration */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-16 md:h-24"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-full">
          <motion.path 
            d="M0,0 C150,120 350,0 500,50 C650,100 700,0 900,40 C1050,70 1200,0 1200,0 V120 H0 V0 Z" 
            fill="#f9fafb"
            className="dark:fill-gray-950"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>
    </div>
  );
};

export default Hero;
