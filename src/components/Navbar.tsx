
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn, User, BookOpen, Menu, X } from 'lucide-react';

interface NavbarProps {
  user?: {
    name: string;
    role: 'student' | 'teacher' | 'admin' | 'guest';
  } | null;
}

const Navbar = ({ user }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Логика выхода будет добавлена позже
    console.log('Logout clicked');
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EduPlatform
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/courses" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Курсы
            </Link>
            
            {user ? (
              <>
                {(user.role === 'teacher' || user.role === 'admin') && (
                  <Link to="/create-course" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Создать курс
                  </Link>
                )}
                
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Админ панель
                  </Link>
                )}
                
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700 text-sm">{user.name}</span>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Выйти
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">
                    <LogIn className="h-4 w-4 mr-2" />
                    Войти
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Регистрация</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/courses" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
                Курсы
              </Link>
              
              {user ? (
                <>
                  {(user.role === 'teacher' || user.role === 'admin') && (
                    <Link to="/create-course" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
                      Создать курс
                    </Link>
                  )}
                  
                  {user.role === 'admin' && (
                    <Link to="/admin" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
                      Админ панель
                    </Link>
                  )}
                  
                  <div className="px-3 py-2 border-t border-gray-200 mt-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="h-5 w-5 text-gray-600" />
                      <span className="text-gray-700 text-sm">{user.name}</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleLogout} className="w-full">
                      Выйти
                    </Button>
                  </div>
                </>
              ) : (
                <div className="px-3 py-2 space-y-2">
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link to="/login">
                      <LogIn className="h-4 w-4 mr-2" />
                      Войти
                    </Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link to="/register">Регистрация</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
