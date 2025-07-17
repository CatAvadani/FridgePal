import { supabase } from './supabase';

export interface AuthResult {
  success: boolean;
  message: string;
  error?: string;
}

// Login with email and password
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log(' Supabase sign in response:', {
      user: data.user ? 'User found' : 'No user',
      session: data.session ? 'Session created' : 'No session',
      error: error ? error.message : 'No error',
    });

    if (error) {
      console.error('Sign in error:', error);

      if (error.message.includes('Invalid login credentials')) {
        return {
          success: false,
          message: 'Invalid email or password. Please check your credentials.',
          error: error.message,
        };
      }

      if (error.message.includes('Email not confirmed')) {
        return {
          success: false,
          message:
            'Please check your email and click the confirmation link before signing in.',
          error: error.message,
        };
      }

      return {
        success: false,
        message: error.message,
        error: error.message,
      };
    }

    console.log('Sign in successful');
    return {
      success: true,
      message: 'Sign in successful!',
    };
  } catch (error) {
    console.error('Sign in failed:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Register with email and password
export const signUpWithEmail = async (
  email: string,
  password: string,
  firstName?: string,
  lastName?: string
): Promise<AuthResult> => {
  try {
    console.log('📝 Starting Supabase registration...');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    console.log('Supabase registration response:', {
      user: data.user ? 'User created' : 'No user',
      session: data.session ? 'Session created' : 'No session',
      error: error ? error.message : 'No error',
    });

    if (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.message,
        error: error.message,
      };
    }

    // Check if user was created but needs email confirmation
    if (data.user && !data.session) {
      console.log('📧 User created, email confirmation required');
      return {
        success: true,
        message: 'Please check your inbox for email verification!',
      };
    }

    // Check if user was created and session exists (auto-login)
    if (data.user && data.session) {
      console.log('User created and auto-signed in');
      return {
        success: true,
        message: 'Account created successfully!',
      };
    }

    // Fallback case
    console.warn('Unexpected registration response');
    return {
      success: true,
      message: 'Registration completed, please try signing in.',
    };
  } catch (error) {
    console.error('Registration failed:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Sign out
export const signOut = async (): Promise<AuthResult> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        message: error.message,
        error: error.message,
      };
    }

    return {
      success: true,
      message: 'Signed out successfully!',
    };
  } catch (error) {
    return {
      success: false,
      message: 'An unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
