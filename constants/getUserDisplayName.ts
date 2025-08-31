export const getUserDisplayName = (user: any): string => {
  const displayName =
    user?.user_metadata?.display_name || user?.user_metadata?.full_name;

  if (displayName && typeof displayName === 'string') {
    return displayName;
  }

  // Check for first name in various locations
  const firstName =
    user?.user_metadata?.firstName ||
    user?.user_metadata?.first_name ||
    user?.app_metadata?.firstName ||
    user?.firstName ||
    user?.first_name;

  if (firstName && typeof firstName === 'string') {
    // Capitalize first letter and clean up
    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  }

  // Fallback to email parsing with better formatting
  if (user?.email) {
    const emailPrefix = user.email.split('@')[0];
    // Replace underscores and dots with spaces, then capitalize each word
    return emailPrefix
      .replace(/[._]/g, ' ')
      .split(' ')
      .map(
        (word: string) =>
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(' ');
  }

  return 'User';
};
