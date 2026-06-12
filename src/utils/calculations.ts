import { Student, SubjectScores, Attendance } from '../types';

export const ZERO_SCORES: SubjectScores = {
  khmerRead: 0,
  khmerWrite: 0,
  khmerComposition: 0,
  mathNumbers: 0,
  mathMeasurement: 0,
  mathGeometry: 0,
  science: 0,
  socialCivics: 0,
  socialGeography: 0,
  socialHistory: 0,
  physicalEducation: 0,
  practicalSkills: 0,
  foreignLanguage: 0,
};

export const SUBJECT_KEYS: (keyof SubjectScores)[] = [
  'khmerRead',
  'khmerWrite',
  'khmerComposition',
  'mathNumbers',
  'mathMeasurement',
  'mathGeometry',
  'science',
  'socialCivics',
  'socialGeography',
  'socialHistory',
  'physicalEducation',
  'practicalSkills',
  'foreignLanguage',
];

export function calculateScores(scores: SubjectScores): {
  totalScore: number;
  average: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  status: 'ជាប់' | 'ធ្លាក់';
} {
  const values = Object.values(scores);
  const total = Number(values.reduce((sum, val) => sum + val, 0).toFixed(2));
  const average = Number((total / values.length).toFixed(2));

  let grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' = 'F';
  if (average >= 9.0) grade = 'A';
  else if (average >= 8.0) grade = 'B';
  else if (average >= 7.0) grade = 'C';
  else if (average >= 6.0) grade = 'D';
  else if (average >= 5.0) grade = 'E';

  const status = average >= 5.5 ? 'ជាប់' : 'ធ្លាក់'; // Khmer grading passes at 5.0 or 5.5 usually, we keep 5.0 or let's use 5.0 to stay compatible with previous scores

  return { 
    totalScore: total, 
    average, 
    grade, 
    status: average >= 5.0 ? 'ជាប់' : 'ធ្លាក់' 
  };
}

export function getScoresForPeriod(student: Student, period: string): SubjectScores {
  const scores = student.monthlyScores || {};

  if (period === 'ឆមាសទី១') {
    const months = ['ខែធ្នូ', 'ខែមករា', 'ខែកុម្ភៈ', 'ខែមីនា'];
    const result: any = {};
    SUBJECT_KEYS.forEach(key => {
      const sum = months.reduce((acc, m) => acc + (scores[m]?.[key] || 0), 0);
      result[key] = Number((sum / 4).toFixed(2));
    });
    return result as SubjectScores;
  }

  if (period === 'ឆមាសទី២') {
    const months = ['ខែឧសភា', 'ខែមិថុនា', 'ខែកក្កដា'];
    const result: any = {};
    SUBJECT_KEYS.forEach(key => {
      const sum = months.reduce((acc, m) => acc + (scores[m]?.[key] || 0), 0);
      result[key] = Number((sum / 3).toFixed(2));
    });
    return result as SubjectScores;
  }

  if (period === 'ប្រចាំឆ្នាំ' || period === 'ដំណាច់ឆ្នាំ') {
    const s1 = getScoresForPeriod(student, 'ឆមាសទី១');
    const s2 = getScoresForPeriod(student, 'ឆមាសទី២');
    const result: any = {};
    SUBJECT_KEYS.forEach(key => {
      result[key] = Number(((s1[key] + s2[key]) / 2).toFixed(2));
    });
    return result as SubjectScores;
  }

  return scores[period] || { ...ZERO_SCORES };
}

export function getAttendanceForPeriod(student: Student, period: string): Attendance {
  const attendance = student.monthlyAttendance || {};

  if (period === 'ឆមាសទី១') {
    const months = ['ខែធ្នូ', 'ខែមករា', 'ខែកុម្ភៈ', 'ខែមីនា'];
    let present = 0;
    let absent = 0;
    months.forEach(m => {
      present += attendance[m]?.present || 0;
      absent += attendance[m]?.absent || 0;
    });
    return { present, absent };
  }

  if (period === 'ឆមាសទី២') {
    const months = ['ខែឧសភា', 'ខែមិថុនា', 'ខែកក្កដា'];
    let present = 0;
    let absent = 0;
    months.forEach(m => {
      present += attendance[m]?.present || 0;
      absent += attendance[m]?.absent || 0;
    });
    return { present, absent };
  }

  if (period === 'ប្រចាំឆ្នាំ' || period === 'ដំណាច់ឆ្នាំ') {
    const att1 = getAttendanceForPeriod(student, 'ឆមាសទី១');
    const att2 = getAttendanceForPeriod(student, 'ឆមាសទី២');
    return {
      present: att1.present + att2.present,
      absent: att1.absent + att2.absent,
    };
  }

  return attendance[period] || { present: 0, absent: 0 };
}

export interface ComputedStudent {
  id: string;
  serialNo: string;
  name: string;
  gender: 'ប្រុស' | 'ស្រី';
  scores: SubjectScores;
  totalScore: number;
  average: number;
  rank: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  status: 'ជាប់' | 'ធ្លាក់';
  attendance: Attendance;
}

export function computeStudentsForPeriod(students: Student[], period: string): ComputedStudent[] {
  const computedList = students.map(student => {
    const scores = getScoresForPeriod(student, period);
    const attendance = getAttendanceForPeriod(student, period);
    const { totalScore, average, grade, status } = calculateScores(scores);
    return {
      id: student.id,
      serialNo: student.serialNo,
      name: student.name,
      gender: student.gender,
      scores,
      totalScore,
      average,
      grade,
      status,
      rank: 1,
      attendance,
    };
  });

  if (computedList.length === 0) return [];

  // Sort by total score descending to compute rank
  const sorted = [...computedList].sort((a, b) => b.totalScore - a.totalScore);

  // Assign ranks, handling ties correctly
  let currentRank = 1;
  let prevScore: number | null = null;
  
  const rankedMap = new Map<string, number>();
  
  sorted.forEach((student, index) => {
    if (prevScore === null || student.totalScore !== prevScore) {
      currentRank = index + 1;
      prevScore = student.totalScore;
    }
    rankedMap.set(student.id, currentRank);
  });

  return computedList.map(student => ({
    ...student,
    rank: rankedMap.get(student.id) || 1,
  }));
}
