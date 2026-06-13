// @types/programme.type.ts

export interface Programme {
  id: string;
  name: string;
  code: string;
  department: string;
  faculty: string;
  degreeAwarded: string;
  duration: number;
  totalCreditsRequired: number;
  level: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProgrammeFilters {
  department?: string;
  faculty?: string;
  level?: string;
  degreeAwarded?: string;
}