
type UserRole = 'student' | 'teacher' | 'admin' | 'guest';

export const canViewCourse = (role: UserRole): boolean => {
  return role === 'student' || role === 'teacher' || role === 'admin';
};

export const canCreateCourse = (role: UserRole): boolean => {
  return role === 'teacher' || role === 'admin';
};

export const canEditCourse = (role: UserRole): boolean => {
  return role === 'teacher' || role === 'admin';
};

export const canAccessAdminPanel = (role: UserRole): boolean => {
  return role === 'admin';
};

export const getRoleDisplayName = (role: UserRole): string => {
  switch (role) {
    case 'student':
      return 'Студент';
    case 'teacher':
      return 'Преподаватель';
    case 'admin':
      return 'Администратор';
    case 'guest':
    default:
      return 'Гость';
  }
};
