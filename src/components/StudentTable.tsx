import React from 'react';
import { Student } from '../types';
import { ComputedStudent } from '../utils/calculations';
import { Edit2, Trash2, ShieldAlert, Lock, ArrowUpDown } from 'lucide-react';

interface StudentTableProps {
  students: ComputedStudent[];
  rawStudents: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
  isReadOnly: boolean;
  selectedMonth: string;
  sortBy?: 'serial' | 'rank' | 'name';
  onSortChange?: (field: 'serial' | 'rank' | 'name') => void;
}

export default function StudentTable({ 
  students, 
  rawStudents, 
  onEdit, 
  onDelete, 
  isReadOnly,
  selectedMonth,
  sortBy = 'serial',
  onSortChange
}: StudentTableProps) {
  
  const handleDeleteConfirm = (compStudent: ComputedStudent) => {
    const isConfirmed = window.confirm(
      `តើអ្នកពិតជាចង់លុបទិន្នន័យរបស់សិស្សឈ្មោះ « ${compStudent.name} » មែនទេ? សកម្មភាពនេះនឹងលុបពិន្ទុរបស់សិស្សនេះចេញពីគ្រប់ខែទាំងអស់។`
    );
    if (isConfirmed) {
      onDelete(compStudent.id);
    }
  };

  const handleEditTrigger = (compStudent: ComputedStudent) => {
    const raw = rawStudents.find(s => s.id === compStudent.id);
    if (raw) {
      onEdit(raw);
    }
  };

  return (
    <div id="student-table-component" className="bg-white border border-slate-200 rounded-xl flex-1 flex flex-col overflow-hidden shadow-sm">
      {/* Read-Only Status Banner */}
      {isReadOnly && (
        <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 flex items-center gap-2 text-amber-800 text-[11px] font-medium font-sans">
          <Lock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          <span>
            ការបង្ហាញ ៖ <strong>{selectedMonth} (មធ្យមភាគគណនា)</strong> — ផ្ទាំងនេះជាប្រភេទព័ត៌មានអានតែប៉ុណ្ណោះ។ ដើម្បីកែសម្រួលពិន្ទុ សូមប្តូរទៅកាន់ខែនីមួយៗ។
          </span>
        </div>
      )}

      <div className="overflow-x-auto overflow-y-auto max-h-[500px] flex-1">
        <table className="w-full border-collapse text-left" style={{ fontFamily: '"Khmer OS", "Kantumruy Pro", sans-serif' }}>
          <thead className="bg-slate-50 sticky top-0 z-10 select-none shadow-[0_1px_0_0_rgba(226,232,240,1)]">
            <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold">
              <th 
                rowSpan={2} 
                onClick={() => onSortChange?.('serial')}
                className="p-3 text-center border-r border-slate-200 w-14 bg-slate-50 cursor-pointer hover:bg-slate-100 select-none transition-colors group"
                title="ចុចដើម្បីតម្រៀបតាម លេខរៀង ល.រ"
              >
                <div className="flex items-center justify-center gap-0.5">
                  <span>ល.រ</span>
                  <ArrowUpDown className={`w-2.5 h-2.5 transition-opacity ${sortBy === 'serial' ? 'text-blue-600 opacity-100' : 'text-slate-400 opacity-0 group-hover:opacity-100'}`} />
                </div>
              </th>
              <th 
                rowSpan={2} 
                onClick={() => onSortChange?.('name')}
                className="p-3 border-r border-slate-200 min-w-[140px] bg-slate-50 cursor-pointer hover:bg-slate-100 select-none transition-colors group"
                title="ចុចដើម្បីតម្រៀបតាម ឈ្មោះសិស្ស"
              >
                <div className="flex items-center justify-between gap-1">
                  <span>ឈ្មោះសិស្ស</span>
                  <ArrowUpDown className={`w-2.5 h-2.5 transition-opacity ${sortBy === 'name' ? 'text-blue-600 opacity-100' : 'text-slate-400 opacity-0 group-hover:opacity-100'}`} />
                </div>
              </th>
              <th rowSpan={2} className="p-3 text-center border-r border-slate-200 w-12 bg-slate-50">ភេទ</th>
              <th colSpan={3} className="p-1.5 text-center border-r border-slate-200 bg-blue-50/70 text-blue-800">ភាសាខ្មែរ</th>
              <th colSpan={3} className="p-1.5 text-center border-r border-slate-200 bg-green-50/70 text-green-800">គណិតវិទ្យា</th>
              <th rowSpan={2} className="p-2 text-center border-r border-slate-200 w-14 bg-slate-50">វិទ្យា.</th>
              <th colSpan={3} className="p-1.5 text-center border-r border-slate-200 bg-purple-50/70 text-purple-800">សិក្សាសង្គម</th>
              <th rowSpan={2} className="p-2 text-center border-r border-slate-200 w-14 bg-slate-50">អប់រំកាយ</th>
              <th rowSpan={2} className="p-2 text-center border-r border-slate-200 w-14 bg-slate-50">បំណិន</th>
              <th rowSpan={2} className="p-2 text-center border-r border-slate-200 w-14 bg-slate-50">បរទេស</th>
              <th rowSpan={2} className="p-2 text-center border-r border-slate-200 w-16 bg-slate-100 font-bold text-slate-800">សរុប</th>
              <th rowSpan={2} className="p-2 text-center border-r border-slate-200 w-14 bg-slate-100 font-bold text-slate-800">មធ្យម</th>
              <th 
                rowSpan={2} 
                onClick={() => onSortChange?.('rank')}
                className="p-2 text-center border-r border-slate-200 w-16 bg-red-50 font-bold text-red-600 cursor-pointer hover:bg-red-100 hover:text-red-700 select-none transition-colors group"
                title="ចុចដើម្បីតម្រៀបតាម ចំណាត់ថ្នាក់"
              >
                <div className="flex items-center justify-center gap-0.5">
                  <span>ចំណាត់.</span>
                  <ArrowUpDown className={`w-2.5 h-2.5 transition-opacity ${sortBy === 'rank' ? 'text-red-700 opacity-100' : 'text-slate-400 opacity-0 group-hover:opacity-100'}`} />
                </div>
              </th>
              <th rowSpan={2} className="p-2 text-center border-r border-slate-200 w-12 bg-slate-100 font-bold text-slate-800">និទ្ទេស</th>
              <th rowSpan={2} className="p-2 text-center w-24 bg-slate-50">សកម្មភាព</th>
            </tr>
            <tr className="border-b border-slate-200 text-slate-400 text-[9px]">
              <th className="p-1 text-center border-r border-slate-200 bg-blue-50/30">អាន</th>
              <th className="p-1 text-center border-r border-slate-200 bg-blue-50/30">សរសេរ</th>
              <th className="p-1 text-center border-r border-slate-200 bg-blue-50/30">តែង</th>
              <th className="p-1 text-center border-r border-slate-200 bg-green-50/30">ចំនួន</th>
              <th className="p-1 text-center border-r border-slate-200 bg-green-50/30">រង្វាស់</th>
              <th className="p-1 text-center border-r border-slate-200 bg-green-50/30">ធរណី</th>
              <th className="p-1 text-center border-r border-slate-200 bg-purple-50/30">សីល</th>
              <th className="p-1 text-center border-r border-slate-200 bg-purple-50/30">ភូមិ</th>
              <th className="p-1 text-center border-r border-slate-200 bg-purple-50/30">ប្រវត្តិ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.length === 0 ? (
              <tr>
                <td colSpan={20} className="p-8 text-center text-slate-400 bg-slate-50/30">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ShieldAlert className="w-8 h-8 text-slate-300" />
                    <p className="font-semibold text-xs text-slate-500 font-sans">មិនទាន់មានទិន្នន័យសិស្សនៅឡើយទេ!</p>
                    <p className="text-[10px] text-slate-400 font-sans">សូមប្រើប្រាស់ទម្រង់បន្ថែមសិស្សនៅចំហៀងខាងឆ្វេង ដើម្បីបញ្ចូលពិន្ទុដំបូង។</p>
                  </div>
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-slate-50/50 transition-colors group text-[11px] align-middle text-slate-700"
                >
                  <td className="p-2.5 border-r border-slate-100 text-center font-mono text-slate-400">{student.serialNo}</td>
                  <td className="p-2.5 border-r border-slate-100 font-medium text-slate-900 truncate max-w-[140px]">
                    {student.name}
                  </td>
                  <td className="p-2.5 border-r border-slate-100 text-center select-none">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-medium leading-none ${
                        student.gender === 'ប្រុស'
                          ? 'bg-blue-50 text-blue-700 border border-blue-100/60'
                          : 'bg-rose-50 text-rose-700 border border-rose-100/60'
                      }`}
                    >
                      {student.gender}
                    </span>
                  </td>
                  
                  {/* Khmer */}
                  <td className="p-1.5 border-r border-slate-100 text-center font-mono bg-blue-50/10">{student.scores.khmerRead}</td>
                  <td className="p-1.5 border-r border-slate-100 text-center font-mono bg-blue-50/10">{student.scores.khmerWrite}</td>
                  <td className="p-1.5 border-r border-slate-100 text-center font-mono bg-blue-50/10">{student.scores.khmerComposition}</td>
                  
                  {/* Math */}
                  <td className="p-1.5 border-r border-slate-100 text-center font-mono bg-green-50/10">{student.scores.mathNumbers}</td>
                  <td className="p-1.5 border-r border-slate-100 text-center font-mono bg-green-50/10">{student.scores.mathMeasurement}</td>
                  <td className="p-1.5 border-r border-slate-100 text-center font-mono bg-green-50/10">{student.scores.mathGeometry}</td>
                  
                  {/* Science */}
                  <td className="p-1.5 border-r border-slate-100 text-center font-mono">{student.scores.science}</td>
                  
                  {/* Social Studies */}
                  <td className="p-1.5 border-r border-slate-100 text-center font-mono bg-purple-50/10">{student.scores.socialCivics}</td>
                  <td className="p-1.5 border-r border-slate-100 text-center font-mono bg-purple-50/10">{student.scores.socialGeography}</td>
                  <td className="p-1.5 border-r border-slate-100 text-center font-mono bg-purple-50/10">{student.scores.socialHistory}</td>
                  
                  {/* Other divisions */}
                  <td className="p-1.5 border-r border-slate-100 text-center font-mono">{student.scores.physicalEducation}</td>
                  <td className="p-1.5 border-r border-slate-100 text-center font-mono">{student.scores.practicalSkills}</td>
                  <td className="p-1.5 border-r border-slate-100 text-center font-mono">{student.scores.foreignLanguage}</td>
                  
                  {/* Calculated metrics */}
                  <td className="p-1.5 border-r border-slate-100 text-center font-mono font-bold bg-slate-50 text-slate-800">
                    {student.totalScore}
                  </td>
                  <td className="p-1.5 border-r border-slate-100 text-center font-mono bg-slate-50 text-slate-800">
                    {student.average}
                  </td>
                  
                  {/* Rank Column */}
                  <td className="p-1.5 border-r border-slate-100 text-center font-mono font-bold text-red-600 bg-red-50">
                    {student.rank}
                  </td>
                  
                  {/* Grade */}
                  <td className="p-1.5 border-r border-slate-100 text-center font-mono bg-slate-50">
                    <span
                      className={`font-extrabold ${
                        student.grade === 'A'
                          ? 'text-emerald-700'
                          : student.grade === 'B'
                          ? 'text-blue-700'
                          : student.grade === 'C'
                          ? 'text-teal-700'
                          : student.grade === 'D'
                          ? 'text-amber-700'
                          : student.grade === 'E'
                          ? 'text-orange-700'
                          : 'text-red-700'
                      }`}
                    >
                      {student.grade}
                    </span>
                  </td>

                  {/* Actions buttons */}
                  <td className="p-2 text-center border-l border-slate-100">
                    <div className="flex justify-center gap-1.5">
                      <button
                        onClick={() => handleEditTrigger(student)}
                        disabled={isReadOnly}
                        className={`p-1 rounded transition-all cursor-pointer ${
                          isReadOnly 
                            ? 'text-slate-300 pointer-events-none' 
                            : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                        title={isReadOnly ? "គណនាស្វ័យប្រវត្ត" : "កែប្រែពិន្ទុ"}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteConfirm(student)}
                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-all cursor-pointer"
                        title="លុបសិស្ស"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
