import { z } from 'zod';

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .max(100, 'Email must be less than 100 characters');

export const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 8 characters')
  .max(100, 'Password must be less than 100 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(
    /[^a-zA-Z0-9]/,
    'Password must contain at least one special character'
  );

export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .regex(
    /^[a-zA-Z\s'-]+$/,
    'Name can only contain letters, spaces, hyphens, and apostrophes'
  );

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

export const checkPasswordStrength = (
  password: string
): {
  score: number;
  feedback: string;
  color: string;
} => {
  let score = 0;
  const checks = [
    { test: /.{6,}/, points: 1 }, // Length
    { test: /[a-z]/, points: 1 }, // Lowercase
    { test: /[A-Z]/, points: 1 }, // Uppercase
    { test: /[0-9]/, points: 1 }, // Numbers
    { test: /[^a-zA-Z0-9]/, points: 1 }, // Special chars
    { test: /.{12,}/, points: 1 }, // Extra length bonus
  ];

  checks.forEach((check) => {
    if (check.test.test(password)) score += check.points;
  });

  if (score <= 2) {
    return { score, feedback: 'Weak', color: '#EF4444' };
  } else if (score <= 4) {
    return { score, feedback: 'Medium', color: '#F59E0B' };
  } else {
    return { score, feedback: 'Strong', color: '#10B981' };
  }
};

// Supabase error message mapper
export const mapSupabaseError = (error: any): string => {
  const message = error?.message || '';

  // Common Supabase auth errors
  if (message.includes('Invalid login credentials')) {
    return 'Invalid email or password. Please check your credentials and try again.';
  }

  if (message.includes('Email not confirmed')) {
    return 'Please check your email and click the confirmation link before signing in.';
  }

  if (message.includes('User already registered')) {
    return 'An account with this email already exists. Try signing in instead.';
  }

  if (message.includes('Password should be at least')) {
    return 'Password must be at least 6 characters long.';
  }

  if (message.includes('Unable to validate email address')) {
    return 'Please enter a valid email address.';
  }

  if (message.includes('signup is disabled')) {
    return 'New registrations are temporarily disabled. Please try again later.';
  }

  if (message.includes('Email rate limit exceeded')) {
    return 'Too many email attempts. Please wait a few minutes before trying again.';
  }

  if (message.includes('Network request failed') || message.includes('fetch')) {
    return 'Network error. Please check your internet connection and try again.';
  }

  return 'Something went wrong. Please try again.';
};
