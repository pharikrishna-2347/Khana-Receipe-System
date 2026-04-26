
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

interface GroceryItem {
  id: number;
  name: string;
  amount: number;
  unit: string;
  aisle: string;
  image: string;
  checked: boolean;
}

interface GroceryListItemProps {
  item: GroceryItem;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const GroceryListItem = ({ item, onToggle, onDelete }: GroceryListItemProps) => {
  return (
    <motion.tr
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className={`border-b border-border last:border-0 transition-colors hover:bg-muted/50 ${item.checked ? "opacity-60" : ""}`}
    >
      <td className="py-2 pl-1 pr-2 w-10">
        <Checkbox
          id={`item-${item.id}`}
          checked={item.checked}
          onCheckedChange={() => onToggle(item.id)}
        />
      </td>
      <td className="py-2 px-2 w-12">
        <div className="w-10 h-10 rounded bg-muted overflow-hidden">
          <img 
            src={item.image || "https://placehold.co/100x100/orange/white?text=Item"} 
            alt={item.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "https://placehold.co/100x100/orange/white?text=Item";
            }}
          />
        </div>
      </td>
      <td className="py-2 px-2">
        <label
          htmlFor={`item-${item.id}`}
          className={`font-medium ${
            item.checked ? 'line-through text-muted-foreground' : ''
          }`}
        >
          {item.name}
        </label>
      </td>
      <td className="py-2 px-2 text-right">
        <span className="text-sm text-muted-foreground">
          {item.amount} {item.unit}
        </span>
      </td>
      <td className="py-2 pl-2 pr-1 w-10 text-right">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(item.id)}
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </td>
    </motion.tr>
  );
};

export default GroceryListItem;
