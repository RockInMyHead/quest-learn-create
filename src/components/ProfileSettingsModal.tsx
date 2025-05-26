
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import UserProfileSettings from '@/components/UserProfileSettings';
import { useAuth } from '@/context/AuthContext';

const ProfileSettingsModal = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  if (!user) return null;

  const handleSave = (userData: { name: string; email: string; currentPassword?: string; newPassword?: string }) => {
    console.log('Saving user data:', userData);
    // Здесь будет логика сохранения данных пользователя
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Настройки
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Настройки профиля</DialogTitle>
          <DialogDescription>
            Управляйте своими личными данными и настройками безопасности
          </DialogDescription>
        </DialogHeader>
        <UserProfileSettings user={user} onSave={handleSave} />
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSettingsModal;
