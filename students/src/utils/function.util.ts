export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));   

export const normaliseLevel = (level: string) => level.replace("L", "");

export const normaliseSemester = (semester: string) => `${semester === "FIRST" ? "1st Semester" : "2nd Semester"}`;
