
import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CategoryPillsProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  className?: string;
}

const CategoryPills = ({
  categories,
  activeCategory,
  onSelectCategory,
  className
}: CategoryPillsProps) => {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const checkForArrows = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      checkForArrows();
      scrollContainer.addEventListener('scroll', checkForArrows);
      window.addEventListener('resize', checkForArrows);
      
      return () => {
        scrollContainer.removeEventListener('scroll', checkForArrows);
        window.removeEventListener('resize', checkForArrows);
      };
    }
  }, [categories]);

  return (
    <div className={cn('relative', className)}>
      <div className="flex items-center">
        {showLeftArrow && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 z-10 flex items-center justify-center w-8 h-8 bg-white shadow-md rounded-full -translate-x-1/2 focus:outline-none"
            aria-label="Scroll left"
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M15 18L9 12L15 6" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
        
        <div
          ref={scrollContainerRef}
          className="flex items-center space-x-2 overflow-x-auto py-2 px-2 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category) => (
            <CategoryPill
              key={category}
              category={category}
              isActive={category === activeCategory}
              onClick={() => onSelectCategory(category)}
            />
          ))}
        </div>
        
        {showRightArrow && (
          <button
            onClick={scrollRight}
            className="absolute right-0 z-10 flex items-center justify-center w-8 h-8 bg-white shadow-md rounded-full translate-x-1/2 focus:outline-none"
            aria-label="Scroll right"
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M9 6L15 12L9 18" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

interface CategoryPillProps {
  category: string;
  isActive: boolean;
  onClick: () => void;
}

const CategoryPill = ({ category, isActive, onClick }: CategoryPillProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative h-10 px-4 rounded-full flex items-center justify-center text-sm font-medium transition-all whitespace-nowrap focus:outline-none',
        isActive
          ? 'bg-primary-blue text-white'
          : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
      )}
    >
      {isActive && (
        <motion.div
          layoutId="activeCategoryBackground"
          className="absolute inset-0 bg-primary-blue rounded-full"
          initial={false}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
      <span className={cn('relative z-10', isActive ? 'text-white' : '')}>
        {category}
      </span>
    </button>
  );
};

export default CategoryPills;
