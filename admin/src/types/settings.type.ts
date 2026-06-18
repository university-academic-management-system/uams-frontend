export interface DepartmentSettings {
  id: string;
  currentSession: string;
  semester1StartDate: string;
  semester1EndDate: string;
  semester2StartDate: string;
  semester2EndDate: string;
  semester3StartDate: string;
  semester3EndDate: string;
  caPercentage: number;
  examPercentage: number;
  probationCgpaThreshold: number;
  suspensionThreshold: number;
  siwesRequired: boolean;
  siwesMinimumWeeks: number;
  siwesLevel: string;
  createdAt: string;
  updatedAt: string;
}
