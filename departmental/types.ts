
import React from 'react';

export type ProgramType = 'Undergraduate' | 'Post Graduate' | 'Masters' | 'PhD';

export interface Program {
  id: string;
  name: string;
  code: string;
  type: ProgramType;
  year: string;
  duration: string;
  status: 'Active' | 'Completed' | 'Retired';
}

export interface Course {
  id: string;
  code: string;
  title: string;
  units: number;
  type: 'Department' | 'General' | 'Faculty';
  lecturers: string[];
  prerequisites: string[];
  fee: number;
  availableFor: ProgramType[];
  status: 'Active' | 'Archived';
  level: string;
  semester: string;
}

export type StudentRole = 'Class Rep' | 'Dept Rep' | 'None' | 'Bachelors' | 'PGD' | 'Masters';

export interface Student {
  id: string;
  regNo: string;
  matNo: string;
  surname: string;
  otherNames: string;
  name: string; // Keeping for backward compatibility temporarily
  email: string;
  phoneNo: string;
  department: string;
  level: string;
  programId: string;
  role: StudentRole;
  sex: string;
  admissionMode: string;
  entryQualification: string;
  faculty: string;
  degreeCourse: string;
  programDuration: string;
  degreeAwardCode: string;
  permissions?: string[];
  createdAt: string;
  isActive: boolean;
}

export interface Staff {
  id: string;
  staffId: string;
  name: string;
  email: string;
  role: string;
  activeFeatures: {
    results: boolean;
    finance: boolean;
    timetable: boolean;
  };
}

export interface Session {
  id: string;
  name: string; // e.g. 2024/2025
  status: 'Current' | 'Past' | 'Upcoming';
}

export type ViewType = 'Dashboard' | 'Program & Courses' | 'Students' | 'Staff' | 'Payments' | 'ID Card Management' | 'Announcements' | 'Settings' | 'Notifications';

export interface Permission {
  id: string;
  name: string;
  key: string;
}

export interface Role {
  id: string;
  idNo: string;
  name: string;
  status: 'Student' | 'Staff';
  office: string;
  permissions: {
    createProgram: boolean;
    createCourses: boolean;
    createBilling: boolean;
    viewPayments: boolean;
    createTest: boolean;
  };
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface ChartDataItem {
  year: string;
  value: number;
}
