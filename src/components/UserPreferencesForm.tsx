
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const DIETARY_OPTIONS = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Pescatarian'];
const CUISINE_OPTIONS = ['Italian', 'Mexican', 'Chinese', 'Indian', 'Mediterranean', 'American'];
const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Professional'];

export const UserPreferencesForm: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [favoriteCuisines, setFavoriteCuisines] = useState<string[]>([]);
  const [cookingSkillLevel, setCookingSkillLevel] = useState<string>('');

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (data) {
          setDietaryPreferences(data.dietary_preferences || []);
          setFavoriteCuisines(data.favorite_cuisines || []);
          setCookingSkillLevel(data.cooking_skill_level || '');
        }
      }
    };

    fetchUser();
  }, []);

  const handleSavePreferences = async () => {
    if (!user) {
      toast.error('Please log in to set preferences');
      return;
    }

    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        dietary_preferences: dietaryPreferences,
        favorite_cuisines: favoriteCuisines,
        cooking_skill_level: cookingSkillLevel
      }, { onConflict: 'user_id' });

    if (error) {
      toast.error('Failed to save preferences');
      console.error(error);
    } else {
      toast.success('Preferences saved successfully!');
    }
  };

  const togglePreference = (preference: string, type: 'dietary' | 'cuisine') => {
    const setter = type === 'dietary' ? setDietaryPreferences : setFavoriteCuisines;
    const currentPreferences = type === 'dietary' ? dietaryPreferences : favoriteCuisines;

    setter(
      currentPreferences.includes(preference)
        ? currentPreferences.filter(p => p !== preference)
        : [...currentPreferences, preference]
    );
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Your Culinary Preferences</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Dietary Preferences</label>
        <div className="flex flex-wrap gap-2">
          {DIETARY_OPTIONS.map(diet => (
            <Button
              key={diet}
              variant={dietaryPreferences.includes(diet) ? 'default' : 'outline'}
              onClick={() => togglePreference(diet, 'dietary')}
              size="sm"
            >
              {diet}
            </Button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Favorite Cuisines</label>
        <div className="flex flex-wrap gap-2">
          {CUISINE_OPTIONS.map(cuisine => (
            <Button
              key={cuisine}
              variant={favoriteCuisines.includes(cuisine) ? 'default' : 'outline'}
              onClick={() => togglePreference(cuisine, 'cuisine')}
              size="sm"
            >
              {cuisine}
            </Button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Cooking Skill Level</label>
        <Select 
          value={cookingSkillLevel} 
          onValueChange={setCookingSkillLevel}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your skill level" />
          </SelectTrigger>
          <SelectContent>
            {SKILL_LEVELS.map(level => (
              <SelectItem key={level} value={level}>{level}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button 
        onClick={handleSavePreferences} 
        className="w-full"
        disabled={!user}
      >
        Save Preferences
      </Button>
    </div>
  );
};
