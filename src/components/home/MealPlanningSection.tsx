
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsVisible } from '@/hooks/useIsVisible';

const MealPlanningSection = () => {
  const navigate = useNavigate();
  const mealPlanRef = useRef<HTMLDivElement>(null);
  const mealPlanVisible = useIsVisible(mealPlanRef);

  return (
    <section 
      ref={mealPlanRef}
      className="py-12 md:py-16 bg-background"
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -40 }}
            animate={mealPlanVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <img
              src="https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
              alt="Organized meal prep containers"
              className="rounded-2xl shadow-lg w-full object-cover aspect-video border border-border/5 dark:border-white/10"
            />
          </motion.div>
          
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 40 }}
            animate={mealPlanVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="inline-block text-sm font-medium text-primary-blue mb-2">MEAL PLANNING</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Plan Your Weekly Meals</h2>
            <p className="text-muted-foreground text-lg mb-6">
              Our drag-and-drop meal planner makes it simple to organize your weekly meals. Save time, reduce food waste, and enjoy stress-free cooking with a well-planned menu.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Organize meals by day and meal type",
                "Get a complete shopping list with one click",
                "Track nutritional information for your entire week",
                "Easily adjust portions based on serving sizes"
              ].map((item, index) => (
                <motion.li 
                  key={index}
                  className="flex items-start gap-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={mealPlanVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: 0.5 + (index * 0.1) }}
                >
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-primary-blue mt-1 flex-shrink-0"
                  >
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
            <Button 
              size="lg" 
              onClick={() => navigate('/meal-planner')}
              className="bg-primary-blue hover:bg-primary-blue/90 relative overflow-hidden group"
            >
              <span className="relative z-10">Try Meal Planner</span>
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MealPlanningSection;

