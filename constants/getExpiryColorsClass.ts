export const getExpiryColorClass = (days: number | undefined) => {
  if (typeof days !== 'number') return 'text-gray-400';
  if (days <= 0) return 'text-red-700 dark:text-red-400';
  if (days <= 3) return 'text-red-500';
  if (days <= 5) return 'text-orange-500 dark:text-orange-400';
  if (days <= 7) return 'text-yellow-500 dark:text-yellow-300';
  return 'text-green-500';
};
