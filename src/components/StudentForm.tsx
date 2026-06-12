import React, { useState, useEffect } from 'react';
import { Student, SubjectScores } from '../types';
import { UserPlus, Save, Edit3, X, Lock } from 'lucide-react';

interface StudentFormProps {
  activeStudent: Student | null;
  selectedMonth: string;
  isReadOnly: boolean;
  onSave: (id: string, name: string, gender: 'ប្រុស' | 'ស្រី', serialNo: string, scores: SubjectScores) => void;
  onCancelEdit: () => void;
  nextSerialNo: string;
}

const initialScores: SubjectScores = {
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

export default function StudentForm({
  activeStudent,
  selectedMonth,
  isReadOnly,
  onSave,
  onCancelEdit,
  nextSerialNo,
}: StudentFormProps) {
  const [serialNo, setSerialNo] = useState(nextSerialNo);
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'ប្រុស' | 'ស្រី'>('ប្រុស');
  const [scores, setScores] = useState<SubjectScores>(initialScores);
  const [validationError, setValidationError] = useState('');

  // Update form values if edit target or month changes
  useEffect(() => {
    if (activeStudent) {
      setSerialNo(activeStudent.serialNo);
      setName(activeStudent.name);
      setGender(activeStudent.gender);
      
      const savedScoresForMonth = activeStudent.monthlyScores?.[selectedMonth];
      setScores(savedScoresForMonth ? { ...savedScoresForMonth } : { ...initialScores });
      setValidationError('');
    } else {
      setSerialNo(nextSerialNo);
      setName('');
      setGender('ប្រុស');
      setScores({ ...initialScores });
      setValidationError('');
    }
  }, [activeStudent, nextSerialNo, selectedMonth]);

  const handleScoreChange = (key: keyof SubjectScores, value: string) => {
    if (isReadOnly) return;
    
    // Normalize empty strings to 0
    if (value === '') {
      setScores((prev) => ({ ...prev, [key]: 0 }));
      return;
    }

    const parsed = parseFloat(value);
    if (isNaN(parsed)) return;

    // Constrain score between 0 and 10
    const constrainedValue = Number(Math.max(0, Math.min(10, parsed)).toFixed(2));
    setScores((prev) => ({ ...prev, [key]: constrainedValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isReadOnly) return;

    if (!name.trim()) {
      setValidationError('សូមបញ្ចូលឈ្មោះរបស់សិស្ស!');
      return;
    }

    onSave(
      activeStudent?.id || `s_${Date.now()}`,
      name.trim(),
      gender,
      serialNo,
      scores
    );

    // Reset Form only if not editing
    if (!activeStudent) {
      setName('');
      setGender('ប្រុស');
      setScores({ ...initialScores });
      setValidationError('');
    }
  };

  return (
    <div id="student-form-component" className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-slate-800">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-2">
          {activeStudent ? (
            <Edit3 className="w-5 h-5 text-blue-600" />
          ) : (
            <UserPlus className="w-5 h-5 text-emerald-600" />
          )}
          <h2 className="font-bold text-sm text-slate-900 font-sans">
            {activeStudent 
              ? `កែប្រែព័ត៌មាន និងពិន្ទុ [${selectedMonth}]` 
              : `បន្ថែមសិស្ស និងពិន្ទុថ្មីសម្រាប់ [${selectedMonth}]`
            }
          </h2>
        </div>
        {activeStudent && (
          <button
            onClick={onCancelEdit}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isReadOnly ? (
        <div className="bg-amber-50/50 border border-amber-200/50 p-6 rounded-xl flex flex-col items-center text-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-amber-900 font-sans">ផ្ទាំងបញ្ចូលពិន្ទុត្រូវបានចាក់សោ</h4>
            <p className="text-[10px] text-amber-700/80 leading-relaxed font-sans mt-1">
              អ្នកកំពុងស្ថិតនៅក្នុងការបង្ហាញរបាយការណ៍ <strong>{selectedMonth}</strong>។ 
              មធ្យមភាគ និងពិន្ទុក្នុងរបាយការណ៍នេះ ត្រូវបានគណនាដោយស្វ័យប្រវត្តិចេញពីបណ្តាខែរៀន។ 
              សូមប្ដូរទៅកាន់ខែដាច់ដោយឡែក (ឧទាហរណ៍៖ ខែធ្នូ, ខែមករា...) ដើម្បីបញ្ចូល ឬកែប្រែទិន្នន័យ។
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {validationError && (
            <div className="p-2.5 bg-red-50 border border-red-100 text-red-700 rounded text-xs leading-normal font-sans">
              {validationError}
            </div>
          )}

          {/* SECTION 1: General Info */}
          <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100 space-y-3">
            <h3 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">ព័ត៌មានទូទៅ</h3>
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-3">
                <label className="block text-[10px] text-slate-500 mb-1">ល.រ</label>
                <input
                  type="text"
                  value={serialNo}
                  onChange={(e) => setSerialNo(e.target.value)}
                  placeholder="01"
                  className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 outline-none text-xs"
                />
              </div>
              <div className="col-span-6">
                <label className="block text-[10px] text-slate-500 mb-1">ឈ្មោះសិស្ស</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ឈ្មោះពេញសិស្ស..."
                  className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500 outline-none text-xs"
                />
              </div>
              <div className="col-span-3">
                <label className="block text-[10px] text-slate-500 mb-1">ភេទ</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'ប្រុស' | 'ស្រី')}
                  className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 focus:ring-1 focus:ring-blue-500 outline-none text-xs"
                >
                  <option value="ប្រុស">ប្រុស</option>
                  <option value="ស្រី">ស្រី</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: Scores (Khmer and Math) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Khmer scores */}
            <div className="bg-blue-50/20 p-3 rounded-lg border border-blue-50 space-y-3">
              <h3 className="text-[10px] uppercase font-bold text-blue-800 tracking-wider">ភាសាខ្មែរ (ពិន្ទុពេញ ១០)</h3>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[9px] text-blue-600 mb-1">រៀនអាន</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={scores.khmerRead === 0 && activeStudent === null ? '' : scores.khmerRead}
                    onChange={(e) => handleScoreChange('khmerRead', e.target.value)}
                    placeholder="0.0"
                    className="w-full bg-white border border-slate-200 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 outline-none text-xs font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-blue-600 mb-1">សរសេរតាម</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={scores.khmerWrite === 0 && activeStudent === null ? '' : scores.khmerWrite}
                    onChange={(e) => handleScoreChange('khmerWrite', e.target.value)}
                    placeholder="0.0"
                    className="w-full bg-white border border-slate-200 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 outline-none text-xs font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-blue-600 mb-1">តែងសេចក្តី</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={scores.khmerComposition === 0 && activeStudent === null ? '' : scores.khmerComposition}
                    onChange={(e) => handleScoreChange('khmerComposition', e.target.value)}
                    placeholder="0.0"
                    className="w-full bg-white border border-slate-200 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 outline-none text-xs font-mono text-center"
                  />
                </div>
              </div>
            </div>

            {/* Math scores */}
            <div className="bg-green-50/20 p-3 rounded-lg border border-green-50 space-y-3">
              <h3 className="text-[10px] uppercase font-bold text-green-800 tracking-wider">គណិតវិទ្យា (ពិន្ទុពេញ ១០)</h3>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[9px] text-green-600 mb-1">ចំនួន</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={scores.mathNumbers === 0 && activeStudent === null ? '' : scores.mathNumbers}
                    onChange={(e) => handleScoreChange('mathNumbers', e.target.value)}
                    placeholder="0.0"
                    className="w-full bg-white border border-slate-200 rounded px-2 py-1 focus:ring-1 focus:ring-green-500 outline-none text-xs font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-green-600 mb-1">រង្វាស់រង្វាល់</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={scores.mathMeasurement === 0 && activeStudent === null ? '' : scores.mathMeasurement}
                    onChange={(e) => handleScoreChange('mathMeasurement', e.target.value)}
                    placeholder="0.0"
                    className="w-full bg-white border border-slate-200 rounded px-2 py-1 focus:ring-1 focus:ring-green-500 outline-none text-xs font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-green-600 mb-1">ធរណីមាត្រ</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={scores.mathGeometry === 0 && activeStudent === null ? '' : scores.mathGeometry}
                    onChange={(e) => handleScoreChange('mathGeometry', e.target.value)}
                    placeholder="0.0"
                    className="w-full bg-white border border-slate-200 rounded px-2 py-1 focus:ring-1 focus:ring-green-500 outline-none text-xs font-mono text-center"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: Social studies */}
          <div className="bg-purple-50/20 p-3 rounded-lg border border-purple-50 space-y-3">
            <h3 className="text-[10px] uppercase font-bold text-purple-800 tracking-wider">សិក្សាសង្គម (ពិន្ទុពេញ ១០)</h3>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[9px] text-purple-600 mb-1">សីលធម៌-ពលរដ្ឋ</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={scores.socialCivics === 0 && activeStudent === null ? '' : scores.socialCivics}
                  onChange={(e) => handleScoreChange('socialCivics', e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-white border border-slate-200 rounded px-2 py-1 focus:ring-1 focus:ring-purple-500 outline-none text-xs font-mono text-center"
                />
              </div>
              <div>
                <label className="block text-[9px] text-purple-600 mb-1">ភូមិវិទ្យា</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={scores.socialGeography === 0 && activeStudent === null ? '' : scores.socialGeography}
                  onChange={(e) => handleScoreChange('socialGeography', e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-white border border-slate-200 rounded px-2 py-1 focus:ring-1 focus:ring-purple-500 outline-none text-xs font-mono text-center"
                />
              </div>
              <div>
                <label className="block text-[9px] text-purple-600 mb-1">ប្រវត្តិវិទ្យា</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={scores.socialHistory === 0 && activeStudent === null ? '' : scores.socialHistory}
                  onChange={(e) => handleScoreChange('socialHistory', e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-white border border-slate-200 rounded px-2 py-1 focus:ring-1 focus:ring-purple-500 outline-none text-xs font-mono text-center"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: Science, Gym, Skills, English */}
          <div className="bg-amber-50/20 p-3 rounded-lg border border-amber-50 space-y-3">
            <h3 className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">មុខវិជ្ជារួមផ្សំផ្សេងៗ (ពិន្ទុពេញ ១០)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div>
                <label className="block text-[9px] text-amber-700 mb-1 truncate">វិទ្យាសាស្ត្រ</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={scores.science === 0 && activeStudent === null ? '' : scores.science}
                  onChange={(e) => handleScoreChange('science', e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-white border border-slate-200 rounded px-2 py-1 focus:ring-1 focus:ring-amber-500 outline-none text-xs font-mono text-center"
                />
              </div>
              <div>
                <label className="block text-[9px] text-amber-700 mb-1 truncate">កាយនិងកីឡា</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={scores.physicalEducation === 0 && activeStudent === null ? '' : scores.physicalEducation}
                  onChange={(e) => handleScoreChange('physicalEducation', e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-white border border-slate-200 rounded px-2 py-1 focus:ring-1 focus:ring-amber-500 outline-none text-xs font-mono text-center"
                />
              </div>
              <div>
                <label className="block text-[9px] text-amber-700 mb-1 truncate">បំណិនជីវិត</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={scores.practicalSkills === 0 && activeStudent === null ? '' : scores.practicalSkills}
                  onChange={(e) => handleScoreChange('practicalSkills', e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-white border border-slate-200 rounded px-2 py-1 focus:ring-1 focus:ring-amber-500 outline-none text-xs font-mono text-center"
                />
              </div>
              <div>
                <label className="block text-[9px] text-amber-700 mb-1 truncate">ភាសាបរទេស</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={scores.foreignLanguage === 0 && activeStudent === null ? '' : scores.foreignLanguage}
                  onChange={(e) => handleScoreChange('foreignLanguage', e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-white border border-slate-200 rounded px-2 py-1 focus:ring-1 focus:ring-amber-500 outline-none text-xs font-mono text-center"
                />
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="flex gap-2.5 pt-1.5">
            {activeStudent && (
              <button
                type="button"
                onClick={onCancelEdit}
                className="flex-1 py-2 px-3 border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold rounded-lg transition-colors cursor-pointer text-xs text-center"
              >
                បោះបង់
              </button>
            )}
            <button
              type="submit"
              className="flex-[2] py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              <Save className="w-4 h-4" />
              <span>{activeStudent ? 'រក្សាទុកការកែប្រែ' : 'បន្ថែមសិស្សជាផ្លូវការ'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
