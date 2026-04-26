
import { motion } from "framer-motion";

interface FoodBackgroundAnimationProps {
  className?: string;
}

const FoodBackgroundAnimation = ({ className }: FoodBackgroundAnimationProps) => {
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

  // Decorative circles for additional visual effect
  const decorativeCircles = [
    { size: 'w-64 h-64', position: '-left-20 -bottom-20', color: 'bg-primary-blue/5', blur: 'blur-2xl' },
    { size: 'w-80 h-80', position: '-right-20 top-20', color: 'bg-primary-orange/5', blur: 'blur-3xl' },
    { size: 'w-72 h-72', position: 'left-1/4 top-10', color: 'bg-green-500/5', blur: 'blur-3xl' }
  ];

  return (
    <>
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
    </>
  );
};

export default FoodBackgroundAnimation;
