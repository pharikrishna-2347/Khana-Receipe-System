
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Plus, Trash2, RefreshCw, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import SearchBar from '@/components/SearchBar';
import { getRandomRecipes, getRecipeDetails, SpoonacularRecipe, searchRecipesByName, searchRecipesByIngredients } from '@/services/spoonacularService';

interface Meal {
  id: string;
  date: Date;
  recipeId: number;
  recipeName: string;
  recipeImage: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

interface WeeklyPlan {
  [day: string]: {
    breakfast: Meal | null;
    lunch: Meal | null;
    dinner: Meal | null;
    snack: Meal | null;
  };
}

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

const MealPlanner = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [recipes, setRecipes] = useState<SpoonacularRecipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchType, setSearchType] = useState<'recipe' | 'ingredient'>('recipe');
  const [isDragging, setIsDragging] = useState(false);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>(() => {
    const initialPlan: WeeklyPlan = {};
    const currentDate = new Date();
    const firstDayOfWeek = new Date(currentDate);
    firstDayOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(firstDayOfWeek);
      day.setDate(firstDayOfWeek.getDate() + i);
      const dayString = daysOfWeek[i];
      
      initialPlan[dayString] = {
        breakfast: null,
        lunch: null,
        dinner: null,
        snack: null
      };
    }
    
    return initialPlan;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedPlan = localStorage.getItem('weeklyMealPlan');
    if (savedPlan) {
      try {
        const parsedPlan = JSON.parse(savedPlan);
        Object.keys(parsedPlan).forEach(day => {
          Object.keys(parsedPlan[day]).forEach(mealType => {
            if (parsedPlan[day][mealType]) {
              parsedPlan[day][mealType].date = new Date(parsedPlan[day][mealType].date);
            }
          });
        });
        setWeeklyPlan(parsedPlan);
      } catch (error) {
        console.error('Error parsing saved meal plan:', error);
      }
    }
    
    fetchRandomRecipes();
  }, []);

  useEffect(() => {
    localStorage.setItem('weeklyMealPlan', JSON.stringify(weeklyPlan));
  }, [weeklyPlan]);

  const fetchRandomRecipes = async () => {
    if (isDragging) return; // Don't fetch recipes during drag operations
    
    setIsLoading(true);
    try {
      const randomRecipes = await getRandomRecipes(12);
      setRecipes(randomRecipes);
    } catch (error) {
      console.error('Error fetching random recipes:', error);
      toast({
        title: "Failed to fetch recipes",
        description: "We couldn't load recipes at this time. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string, type: 'recipe' | 'ingredient') => {
    if (isDragging) return; // Don't search during drag operations
    
    if (!query.trim()) {
      fetchRandomRecipes();
      return;
    }
    
    setIsSearching(true);
    setSearchType(type);
    setSearchQuery(query);
    
    try {
      let searchResults: SpoonacularRecipe[] = [];
      
      if (type === 'ingredient') {
        searchResults = await searchRecipesByIngredients(query);
      } else {
        searchResults = await searchRecipesByName(query);
      }
      
      setRecipes(searchResults);
      
      if (searchResults.length === 0) {
        toast({
          description: "No recipes found. Try a different search term.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Error",
        description: "Failed to search recipes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (result: DropResult) => {
    setIsDragging(false);
    const { source, destination } = result;
    
    // Return early if no destination or if dropped at the same place
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }
    
    // Dragging from recipe list to meal slot
    if (source.droppableId === 'recipeList') {
      const recipe = recipes[source.index];
      if (!recipe) return;
      
      const [destDay, destMealType] = destination.droppableId.split('-');
      if (!destDay || !destMealType || !mealTypes.includes(destMealType)) return;
      
      const newMeal: Meal = {
        id: `meal-${recipe.id}-${Date.now()}`, // Ensure unique ID
        date: selectedDate || new Date(),
        recipeId: recipe.id,
        recipeName: recipe.title,
        recipeImage: recipe.image || "https://placehold.co/300x200/orange/white?text=Recipe",
        mealType: destMealType as 'breakfast' | 'lunch' | 'dinner' | 'snack'
      };
      
      setWeeklyPlan(prevPlan => ({
        ...prevPlan,
        [destDay]: {
          ...prevPlan[destDay],
          [destMealType]: newMeal
        }
      }));
      
      toast({
        title: "Meal added to plan",
        description: `${recipe.title} added to ${destMealType} on ${destDay}`,
      });
    }
    // Dragging from one meal slot to another
    else if (source.droppableId !== destination.droppableId) {
      const [sourceDay, sourceMealType] = source.droppableId.split('-');
      const [destDay, destMealType] = destination.droppableId.split('-');
      
      if (!sourceDay || !sourceMealType || !destDay || !destMealType) {
        console.error("Invalid droppable ids", source.droppableId, destination.droppableId);
        return;
      }
      
      if (!weeklyPlan[sourceDay] || !weeklyPlan[destDay]) {
        console.error("Invalid day in plan", sourceDay, destDay);
        return;
      }
      
      const sourceMealKey = sourceMealType as keyof typeof weeklyPlan[typeof sourceDay];
      const destMealKey = destMealType as keyof typeof weeklyPlan[typeof destDay];
      
      const meal = weeklyPlan[sourceDay]?.[sourceMealKey];
      if (!meal) {
        console.error("No meal found at source", sourceDay, sourceMealType);
        return;
      }
      
      const updatedMeal: Meal = {
        ...meal,
        id: `meal-${meal.recipeId}-${Date.now()}`, // Ensure unique ID
        mealType: destMealType as 'breakfast' | 'lunch' | 'dinner' | 'snack'
      };
      
      setWeeklyPlan(prevPlan => {
        const newPlan = { ...prevPlan };
        // Remove from source
        newPlan[sourceDay] = {
          ...newPlan[sourceDay],
          [sourceMealType]: null
        };
        
        // Add to destination
        newPlan[destDay] = {
          ...newPlan[destDay],
          [destMealType]: updatedMeal
        };
        
        return newPlan;
      });
      
      toast({
        title: "Meal moved",
        description: `${meal.recipeName} moved to ${destMealType} on ${destDay}`,
      });
    }
  };

  const removeMeal = (day: string, mealType: string) => {
    if (isDragging) return; // Don't remove meals during drag operations
    
    setWeeklyPlan(prevPlan => ({
      ...prevPlan,
      [day]: {
        ...prevPlan[day],
        [mealType]: null
      }
    }));
    
    toast({
      title: "Meal removed",
      description: `Removed from ${mealType} on ${day}`,
    });
  };

  const generateGroceryListFromPlan = () => {
    if (isDragging) return; // Don't generate grocery list during drag operations
    
    const recipeIds: number[] = [];
    
    Object.values(weeklyPlan).forEach(dayMeals => {
      Object.values(dayMeals).forEach(meal => {
        if (meal && !recipeIds.includes(meal.recipeId)) {
          recipeIds.push(meal.recipeId);
        }
      });
    });
    
    localStorage.setItem('mealPlanRecipeIds', JSON.stringify(recipeIds));
    navigate('/grocery-list');
  };

  const clearMealPlan = () => {
    if (isDragging) return; // Don't clear meal plan during drag operations
    
    const emptyPlan: WeeklyPlan = {};
    
    daysOfWeek.forEach(day => {
      emptyPlan[day] = {
        breakfast: null,
        lunch: null,
        dinner: null,
        snack: null
      };
    });
    
    setWeeklyPlan(emptyPlan);
    
    toast({
      title: "Meal plan cleared",
      description: "Your weekly meal plan has been reset",
    });
  };

  // Helper function to generate unique draggable IDs for each meal
  const getMealDraggableId = useCallback((day: string, mealType: string, meal: Meal | null) => {
    if (!meal) return `empty-${day}-${mealType}-${Date.now()}`;
    return `draggable-${meal.id}`;
  }, []);

  return (
    <Layout>
      <div className="container px-4 md:px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Drag & Drop Meal Planner</h1>
            <p className="text-muted-foreground text-lg">
              Plan your meals for the week and generate a shopping list
            </p>
          </motion.div>
          
          <div className="flex justify-between mb-6">
            <Button onClick={clearMealPlan} variant="outline" className="gap-2" disabled={isDragging}>
              <Trash2 className="h-4 w-4" />
              Clear Plan
            </Button>
            <Button onClick={generateGroceryListFromPlan} className="gap-2" disabled={isDragging}>
              <ShoppingBag className="h-4 w-4" />
              Generate Grocery List
            </Button>
          </div>
          
          <div className="mb-8">
            <SearchBar onSearch={handleSearch} className="w-full" disabled={isDragging} />
          </div>
          
          <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 order-2 lg:order-1">
                <h2 className="text-xl font-semibold mb-4">Weekly Meal Plan</h2>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="bg-card rounded-lg shadow-sm p-3">
                      <h3 className="font-medium text-center border-b pb-2 mb-2">{day}</h3>
                      
                      {mealTypes.map((mealType) => {
                        const mealContent = weeklyPlan[day]?.[mealType as keyof typeof weeklyPlan[typeof day]];
                        const draggableId = getMealDraggableId(day, mealType, mealContent);
                        
                        return (
                          <div key={`${day}-${mealType}`} className="mb-3">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-sm font-medium capitalize">{mealType}</h4>
                            </div>
                            
                            <Droppable droppableId={`${day}-${mealType}`}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                  className={`min-h-[70px] rounded-md p-1 transition-colors ${
                                    snapshot.isDraggingOver 
                                      ? 'bg-primary/10 border-dashed border-2 border-primary/30' 
                                      : 'bg-muted/50'
                                  }`}
                                >
                                  {mealContent ? (
                                    <Draggable 
                                      draggableId={draggableId}
                                      index={0}
                                      key={draggableId}
                                    >
                                      {(provided) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          className="bg-background rounded shadow-sm p-2"
                                        >
                                          <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0">
                                              <img 
                                                src={mealContent.recipeImage || 'https://placehold.co/100x100/orange/white?text=Food'} 
                                                alt={mealContent.recipeName || 'Food item'}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                  (e.target as HTMLImageElement).src = "https://placehold.co/100x100/orange/white?text=Food";
                                                }}
                                              />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <p className="text-xs font-medium truncate">
                                                {mealContent.recipeName || ''}
                                              </p>
                                            </div>
                                            <button 
                                              onClick={() => removeMeal(day, mealType)}
                                              className="text-muted-foreground hover:text-destructive p-1 rounded-full"
                                              disabled={isDragging}
                                            >
                                              <Trash2 className="h-3 w-3" />
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                    </Draggable>
                                  ) : (
                                    <div className="flex justify-center items-center h-full">
                                      <p className="text-xs text-muted-foreground">Drop recipe here</p>
                                    </div>
                                  )}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="lg:col-span-1 order-1 lg:order-2">
                <div className="sticky top-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Recipe Library</h2>
                    <Button onClick={fetchRandomRecipes} variant="outline" size="sm" className="gap-1" disabled={isLoading || isSearching || isDragging}>
                      <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>
                  
                  {isLoading || isSearching ? (
                    <div className="flex justify-center items-center py-12">
                      <RefreshCw className="h-8 w-8 animate-spin text-primary-blue mr-2" />
                      <p>{isSearching ? 'Searching for recipes...' : 'Loading recipes...'}</p>
                    </div>
                  ) : (
                    <div className="bg-muted/30 rounded-lg p-4">
                      {searchQuery && (
                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground mb-2">
                            {searchType === 'recipe' ? 'Recipe search' : 'Ingredient search'} results for:
                          </p>
                          <Badge className="bg-primary-blue">{searchQuery}</Badge>
                        </div>
                      )}
                      
                      <Droppable droppableId="recipeList" isDropDisabled={true}>
                        {(provided) => (
                          <div 
                            ref={provided.innerRef} 
                            {...provided.droppableProps}
                            className="grid grid-cols-1 gap-3 max-h-[70vh] overflow-y-auto pr-1"
                          >
                            {recipes.map((recipe, index) => {
                              const recipeId = `recipe-${recipe.id}-${index}`;
                              return (
                                <Draggable 
                                  key={recipeId} 
                                  draggableId={recipeId} 
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="bg-card rounded-lg shadow-sm overflow-hidden cursor-move hover:shadow-md transition-shadow"
                                    >
                                      <div className="flex items-center p-2">
                                        <div className="w-12 h-12 rounded bg-muted mr-3 flex-shrink-0 overflow-hidden">
                                          <img 
                                            src={recipe.image || "https://placehold.co/300x200/orange/white?text=Recipe"} 
                                            alt={recipe.title}
                                            className="w-full h-full object-cover" 
                                            onError={(e) => {
                                              (e.target as HTMLImageElement).src = "https://placehold.co/300x200/orange/white?text=Recipe";
                                            }}
                                          />
                                        </div>
                                        <div>
                                          <h3 className="font-medium text-sm line-clamp-2">{recipe.title}</h3>
                                          <p className="text-xs text-muted-foreground mt-1">Drag to add to plan</p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DragDropContext>
        </div>
      </div>
    </Layout>
  );
};

export default MealPlanner;
