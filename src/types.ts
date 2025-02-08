export type UserRole = 'TEACHER' | 'STUDENT' | 'PARENT';

export interface Student {
  id: number;
  userId: string;
  name: string;
  enrollmentDate: string;
  studentType: string;
}

export interface User {
  userId: string;
  role: UserRole;
}

export interface SignupForm {
  academyId: string;
  id: string;
  name: string;
  role: number;
  email: string;
  childId?: string;
}