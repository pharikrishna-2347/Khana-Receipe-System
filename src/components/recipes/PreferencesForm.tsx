
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const CUISINES = ['Italian', 'Japanese', 'Mexican', 'Indian', 'French', 'Thai', 'Mediterranean'];
const DIETARY_PREFERENCES = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo'];
const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export const PreferencesForm = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState({
    dietary_preferences: [] as string[],
    favorite_cuisines: [] as string[],
    cooking_skill_level: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserPreferences();
    }
  }, [user]);

  const fetchUserPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      if (data) {
        setPreferences({
          dietary_preferences: data.dietary_preferences || [],
          favorite_cuisines: data.favorite_cuisines || [],
          cooking_skill_level: data.cooking_skill_level || '',
        });
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  const togglePreference = (item: string, type: 'dietary_preferences' | 'favorite_cuisines') => {
    setPreferences(prev => ({
      ...prev,
      [type]: prev[type].includes(item)
        ? prev[type].filter(p => p !== item)
        : [...prev[type], item]
    }));
  };

  const savePreferences = async () => {
    if (!user) {
      toast.error('Please sign in to save preferences');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ...preferences,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      toast.success('Preferences saved successfully!');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-card rounded-lg border border-border">
      <div>
        <h3 className="text-lg font-medium mb-4">Dietary Preferences</h3>
        <div className="flex flex-wrap gap-2">
          {DIETARY_PREFERENCES.map(pref => (
            <Button
              key={pref}
              size="sm"
              variant={preferences.dietary_preferences.includes(pref) ? 'default' : 'outline'}
              onClick={() => togglePreference(pref, 'dietary_preferences')}
            >
              {pref}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Favorite Cuisines</h3>
        <div className="flex flex-wrap gap-2">
          {CUISINES.map(cuisine => (
            <Button
              key={cuisine}
              size="sm"
              variant={preferences.favorite_cuisines.includes(cuisine) ? 'default' : 'outline'}
              onClick={() => togglePreference(cuisine, 'favorite_cuisines')}
            >
              {cuisine}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Cooking Skill Level</h3>
        <Select
          value={preferences.cooking_skill_level}
          onValueChange={(value) => setPreferences(prev => ({ ...prev, cooking_skill_level: value }))}
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
        className="w-full" 
        onClick={savePreferences} 
        disabled={isLoading}
      >
        {isLoading ? 'Saving...' : 'Save Preferences'}
      </Button>
    </div>
  );
};
