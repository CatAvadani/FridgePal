interface ExpiringItem {
  id: string;
  name: string;
  daysUntilExpiry: number;
  category: string;
}

export const expiringItems: ExpiringItem[] = [
  { id: '1', name: 'Milk', daysUntilExpiry: 3, category: 'dairy' },
  { id: '2', name: 'Eggs', daysUntilExpiry: 5, category: 'dairy' },
  { id: '3', name: 'Butter', daysUntilExpiry: 7, category: 'dairy' },
  { id: '4', name: 'Cheese', daysUntilExpiry: 10, category: 'dairy' },
  { id: '5', name: 'Yogurt', daysUntilExpiry: 1, category: 'dairy' },
  { id: '6', name: 'Chicken Breast', daysUntilExpiry: 2, category: 'meat' },
  { id: '7', name: 'Ground Beef', daysUntilExpiry: 4, category: 'meat' },
  { id: '8', name: 'Salmon Fillet', daysUntilExpiry: 0, category: 'fish' },
  { id: '9', name: 'Broccoli', daysUntilExpiry: 6, category: 'vegetable' },
  { id: '10', name: 'Carrots', daysUntilExpiry: 8, category: 'vegetable' },
];

export const getExpiryColorClass = (days: number) => {
  if (days <= 0) return 'text-red-700';
  if (days <= 3) return 'text-red-500';
  if (days <= 5) return 'text-orange-500';
  if (days <= 7) return 'text-yellow-500';
  return 'text-green-500';
};
