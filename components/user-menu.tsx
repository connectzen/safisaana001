'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { User, LogOut, Settings, Shield, ChevronUp, ChevronDown } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

function getGreeting() {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return { text: 'Good morning', emoji: '☀️' };
  } else if (hour >= 12 && hour < 17) {
    return { text: 'Good afternoon', emoji: '🌤️' };
  } else if (hour >= 17 && hour < 22) {
    return { text: 'Good evening', emoji: '🌆' };
  } else {
    return { text: 'Good night', emoji: '🌙' };
  }
}

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [loadingName, setLoadingName] = useState(true);
  const [greeting, setGreeting] = useState(getGreeting());
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, isAdmin, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    async function fetchUserName() {
      if (user?.uid) {
        setLoadingName(true);
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const name = userDoc.data()?.name || user.email?.split('@')[0] || 'User';
            setUserName(name);
            console.log('Header - User name loaded:', name);
          } else {
            const fallbackName = user.email?.split('@')[0] || 'User';
            setUserName(fallbackName);
            console.log('Header - Using fallback:', fallbackName);
          }
        } catch (error) {
          console.error('Header - Error fetching user name:', error);
          setUserName(user.email?.split('@')[0] || 'User');
        } finally {
          setLoadingName(false);
        }
      }
    }
    fetchUserName();
    
    // Listen for storage events (when profile is updated in another tab/window)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'profile-updated') {
        fetchUserName();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for custom event from same tab
    const handleProfileUpdate = () => {
      fetchUserName();
    };
    
    window.addEventListener('profile-updated', handleProfileUpdate as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profile-updated', handleProfileUpdate as EventListener);
    };
  }, [user]);

  // Update greeting every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-md transition-colors"
      >
        <User className="h-4 w-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {loadingName ? '...' : userName}
        </span>
        {isOpen ? (
          <ChevronDown className="h-3 w-3 text-gray-500" />
        ) : (
          <ChevronUp className="h-3 w-3 text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
              <span>{greeting.emoji}</span>
              <span>{greeting.text}, {userName}!</span>
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user.email}
            </p>
            {isAdmin && (
              <p className="text-xs text-primary flex items-center gap-1 mt-2 bg-blue-50 px-2 py-1 rounded-full w-fit">
                <Shield className="h-3 w-3" />
                Admin Account
              </p>
            )}
          </div>

          <div className="py-1">
            <Link
              href="/profile"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="h-4 w-4" />
              Edit Profile
            </Link>
            
            {isAdmin && (
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="h-4 w-4" />
                Dashboard
              </Link>
            )}
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
