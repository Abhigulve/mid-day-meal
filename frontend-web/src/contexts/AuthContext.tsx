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
      // Check if it's the default admin user first
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
      
      // For database users, we'll simulate the authentication
      // In a real system, this would call the backend API
      const knownUsers = [
        { username: 'teacher_gade001', password: 'P@ssw0rd', fullName: 'गाडे वस्ती शिक्षक', role: 'TEACHER', schoolName: 'गाडे वस्ती प्राथमिक शाळा' },
        { username: 'teacher_gps001', password: 'teacher123', fullName: 'Mr. Ganesh Bhosale', role: 'TEACHER', schoolName: 'Government Primary School Pimpri' },
        { username: 'principal_gps001', password: 'principal123', fullName: 'Mrs. Sunita Sharma', role: 'SCHOOL_ADMIN', schoolName: 'Government Primary School Pimpri' }
      ];
      
      const foundUser = knownUsers.find(u => u.username === username && u.password === password);
      
      if (foundUser) {
        const authUser: User = {
          id: Date.now(),
          username: foundUser.username,
          full_name: foundUser.fullName,
          email: `${foundUser.username}@school.com`,
          role: foundUser.role as any,
          school_name: foundUser.schoolName,
          active: true
        };
        
        setUser(authUser);
        localStorage.setItem('current_user', JSON.stringify(authUser));
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