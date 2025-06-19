export interface Product {
  id: string;
  name: string;
  category: string;
  expirationDate: string;
  daysUntilExpiry: number;
}

export const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Milk',
    daysUntilExpiry: 10,
    category: 'dairy',
    expirationDate: '2025-06-22',
  },
  {
    id: '2',
    name: 'Eggs',
    daysUntilExpiry: 5,
    category: 'dairy',
    expirationDate: '2025-06-24',
  },
  {
    id: '3',
    name: 'Butter',
    daysUntilExpiry: 7,
    category: 'dairy',
    expirationDate: '2025-06-26',
  },
  {
    id: '4',
    name: 'Cheese',
    daysUntilExpiry: 10,
    category: 'dairy',
    expirationDate: '2025-06-29',
  },
  {
    id: '5',
    name: 'Yogurt',
    daysUntilExpiry: 1,
    category: 'dairy',
    expirationDate: '2025-06-21',
  },
  {
    id: '6',
    name: 'Chicken Breast',
    daysUntilExpiry: 2,
    category: 'meat',
    expirationDate: '2025-06-22',
  },
  {
    id: '7',
    name: 'Ground Beef',
    daysUntilExpiry: 4,
    category: 'meat',
    expirationDate: '2025-06-24',
  },
  {
    id: '8',
    name: 'Salmon Fillet',
    daysUntilExpiry: 0,
    category: 'fish',
    expirationDate: '2025-06-20',
  },
  {
    id: '9',
    name: 'Broccoli',
    daysUntilExpiry: 6,
    category: 'vegetable',
    expirationDate: '2025-06-25',
  },
  {
    id: '10',
    name: 'Carrots',
    daysUntilExpiry: 8,
    category: 'vegetable',
    expirationDate: '2025-06-27',
  },
];

export const getExpiryColorClass = (days: number) => {
  if (days <= 0) return 'text-red-700';
  if (days <= 3) return 'text-red-500';
  if (days <= 5) return 'text-orange-500';
  if (days <= 7) return 'text-yellow-500';
  return 'text-green-500';
};
