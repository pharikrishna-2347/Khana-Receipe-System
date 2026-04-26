
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';
import VoiceSearch from './VoiceSearch';

interface SearchBarProps {
  onSearch: (query: string, type: 'recipe' | 'ingredient') => void;
  className?: string;
  disabled?: boolean; // Added disabled prop
}

const SearchBar = ({ onSearch, className, disabled = false }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'recipe' | 'ingredient'>('recipe');
  const [isFocused, setIsFocused] = useState(false);
  const [voiceSearchActive, setVoiceSearchActive] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !disabled) {
      onSearch(query, searchType);
    }
  };

  const handleVoiceSearchResult = (text: string) => {
    setQuery(text);
    setVoiceSearchActive(true);
    if (text.trim() && !disabled) {
      onSearch(text, searchType);
    }
  };

  // Auto-trigger search when voice search provides a result
  useEffect(() => {
    if (voiceSearchActive && query.trim() && !disabled) {
      onSearch(query, searchType);
      setVoiceSearchActive(false);
    }
  }, [voiceSearchActive, query, searchType, onSearch, disabled]);

  return (
    <div className={cn('w-full max-w-3xl mx-auto', className)}>
      <Tabs 
        value={searchType} 
        onValueChange={(value) => setSearchType(value as 'recipe' | 'ingredient')}
        className="mb-4"
      >
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-secondary dark:bg-gray-800">
          <TabsTrigger 
            value="recipe" 
            className="data-[state=active]:bg-white data-[state=active]:text-foreground dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100 dark:text-gray-300"
            disabled={disabled}
          >
            Recipe Search
          </TabsTrigger>
          <TabsTrigger 
            value="ingredient" 
            className="data-[state=active]:bg-white data-[state=active]:text-foreground dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100 dark:text-gray-300"
            disabled={disabled}
          >
            Ingredient Search
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <motion.form 
        onSubmit={handleSearch}
        className={cn(
          'relative w-full flex items-center gap-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl px-4 py-3',
          'focus-within:ring-2 focus-within:ring-primary-blue/20 focus-within:border-primary-blue/30',
          'transition-shadow shadow-sm dark:shadow-none',
          isFocused ? 'shadow-lg dark:shadow-primary-blue/5' : '',
          disabled ? 'opacity-70 cursor-not-allowed' : '',
          className
        )}
        initial={false}
        animate={isFocused && !disabled ? { scale: 1.01 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Search 
          size={20}
          className="text-muted-foreground dark:text-gray-400 flex-shrink-0"
        />
        
        <input
          type="text"
          placeholder={
            searchType === 'recipe' 
              ? "Search for any recipe (e.g., cake, pasta, curry)..." 
              : "Enter ingredients you have (e.g., chicken, tomatoes, rice)..."
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => !disabled && setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 bg-transparent border-none outline-none text-foreground dark:text-gray-100 placeholder:text-muted-foreground/70 dark:placeholder:text-gray-500"
          disabled={disabled}
        />
        
        <AnimatePresence>
          {query && (
            <motion.button
              type="button"
              onClick={() => setQuery('')}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="p-1 text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none rounded-full focus:bg-muted/50"
              aria-label="Clear search"
              disabled={disabled}
            >
              <X size={16} />
            </motion.button>
          )}
        </AnimatePresence>
        
        <VoiceSearch onSearchResult={handleVoiceSearchResult} />
        
        <Button 
          type="submit" 
          className="bg-primary-blue hover:bg-primary-blue/90 text-white dark:bg-primary-blue/80 dark:hover:bg-primary-blue/70 font-medium rounded-xl"
          disabled={disabled}
        >
          Search
        </Button>
      </motion.form>
    </div>
  );
};

export default SearchBar;
