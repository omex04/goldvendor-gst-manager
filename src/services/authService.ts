
// A simple mock authentication service for local development
// This will be replaced by a real authentication service in production

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

// Sample users for local development
const sampleUsers = [
  {
    id: '1',
    email: 'demo@example.com',
    password: 'password123',
    name: 'Demo User',
    role: 'admin',
  },
  {
    id: '2',
    email: 'user@example.com',
    password: 'password123',
    name: 'Regular User',
    role: 'user',
  },
];

// Check if user is authenticated by checking localStorage
export const isAuthenticated = (): boolean => {
  return localStorage.getItem('auth_user') !== null;
};

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('auth_user');
  if (!userStr) return null;
  
  try {
    const user = JSON.parse(userStr);
    return user;
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    return null;
  }
};

// Login function
export const login = async (credentials: LoginCredentials): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Find user by email and password
  const user = sampleUsers.find(
    u => u.email === credentials.email && u.password === credentials.password
  );
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  // Create user object without password
  const userData: User = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
  
  // Store in localStorage
  localStorage.setItem('auth_user', JSON.stringify(userData));
  localStorage.setItem('isAuthenticated', 'true');
  
  return userData;
};

// Logout function
export const logout = (): void => {
  localStorage.removeItem('auth_user');
  localStorage.removeItem('isAuthenticated');
};

// Register function (for future implementation)
export const register = async (userData: any): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if email already exists
  if (sampleUsers.some(user => user.email === userData.email)) {
    throw new Error('Email already registered');
  }
  
  // In a real app, this would create a new user
  // For now, just return a mock user
  const newUser: User = {
    id: '3',
    email: userData.email,
    name: userData.name || 'New User',
    role: 'user',
  };
  
  localStorage.setItem('auth_user', JSON.stringify(newUser));
  localStorage.setItem('isAuthenticated', 'true');
  
  return newUser;
};

// This function would be replaced with Supabase authentication in production
export const migrateToSupabase = () => {
  // Note: This is just a placeholder function that would be replaced
  // when implementing Supabase authentication
  console.log('Ready to migrate to Supabase authentication');
};
