
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Lock, Save } from 'lucide-react';

interface UserProfileSettingsProps {
  user: {
    name: string;
    email: string;
  };
  onSave?: (userData: { name: string; email: string; currentPassword?: string; newPassword?: string }) => void;
}

const UserProfileSettings: React.FC<UserProfileSettingsProps> = ({ user, onSave }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      // Здесь можно добавить тост уведомление об ошибке
      console.error('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    // Симуляция сохранения
    setTimeout(() => {
      if (onSave) {
        onSave({ 
          name, 
          email,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined
        });
      }
      setIsLoading(false);
      // Здесь можно добавить тост уведомление об успешном сохранении
    }, 1000);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Настройки профиля</CardTitle>
        <CardDescription>
          Обновите ваши личные данные и настройки безопасности
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Имя</Label>
            <div className="relative">
              <User className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-8"
                placeholder="Ваше имя"
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-8"
                placeholder="your@email.com"
              />
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-medium mb-3 flex items-center">
              <Lock className="h-4 w-4 mr-1" />
              Изменение пароля
            </h3>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="currentPassword">Текущий пароль</Label>
                <Input 
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="newPassword">Новый пароль</Label>
                <Input 
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                <Input 
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-opacity-20 border-t-white"></div>
                Сохранение...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Сохранить изменения
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default UserProfileSettings;
