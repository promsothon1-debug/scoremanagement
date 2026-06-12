export interface SubjectScores {
  khmerRead: number;
  khmerWrite: number;
  khmerComposition: number;
  mathNumbers: number;
  mathMeasurement: number;
  mathGeometry: number;
  science: number;
  socialCivics: number;
  socialGeography: number;
  socialHistory: number;
  physicalEducation: number;
  practicalSkills: number;
  foreignLanguage: number;
}

export interface Attendance {
  present: number;
  absent: number;
}

export interface Student {
  id: string; // Auto-generated ID
  serialNo: string; // ល.រ - display serial number
  name: string; // ឈ្មោះសិស្ស
  gender: 'ប្រុស' | 'ស្រី'; // ភេទ
  className?: string; // ថ្នាក់រៀន
  // Mapping of period name to its respective scores
  // E.g., "ខែធ្នូ", "ខែមករា", "ខែកុម្ភៈ", "ខែមីនា", "ខែឧសភា", "ខែមិថុនា", "ខែកក្កដា"
  monthlyScores: {
    [period: string]: SubjectScores;
  };
  monthlyAttendance?: {
    [period: string]: Attendance;
  };
}

export interface SheetConfig {
  spreadsheetId: string;
  sheetName: string;
  className: string;
  selectedMonth: string; // Active month or semester period
  isAutoSync: boolean;
}
