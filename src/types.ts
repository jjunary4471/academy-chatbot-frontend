export type UserRole = 'TEACHER' | 'STUDENT' | 'PARENT';

export interface Student {
  id: string;
  name: string;
  role: number;
  email: string;
  admissionDate: string;
  personalityResult: {
    primaryType?: '벗꽃' | '복숭아' | '자두';
    secondaryType?: '디지털' | '아날로그';
  };
}

export interface User {
  userId: string;
  role: UserRole;
  academyId: string;
  name: string;
}

export interface SignupForm {
  academyId: string;
  id: string;
  name: string;
  role: number;
  email: string;
  childId?: string;
  admissionDate?: string;
}

export interface PersonalityReport {
  id: string;
  studentId: string;
  testDate: string;
  result: {
    primaryType: '벗꽃' | '복숭아' | '자두';
    secondaryType: '디지털' | '아날로그';
  };
}

export interface Parent {
  id: string;
  name: string;
  email: string;
}