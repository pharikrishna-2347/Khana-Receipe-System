
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useIsVisible } from '@/hooks/useIsVisible';
import { Clock, Tag, ImageOff } from 'lucide-react';

interface RecipeCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  cookingTime: number;
  category: string;
  className?: string;
  delay?: number;
  onImageError?: () => void;
}

const RecipeCard = ({
  id,
  title,
  description,
  imageUrl,
  cookingTime,
  category,
  className,
  delay = 0,
  onImageError
}: RecipeCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isVisible = useIsVisible(cardRef);
  const [fallbackImageUrl, setFallbackImageUrl] = useState('');

  useEffect(() => {
    // Reset states when imageUrl changes
    setImageLoaded(false);
    setImageFailed(false);
    
    // Generate a better fallback URL upfront using title keywords with more specific terms
    const keywords = title.split(' ').slice(0, 2).join(',');
    setFallbackImageUrl(`https://source.unsplash.com/featured/800x600/?food,${encodeURIComponent(keywords)},dish,meal`);
    
    // Test the image
    const img = new Image();
    img.src = imageUrl;
    
    img.onload = () => {
      setImageLoaded(true);
      setImageFailed(false);
    };
    
    img.onerror = () => {
      console.log(`Image load error for ${title}`);
      setImageFailed(true);
      setImageLoaded(true); // Still mark as loaded to remove shimmer
      if (onImageError) onImageError();
    };
    
    return () => {
      // Clean up by removing event listeners
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl, title, onImageError]);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        delay: delay * 0.15,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const getEffectiveImageUrl = () => {
    if (imageFailed) {
      return fallbackImageUrl;
    }
    return imageUrl;
  };

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      whileHover={{ 
        y: -12,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className={cn(
        'group rounded-2xl overflow-hidden bg-card border border-border/40 shadow-sm transition-all duration-300',
        'hover:shadow-xl hover:border-primary-blue/20 dark:bg-gray-800 dark:border-gray-700',
        className
      )}
    >
      <Link to={`/recipes/${id}`} className="flex flex-col h-full">
        <div className="relative aspect-[4/3] overflow-hidden">
          <div className={cn(
            'absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 transition-all duration-700',
            imageLoaded ? 'opacity-0' : 'opacity-100'
          )} />
          
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          />
          
          {imageFailed && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/30 z-5">
              <ImageOff className="w-12 h-12 text-muted-foreground/70 mb-2" />
              <div className="text-xs text-center text-muted-foreground/70 px-4">
                {title}
              </div>
            </div>
          )}
          
          <motion.img
            src={getEffectiveImageUrl()}
            alt={title}
            className={cn(
              'w-full h-full object-cover transition-all duration-700',
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
            )}
            layoutId={`recipe-image-${id}`}
            transition={{ duration: 0.5 }}
            onError={() => {
              setImageFailed(true);
              if (onImageError) onImageError();
            }}
          />
          
          <div className="absolute top-3 left-3 flex items-center gap-2 z-20">
            <motion.div 
              className="flex items-center gap-1 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm text-xs font-medium px-2.5 py-1 rounded-full text-foreground dark:text-gray-100 shadow-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Tag size={12} className="mr-0.5 dark:text-primary-blue" />
              {category}
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-1 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm text-xs font-medium px-2.5 py-1 rounded-full text-foreground dark:text-gray-100 shadow-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Clock size={12} className="mr-0.5 dark:text-primary-blue" />
              {cookingTime} min
            </motion.div>
          </div>
        </div>
        
        <div className="flex-1 p-5">
          <motion.div 
            className="flex flex-col h-full"
            initial={{ opacity: 0, y: 10 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.3, delay: (delay * 0.15) + 0.3 }}
          >
            <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary-blue transition-colors dark:text-gray-100">
              {title}
            </h3>
            
            <p className="text-muted-foreground dark:text-gray-400 text-sm line-clamp-2 mb-4">
              {description}
            </p>
            
            <motion.div 
              className="mt-auto flex items-center text-xs font-medium text-primary-blue dark:text-primary-blue/80"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              View Recipe
              <motion.span
                className="ml-1"
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 0.5 }}
              >
                →
              </motion.span>
            </motion.div>
          </motion.div>
        </div>
        
        <motion.div 
          className="h-1 bg-gradient-to-r from-primary-blue to-primary-blue/40 w-0 group-hover:w-full transition-all duration-500"
          initial={{ width: 0 }}
          whileHover={{ width: "100%" }}
        />
      </Link>
    </motion.div>
  );
};

export default RecipeCard;
