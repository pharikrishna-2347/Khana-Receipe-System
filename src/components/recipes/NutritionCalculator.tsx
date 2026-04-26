
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface NutritionProps {
  nutritionFacts: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  servingSize?: number;
}

const NutritionCalculator = ({ nutritionFacts, servingSize = 1 }: NutritionProps) => {
  const [servings, setServings] = useState(servingSize);
  
  // Daily recommended values (based on 2000 calorie diet)
  const dailyValues = {
    calories: 2000,
    protein: 50, // grams
    carbs: 275, // grams
    fat: 65 // grams
  };

  // Calculate per serving
  const perServing = {
    calories: Math.round(nutritionFacts.calories * servings),
    protein: Math.round(nutritionFacts.protein * servings),
    carbs: Math.round(nutritionFacts.carbs * servings),
    fat: Math.round(nutritionFacts.fat * servings)
  };

  // Calculate percentages of daily values
  const percentages = {
    calories: Math.round((perServing.calories / dailyValues.calories) * 100),
    protein: Math.round((perServing.protein / dailyValues.protein) * 100),
    carbs: Math.round((perServing.carbs / dailyValues.carbs) * 100),
    fat: Math.round((perServing.fat / dailyValues.fat) * 100)
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Nutrition Facts</h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Calories</span>
            <span className="font-medium">{perServing.calories} kcal</span>
          </div>
          <Progress value={percentages.calories} className="h-2" />
          <span className="text-xs text-muted-foreground">{percentages.calories}% of daily value*</span>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Protein</span>
            <span className="font-medium">{perServing.protein}g</span>
          </div>
          <Progress value={percentages.protein} className="h-2" />
          <span className="text-xs text-muted-foreground">{percentages.protein}% of daily value*</span>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Carbohydrates</span>
            <span className="font-medium">{perServing.carbs}g</span>
          </div>
          <Progress value={percentages.carbs} className="h-2" />
          <span className="text-xs text-muted-foreground">{percentages.carbs}% of daily value*</span>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Fat</span>
            <span className="font-medium">{perServing.fat}g</span>
          </div>
          <Progress value={percentages.fat} className="h-2" />
          <span className="text-xs text-muted-foreground">{percentages.fat}% of daily value*</span>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          * Percent Daily Values are based on a 2,000 calorie diet.
          Your daily values may be higher or lower depending on your calorie needs.
        </p>
      </div>
    </Card>
  );
};

export default NutritionCalculator;
