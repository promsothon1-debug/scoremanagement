import { Student, SubjectScores } from '../types';

const defaultScores1: SubjectScores = {
  khmerRead: 8, khmerWrite: 7.5, khmerComposition: 7,
  mathNumbers: 8.5, mathMeasurement: 8, mathGeometry: 7.8,
  science: 8, socialCivics: 8.5, socialGeography: 8, socialHistory: 8.2,
  physicalEducation: 9, practicalSkills: 8, foreignLanguage: 7.5,
};

const defaultScores2: SubjectScores = {
  khmerRead: 8.5, khmerWrite: 8, khmerComposition: 7.5,
  mathNumbers: 9, mathMeasurement: 8.2, mathGeometry: 8,
  science: 8.5, socialCivics: 9, socialGeography: 8.2, socialHistory: 8.5,
  physicalEducation: 9, practicalSkills: 8.5, foreignLanguage: 7.8,
};

const defaultScores3: SubjectScores = {
  khmerRead: 9, khmerWrite: 8.5, khmerComposition: 8,
  mathNumbers: 9.2, mathMeasurement: 8.5, mathGeometry: 8.2,
  science: 9, socialCivics: 9.2, socialGeography: 8.5, socialHistory: 8.8,
  physicalEducation: 9.5, practicalSkills: 9, foreignLanguage: 8,
};

