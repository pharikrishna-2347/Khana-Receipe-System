
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Plus, Trash2, RefreshCw } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import GroceryListItem from '@/components/GroceryListItem';
import { useToast } from '@/hooks/use-toast';
import { generateGroceryList } from '@/services/spoonacularService';

interface GroceryItem {
  id: number;
  name: string;
  amount: number;
  unit: string;
  aisle: string;
  image: string;
  checked?: boolean;
}

interface GroupedItems {
  [aisle: string]: GroceryItem[];
}

const GroceryList = () => {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [groupedItems, setGroupedItems] = useState<GroupedItems>({});
  const [newItemName, setNewItemName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load grocery list from local storage
    const storedList = localStorage.getItem('groceryList');
    if (storedList) {
      try {
        const parsedItems = JSON.parse(storedList);
        setItems(parsedItems);
      } catch (error) {
        console.error('Error parsing saved grocery list:', error);
      }
    }
    
    // Check if there are recipe IDs from meal plan
    const storedRecipeIds = localStorage.getItem('mealPlanRecipeIds');
    if (storedRecipeIds) {
      try {
        const recipeIds = JSON.parse(storedRecipeIds);
        if (recipeIds.length > 0 && (!storedList || !JSON.parse(storedList).length)) {
          // Only auto-generate if we have recipe IDs and no existing list
          generateListFromRecipes(recipeIds);
        }
      } catch (error) {
        console.error('Error parsing recipe IDs:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save grocery list to local storage whenever it changes
    localStorage.setItem('groceryList', JSON.stringify(items));
    
    // Group items by aisle
    const grouped: GroupedItems = {};
    items.forEach(item => {
      const aisle = item.aisle || 'Other';
      if (!grouped[aisle]) {
        grouped[aisle] = [];
      }
      grouped[aisle].push(item);
    });
    setGroupedItems(grouped);
  }, [items]);

  const addItem = () => {
    if (newItemName.trim() === '') return;

    const newItem: GroceryItem = {
      id: Date.now(),
      name: newItemName.trim(),
      amount: 1,
      unit: '',
      aisle: 'Custom Items',
      image: '',
      checked: false
    };

    setItems([...items, newItem]);
    setNewItemName('');
    
    toast({
      title: "Item added",
      description: `Added ${newItemName.trim()} to your grocery list.`,
    });
  };

  const deleteItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const toggleItem = (id: number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const clearList = () => {
    setItems([]);
    toast({
      title: "Grocery list cleared!",
      description: "All items have been removed from the list.",
    });
  };

  const generateListFromRecipes = async (recipeIds: number[] = []) => {
    setIsLoading(true);
    try {
      // Generate grocery list from recipe IDs stored in localStorage
      const generatedItems = await generateGroceryList(recipeIds);
      
      // Merge with existing items or replace if user confirms
      if (items.length > 0) {
        // Combine items, avoiding duplicates
        const existingItemNames = new Set(items.map(item => item.name.toLowerCase()));
        const newItems = generatedItems.filter(item => !existingItemNames.has(item.name.toLowerCase()));
        
        setItems([...items, ...newItems.map(item => ({...item, checked: false}))]);
      } else {
        setItems(generatedItems.map(item => ({...item, checked: false})));
      }
      
      toast({
        title: "Grocery list generated!",
        description: "Your shopping list has been created based on your meal plan.",
      });
    } catch (error) {
      console.error('Error generating grocery list:', error);
      toast({
        title: "Error generating list",
        description: "There was a problem creating your grocery list.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container px-4 md:px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center mb-6"
          >
            <ShoppingBag className="text-primary w-8 h-8 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold">Smart Grocery List</h1>
          </motion.div>
          
          <Card className="p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Add a new item..."
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addItem()}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={addItem} className="flex-shrink-0">
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
                <Button 
                  onClick={() => generateListFromRecipes([])} 
                  variant="secondary" 
                  className="flex-shrink-0"
                  disabled={isLoading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </Card>

          {Object.keys(groupedItems).length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-10 bg-muted/50 rounded-lg"
            >
              <p className="text-lg text-muted-foreground">Your grocery list is empty. Add items or generate from your meal plan!</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.05 }}
              className="space-y-6"
            >
              {Object.entries(groupedItems).map(([aisle, aisleItems]) => (
                <div key={aisle} className="bg-card shadow-sm rounded-lg overflow-hidden">
                  <div className="bg-muted p-3 flex items-center justify-between">
                    <h2 className="font-medium">{aisle}</h2>
                    <Badge variant="outline">{aisleItems.length}</Badge>
                  </div>
                  <div className="p-3">
                    <table className="w-full">
                      <tbody>
                        {aisleItems.map((item) => (
                          <GroceryListItem
                            key={item.id}
                            item={{...item, checked: item.checked || false}}
                            onToggle={toggleItem}
                            onDelete={deleteItem}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {items.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-8 flex justify-between items-center"
            >
              <div>
                <Badge variant="outline" className="mr-2">
                  {items.filter(item => !item.checked).length} items left
                </Badge>
                <Badge variant="outline">
                  {items.filter(item => item.checked).length} checked
                </Badge>
              </div>
              <Button variant="destructive" onClick={clearList} className="gap-2">
                <Trash2 className="w-4 h-4" />
                Clear List
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default GroceryList;
