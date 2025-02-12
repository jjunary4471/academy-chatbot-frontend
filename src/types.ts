export type UserRole = 'TEACHER' | 'STUDENT' | 'PARENT';

export interface FamilyInfo {
  parentId: string;
  parentName: string;
}

export interface RiskHistory {
  RiskId: string;
  Status: '00' | '01';  // 00: unresolved, 01: resolved
  Description: string;
  Date: string;
  ResolutionComment?: string;
}

export interface RiskInfo {
  RiskHistory: RiskHistory[];
  TotalRiskCount: number;
  UnresolvedRiskCount: number;
}

export interface TypeDiagnosis {
  primaryType: string;
  secondaryType: string;
  diagnosisDate: string;
}

export interface Student {
  id: string;
  name: string;
  role: number;
  email: string;
  admissionDate: string;
  familyInfo?: FamilyInfo;
  personalityResult: {
    primaryType?: string;
    secondaryType?: string;
  };
  typeDiagnosis?: TypeDiagnosis[];
  riskInfo?: RiskInfo;
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
    primaryType: string;
    secondaryType: string;
  };
}

export interface Parent {
  id: string;
  name: string;
  email: string;
}