const defaultScores4: SubjectScores = {
  khmerRead: 9.2, khmerWrite: 8.8, khmerComposition: 8.2,
  mathNumbers: 9.5, mathMeasurement: 8.8, mathGeometry: 8.5,
  science: 9.2, socialCivics: 9.5, socialGeography: 8.8, socialHistory: 9,
  physicalEducation: 9.5, practicalSkills: 9.2, foreignLanguage: 8.2,
};

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 's1',
    serialNo: '01',
    name: 'សុខ ចាន់ដារ៉ា',
    gender: 'ប្រុស',
    monthlyScores: {
      'ខែធ្នូ': { ...defaultScores1 },
      'ខែមករា': { ...defaultScores2 },
      'ខែកុម្ភៈ': { ...defaultScores3 },
      'ខែមីនា': { ...defaultScores4 },
      'ខែឧសភា': { ...defaultScores2 },
      'ខែមិថុនា': { ...defaultScores3 },
      'ខែកក្កដា': { ...defaultScores4 },
    }
  },
  {
    id: 's2',
    serialNo: '02',
    name: 'គង់ សុវណ្ណ',
    gender: 'ស្រី',
    monthlyScores: {
      'ខែធ្នូ': {
        khmerRead: 9.5, khmerWrite: 9.2, khmerComposition: 9,
        mathNumbers: 9.8, mathMeasurement: 9.5, mathGeometry: 9.2,
        science: 9.5, socialCivics: 9.8, socialGeography: 9.2, socialHistory: 9.5,
        physicalEducation: 10, practicalSkills: 9.5, foreignLanguage: 9,
      },
      'ខែមករា': {
        khmerRead: 9.6, khmerWrite: 9.4, khmerComposition: 9.2,
        mathNumbers: 9.9, mathMeasurement: 9.6, mathGeometry: 9.4,
        science: 9.7, socialCivics: 9.9, socialGeography: 9.5, socialHistory: 9.6,
        physicalEducation: 10, practicalSkills: 9.6, foreignLanguage: 9.2,
      },
      'ខែកុម្ភៈ': {
        khmerRead: 9.8, khmerWrite: 9.6, khmerComposition: 9.5,
        mathNumbers: 10, mathMeasurement: 9.8, mathGeometry: 9.6,
        science: 9.9, socialCivics: 10, socialGeography: 9.8, socialHistory: 9.8,
        physicalEducation: 10, practicalSkills: 9.8, foreignLanguage: 9.5,
      },
      'ខែមីនា': {
        khmerRead: 9.9, khmerWrite: 9.8, khmerComposition: 9.7,
        mathNumbers: 10, mathMeasurement: 9.9, mathGeometry: 9.8,
        science: 10, socialCivics: 10, socialGeography: 9.9, socialHistory: 9.9,
        physicalEducation: 10, practicalSkills: 9.9, foreignLanguage: 9.8,
      },
      'ខែឧសភា': {
        khmerRead: 9.7, khmerWrite: 9.5, khmerComposition: 9.3,
        mathNumbers: 9.9, mathMeasurement: 9.7, mathGeometry: 9.5,
        science: 9.8, socialCivics: 9.9, socialGeography: 9.6, socialHistory: 9.7,
        physicalEducation: 10, practicalSkills: 9.7, foreignLanguage: 9.4,
      },
      'ខែមិថុនា': {
        khmerRead: 9.8, khmerWrite: 9.7, khmerComposition: 9.6,
        mathNumbers: 10, mathMeasurement: 9.9, mathGeometry: 9.7,
        science: 9.9, socialCivics: 10, socialGeography: 9.8, socialHistory: 9.8,
        physicalEducation: 10, practicalSkills: 9.8, foreignLanguage: 9.6,
      },
      'ខែកក្កដា': {
        khmerRead: 10, khmerWrite: 9.9, khmerComposition: 9.8,
        mathNumbers: 10, mathMeasurement: 10, mathGeometry: 9.9,
        science: 10, socialCivics: 10, socialGeography: 9.9, socialHistory: 10,
        physicalEducation: 10, practicalSkills: 10, foreignLanguage: 9.9,
      }
    }
  },
  {
    id: 's3',
    serialNo: '03',
    name: 'មាស លក្ខិណា',
    gender: 'ស្រី',
    monthlyScores: {
      'ខែធ្នូ': {
        khmerRead: 7.2, khmerWrite: 6.8, khmerComposition: 7,
        mathNumbers: 6.5, mathMeasurement: 7, mathGeometry: 6.2,
        science: 7.5, socialCivics: 8, socialGeography: 7.2, socialHistory: 7,
        physicalEducation: 8.5, practicalSkills: 7.5, foreignLanguage: 6.8,
      },
      'ខែមករា': {
        khmerRead: 7.5, khmerWrite: 7, khmerComposition: 7.2,
        mathNumbers: 7, mathMeasurement: 7.5, mathGeometry: 6.5,
        science: 7.8, socialCivics: 8.2, socialGeography: 7.5, socialHistory: 7.4,
        physicalEducation: 8.8, practicalSkills: 7.8, foreignLanguage: 7,
      },
      'ខែកុម្ភៈ': {
        khmerRead: 7.8, khmerWrite: 7.5, khmerComposition: 7.5,
        mathNumbers: 7.5, mathMeasurement: 7.8, mathGeometry: 7,
        science: 8, socialCivics: 8.5, socialGeography: 7.8, socialHistory: 7.8,
        physicalEducation: 9, practicalSkills: 8, foreignLanguage: 7.5,
      },
      'ខែមីនា': {
        khmerRead: 8, khmerWrite: 7.8, khmerComposition: 7.8,
        mathNumbers: 8, mathMeasurement: 8, mathGeometry: 7.5,
        science: 8.2, socialCivics: 8.8, socialGeography: 8, socialHistory: 8,
        physicalEducation: 9.2, practicalSkills: 8.2, foreignLanguage: 7.8,
      },
      'ខែឧសភា': {
        khmerRead: 7.6, khmerWrite: 7.2, khmerComposition: 7.4,
        mathNumbers: 7.2, mathMeasurement: 7.6, mathGeometry: 6.8,
        science: 7.9, socialCivics: 8.4, socialGeography: 7.6, socialHistory: 7.6,
        physicalEducation: 8.9, practicalSkills: 7.9, foreignLanguage: 7.2,
      },
      'ខែមិថុនា': {
        khmerRead: 7.9, khmerWrite: 7.6, khmerComposition: 7.7,
        mathNumbers: 7.7, mathMeasurement: 7.9, mathGeometry: 7.2,
        science: 8.1, socialCivics: 8.6, socialGeography: 7.9, socialHistory: 7.9,
        physicalEducation: 9.1, practicalSkills: 8.1, foreignLanguage: 7.6,
      },
      'ខែកក្កដា': {
        khmerRead: 8.2, khmerWrite: 8, khmerComposition: 8,
        mathNumbers: 8.2, mathMeasurement: 8.2, mathGeometry: 7.8,
        science: 8.5, socialCivics: 9, socialGeography: 8.2, socialHistory: 8.2,
        physicalEducation: 9.4, practicalSkills: 8.5, foreignLanguage: 8,
      }
    }
  },
  {
    id: 's4',
    serialNo: '04',
    name: 'ញឹម រដ្ឋា',
    gender: 'ប្រុស',
    monthlyScores: {
      'ខែធ្នូ': {
        khmerRead: 5.5, khmerWrite: 5, khmerComposition: 5.2,
        mathNumbers: 4.8, mathMeasurement: 5, mathGeometry: 4.5,
        science: 6, socialCivics: 6.5, socialGeography: 5.5, socialHistory: 5.8,
        physicalEducation: 7, practicalSkills: 6, foreignLanguage: 5.2,
      },
      'ខែមករា': {
        khmerRead: 5.8, khmerWrite: 5.2, khmerComposition: 5.5,
        mathNumbers: 5, mathMeasurement: 5.2, mathGeometry: 4.8,
        science: 6.2, socialCivics: 6.8, socialGeography: 5.8, socialHistory: 6,
        physicalEducation: 7.2, practicalSkills: 6.2, foreignLanguage: 5.5,
      },
      'ខែកុម្ភៈ': {
        khmerRead: 6, khmerWrite: 5.5, khmerComposition: 5.8,
        mathNumbers: 5.5, mathMeasurement: 5.6, mathGeometry: 5.2,
        science: 6.5, socialCivics: 7, socialGeography: 6, socialHistory: 6.2,
        physicalEducation: 7.5, practicalSkills: 6.5, foreignLanguage: 5.8,
      },
      'ខែមីនា': {
        khmerRead: 6.2, khmerWrite: 5.8, khmerComposition: 6,
        mathNumbers: 5.8, mathMeasurement: 6, mathGeometry: 5.5,
        science: 6.8, socialCivics: 7.2, socialGeography: 6.2, socialHistory: 6.5,
        physicalEducation: 7.8, practicalSkills: 6.8, foreignLanguage: 6,
      },
      'ខែឧសភា': {
        khmerRead: 5.9, khmerWrite: 5.4, khmerComposition: 5.6,
        mathNumbers: 5.2, mathMeasurement: 5.4, mathGeometry: 5,
        science: 6.4, socialCivics: 6.9, socialGeography: 5.9, socialHistory: 6.1,
        physicalEducation: 7.4, practicalSkills: 6.4, foreignLanguage: 5.6,
      },
      'ខែមិថុនា': {
        khmerRead: 6.1, khmerWrite: 5.6, khmerComposition: 5.9,
        mathNumbers: 5.6, mathMeasurement: 5.7, mathGeometry: 5.3,
        science: 6.6, socialCivics: 7.1, socialGeography: 6.1, socialHistory: 6.3,
        physicalEducation: 7.6, practicalSkills: 6.6, foreignLanguage: 5.9,
      },
      'ខែកក្កដា': {
        khmerRead: 6.4, khmerWrite: 6, khmerComposition: 6.2,
        mathNumbers: 6, mathMeasurement: 6.2, mathGeometry: 5.8,
        science: 7, socialCivics: 7.5, socialGeography: 6.4, socialHistory: 6.8,
        physicalEducation: 8, practicalSkills: 7, foreignLanguage: 6.2,
      }
    }
  },
  {
    id: 's5',
    serialNo: '05',
    name: 'លី ស៊ីណាត',
    gender: 'ស្រី',
    monthlyScores: {
      'ខែធ្នូ': {
        khmerRead: 4.2, khmerWrite: 3.8, khmerComposition: 4,
        mathNumbers: 3.5, mathMeasurement: 4, mathGeometry: 3.2,
        science: 4.5, socialCivics: 5, socialGeography: 4.2, socialHistory: 4,
        physicalEducation: 6, practicalSkills: 4.5, foreignLanguage: 4,
      },
      'ខែមករា': {
        khmerRead: 4.5, khmerWrite: 4, khmerComposition: 4.2,
        mathNumbers: 3.8, mathMeasurement: 4.2, mathGeometry: 3.5,
        science: 4.8, socialCivics: 5.2, socialGeography: 4.5, socialHistory: 4.2,
        physicalEducation: 6.2, practicalSkills: 4.8, foreignLanguage: 4.2,
      },
      'ខែកុម្ភៈ': {
        khmerRead: 4.8, khmerWrite: 4.2, khmerComposition: 4.5,
        mathNumbers: 4, mathMeasurement: 4.5, mathGeometry: 3.8,
        science: 5, socialCivics: 5.5, socialGeography: 4.8, socialHistory: 4.5,
        physicalEducation: 6.5, practicalSkills: 5, foreignLanguage: 4.5,
      },
      'ខែមីនា': {
        khmerRead: 5, khmerWrite: 4.5, khmerComposition: 4.8,
        mathNumbers: 4.2, mathMeasurement: 4.8, mathGeometry: 4,
        science: 5.2, socialCivics: 5.8, socialGeography: 5, socialHistory: 4.8,
        physicalEducation: 6.8, practicalSkills: 5.2, foreignLanguage: 4.8,
      },
      'ខែឧសភា': {
        khmerRead: 4.4, khmerWrite: 3.9, khmerComposition: 4.1,
        mathNumbers: 3.7, mathMeasurement: 4.1, mathGeometry: 3.4,
        science: 4.7, socialCivics: 5.1, socialGeography: 4.4, socialHistory: 4.1,
        physicalEducation: 6.1, practicalSkills: 4.7, foreignLanguage: 4.1,
      },
      'ខែមិថុនា': {
        khmerRead: 4.6, khmerWrite: 4.1, khmerComposition: 4.4,
        mathNumbers: 3.9, mathMeasurement: 4.4, mathGeometry: 3.7,
        science: 4.9, socialCivics: 5.4, socialGeography: 4.7, socialHistory: 4.4,
        physicalEducation: 6.4, practicalSkills: 4.9, foreignLanguage: 4.4,
      },
      'ខែកក្កដា': {
        khmerRead: 4.9, khmerWrite: 4.4, khmerComposition: 4.6,
        mathNumbers: 4.2, mathMeasurement: 4.6, mathGeometry: 4,
        science: 5.2, socialCivics: 5.8, socialGeography: 5, socialHistory: 4.8,
        physicalEducation: 6.8, practicalSkills: 5.2, foreignLanguage: 4.7,
      }
    }
  }
];
