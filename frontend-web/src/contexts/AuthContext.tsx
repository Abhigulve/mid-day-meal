import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  username: string;
  full_name: string;
  email: string;
  role: 'ADMIN' | 'SCHOOL_ADMIN' | 'TEACHER';
  school_id?: number;
  school_name?: string;
  active: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  isAdmin: boolean;
  isSchoolAdmin: boolean;
  isTeacher: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app startup
    const savedUser = localStorage.getItem('current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get users from localStorage (in real app, this would be an API call)
      const users = JSON.parse(localStorage.getItem('users_data') || '[]');
      const schools = JSON.parse(localStorage.getItem('schools_data') || '[]');
      
      // Find user (in real app, password would be hashed and verified server-side)
      const foundUser = users.find((u: any) => u.username === username && u.active);
      
      if (foundUser) {
        // In real app, verify password hash here
        // For demo, we'll accept any password for existing users
        
        // Get school name if user is associated with a school
        const school = foundUser.school_id ? schools.find((s: any) => s.id === foundUser.school_id) : null;
        
        const authUser: User = {
          id: foundUser.id,
          username: foundUser.username,
          full_name: foundUser.full_name,
          email: foundUser.email,
          role: foundUser.role,
          school_id: foundUser.school_id,
          school_name: school?.name,
          active: foundUser.active
        };
        
        setUser(authUser);
        localStorage.setItem('current_user', JSON.stringify(authUser));
        setLoading(false);
        return true;
      }
      
      // Check if it's the default admin user
      if (username === 'admin' && password === 'admin123') {
        const adminUser: User = {
          id: 0,
          username: 'admin',
          full_name: 'सिस्टम प्रशासक (System Administrator)',
          email: 'admin@middaymeal.gov.in',
          role: 'ADMIN',
          active: true
        };
        
        setUser(adminUser);
        localStorage.setItem('current_user', JSON.stringify(adminUser));
        setLoading(false);
        return true;
      }
      
      setLoading(false);
      return false;
    } catch (error) {
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('current_user');
  };

  const isAdmin = user?.role === 'ADMIN';
  const isSchoolAdmin = user?.role === 'SCHOOL_ADMIN';
  const isTeacher = user?.role === 'TEACHER';

  const value: AuthContextType = {
    user,
    login,
    logout,
    loading,
    isAdmin,
    isSchoolAdmin,
    isTeacher
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};