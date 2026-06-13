import React, { useState, useEffect } from 'react';
import { ComputedStudent } from '../utils/calculations';
import { Printer, Edit3, Save, X, Trophy, AlertCircle, RefreshCw, GraduationCap, MapPin, School, Calendar, CheckSquare, User } from 'lucide-react';

interface RankingTableProps {
  students: ComputedStudent[];
  selectedMonth: string;
  className: string;
}

export default function RankingTable({ students, selectedMonth, className }: RankingTableProps) {
  // Sort students by rank (ascending), then by serial number
  const rankedStudents = React.useMemo(() => {
    return [...students].sort((a, b) => {
      if (a.rank !== b.rank) {
        return a.rank - b.rank;
      }
      return a.name.localeCompare(b.name, 'km');
    });
  }, [students]);

  // Customizable Metadata with Local Storage persistence
  const [schoolName, setSchoolName] = useState(() => {
    return localStorage.getItem('khmer_ranking_school') || 'សាលាបឋមសិក្សាវត្តចែង';
  });
  const [location, setLocation] = useState(() => {
    return localStorage.getItem('khmer_ranking_location') || 'វត្តចែង';
  });
  const [teacherName, setTeacherName] = useState(() => {
    return localStorage.getItem('khmer_ranking_teacher') || 'ព្រំ សុធន';
  });
  const [principalName, setPrincipalName] = useState(() => {
    return localStorage.getItem('khmer_ranking_principal') || 'ជា សារុន';
  });

  const [isEditingMetadata, setIsEditingMetadata] = useState(false);
  const [tempSchool, setTempSchool] = useState(schoolName);
  const [tempLocation, setTempLocation] = useState(location);
  const [tempTeacher, setTempTeacher] = useState(teacherName);
  const [tempPrincipal, setTempPrincipal] = useState(principalName);

  // Auto-save metadata
  const handleSaveMetadata = () => {
    setSchoolName(tempSchool);
    setLocation(tempLocation);
    setTeacherName(tempTeacher);
    setPrincipalName(tempPrincipal);
    localStorage.setItem('khmer_ranking_school', tempSchool);
    localStorage.setItem('khmer_ranking_location', tempLocation);
    localStorage.setItem('khmer_ranking_teacher', tempTeacher);
    localStorage.setItem('khmer_ranking_principal', tempPrincipal);
    setIsEditingMetadata(false);
  };

  // Helper stats
  const femaleCount = rankedStudents.filter(s => s.gender === 'ស្រី').length;
  const totalCount = rankedStudents.length;

  // Convert month name to Khmer exam period phrase
  const getExamTitle = () => {
    if (selectedMonth.startsWith('ឆមាស')) {
      return `លទ្ធផលប្រឡងប្រចាំ${selectedMonth}`;
    } else if (selectedMonth === 'ប្រចាំឆ្នាំ' || selectedMonth === 'ដំណាច់ឆ្នាំ') {
      return `លទ្ធផលប្រឡងបញ្ចប់ឆ្នាំសិក្សា`;
    }
    return `លទ្ធផលប្រលងប្រចាំ${selectedMonth}`;
  };

  return (
    <div className="bg-slate-100 p-4 md:p-6 rounded-xl border border-slate-205 flex-1 flex flex-col gap-5 overflow-auto">
      {/* Configuration Header for Metadata */}
      <div className="bg-white p-4 rounded-xl border border-slate-200.5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xs shrink-0 select-none print:hidden">
        <div className="space-y-1">
          <h3 className="text-xs font-black text-slate-800 flex items-center gap-1.5 font-sans">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>កំណត់ព័ត៌មានក្បាលទំព័រ និងហត្ថលេខា (Report Info)</span>
          </h3>
          <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
            អ្នកអាចកែប្រែឈ្មោះសាលារៀន ទីតាំង និងឈ្មោះគ្រូ/នាយក ដើម្បីឱ្យត្រូវនឹងសាលារបស់អ្នកផ្ទាល់។ រួចចុចប៊ូតុងបោះពុម្ព។
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          {isEditingMetadata ? (
            <div className="flex gap-1.5 w-full md:w-auto">
              <button
                onClick={handleSaveMetadata}
                className="px-3 py-1.5 text-[11px] font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>រក្សាទុក</span>
              </button>
              <button
                onClick={() => {
                  setTempSchool(schoolName);
                  setTempLocation(location);
                  setTempTeacher(teacherName);
                  setTempPrincipal(principalName);
                  setIsEditingMetadata(false);
                }}
                className="px-3 py-1.5 text-[11px] font-bold bg-slate-150 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>បោះបង់</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingMetadata(true)}
              className="px-3.5 py-1.5 text-[11px] font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>កែប្រែព័ត៌មានគំរូ</span>
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 text-[11px] font-extrabold bg-slate-900 hover:bg-slate-850 text-white rounded-lg flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>បោះពុម្ព (Print)</span>
          </button>
        </div>
      </div>

      {/* Editing Metadata Form Panel */}
      {isEditingMetadata && (
        <div className="bg-blue-50/70 border border-blue-200/60 p-4 rounded-xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-fadeIn shrink-0 print:hidden text-slate-800">
          <div>
            <label className="block text-[10px] font-bold text-slate-600 mb-1 flex items-center gap-1">
              <School className="w-3 h-3 text-slate-400" />
              <span>ឈ្មោះសាលារៀន (School)</span>
            </label>
            <input
              type="text"
              value={tempSchool}
              onChange={(e) => setTempSchool(e.target.value)}
              className="w-full bg-white border border-slate-200.5 rounded px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-600 mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>ទីតាំង/ស្រុក/ភូមិ (Location)</span>
            </label>
            <input
              type="text"
              value={tempLocation}
              onChange={(e) => setTempLocation(e.target.value)}
              className="w-full bg-white border border-slate-200.5 rounded px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-600 mb-1 flex items-center gap-1">
              <GraduationCap className="w-3 h-3 text-slate-400" />
              <span>គ្រូបន្ទុកថ្នាក់ (Teacher Name)</span>
            </label>
            <input
              type="text"
              value={tempTeacher}
              onChange={(e) => setTempTeacher(e.target.value)}
              className="w-full bg-white border border-slate-200.5 rounded px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-600 mb-1 flex items-center gap-1">
              <User className="w-3 h-3 text-slate-400" />
              <span>នាយកសាលា (Principal Name)</span>
            </label>
            <input
              type="text"
              value={tempPrincipal}
              onChange={(e) => setTempPrincipal(e.target.value)}
              className="w-full bg-white border border-slate-200.5 rounded px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* PAPER CANVAS MOCKUP (Beautiful high-fidelity representation) */}
      <div className="flex-1 overflow-auto flex justify-center bg-slate-200/50 p-3 sm:p-5 md:p-8 rounded-xl border border-slate-300/40 relative">
        
        {/* Printable & Interactive ranking list canvas */}
        <div 
          id="ranking-sheet-print-container" 
          className="bg-white text-slate-950 w-full max-w-[800px] p-8 md:p-12 shadow-md rounded-lg mx-auto print:shadow-none print:p-0 print:border-none print:w-full min-h-[1050px] flex flex-col justify-between"
          style={{ fontFamily: '"Khmer OS", "Kantumruy Pro", sans-serif' }}
        >
          <div className="space-y-6">
            {/* Top Logo and Kingdom Header row */}
            <div className="flex justify-between items-start select-none">
              <div className="text-center space-y-1 text-slate-900">
                {/* Beautiful gold crest crown SVG or generic Khmer educational crest shape */}
                <div className="flex justify-center mb-1 print:hidden">
                  <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-250 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-amber-500" />
                  </div>
                </div>
                <h4 className="text-[11.5px] font-extrabold tracking-tight leading-none text-slate-800">{schoolName}</h4>
                <div className="border-b border-transparent w-full"></div>
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-xs font-bold leading-none tracking-wide text-slate-900">ព្រះរាជាណាចក្រកម្ពុជា</h3>
                <h3 className="text-[10px] font-bold leading-none text-slate-900">ជាតិ សាសនា ព្រះមហាក្សត្រ</h3>
                <div className="flex justify-center">
                  <span className="text-[9px] -mt-1 font-sans text-slate-600">-----------------</span>
                </div>
              </div>
            </div>

            {/* Middle Big Title */}
            <div className="text-center space-y-1.5">
              <h2 className="text-[13.5px] font-black text-slate-900 tracking-wide uppercase">
                {getExamTitle()}
              </h2>
              <div className="text-[11.5px] font-bold text-slate-600">
                ថ្នាក់រៀន ៖ {className}
              </div>
            </div>

            {/* Clean Ranking Table Grid with PDF Blue/Midnight styling */}
            <div className="border border-slate-300 rounded overflow-hidden">
              <table className="w-full text-center border-collapse text-xs">
                <thead>
                  <tr className="bg-[#3b60b3] text-white border-b border-slate-300 font-extrabold h-9">
                    <th className="border-r border-slate-200 w-12 text-center text-[10.5px]">ល.រ</th>
                    <th className="border-r border-slate-200 text-left pl-4 text-[10.5px] min-w-[200px]">គោត្តនាម និងនាម</th>
                    <th className="border-r border-slate-200 w-14 text-center text-[10.5px]">ភេទ</th>
                    <th className="border-r border-slate-200 w-24 text-center text-[10.5px]">ពិន្ទុសរុប</th>
                    <th className="border-r border-slate-200 w-24 text-center text-[10.5px]">មធ្យមភាគ</th>
                    <th className="border-r border-slate-200 w-24 text-center text-[10.5px]">ចំណាត់ថ្នាក់</th>
                    <th className="w-20 text-center text-[10.5px]">និទ្ទេស</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-250">
                  {rankedStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400 bg-slate-50/50">
                        មិនទាន់មានទិន្នន័យសិស្សនៅឡើយទេ។
                      </td>
                    </tr>
                  ) : (
                    rankedStudents.map((student, index) => {
                      const isFem = student.gender === 'ស្រី';
                      return (
                        <tr key={student.id} className="hover:bg-slate-50/50 h-[34px] transition-colors">
                          {/* sequential index 1 to N */}
                          <td className="border-r border-slate-200 font-mono text-slate-500 text-center text-[11px] font-bold select-none bg-slate-50/40">
                            {index + 1}
                          </td>
                          {/* Full student name */}
                          <td className="border-r border-slate-200 pl-4 text-left font-semibold text-slate-900 text-xs">
                            {student.name}
                          </td>
                          {/* Khmer standard abbreviation and gender presentation (ស/ប) */}
                          <td className="border-r border-slate-200 text-center font-bold">
                            <span className={isFem ? 'text-rose-600' : 'text-blue-700'}>
                              {isFem ? 'ស' : 'ប'}
                            </span>
                          </td>
                          {/* Computed total points */}
                          <td className="border-r border-slate-200 font-mono text-[11px] text-slate-700 text-center">
                            {student.totalScore.toFixed(2)}
                          </td>
                          {/* Average formatted to 2 decimals */}
                          <td className="border-r border-slate-200 font-mono text-[11px] text-slate-800 text-center font-semibold">
                            {student.average.toFixed(2)}
                          </td>
                          {/* Rank highlight in Red color exactly like PDF screenshot */}
                          <td className="border-r border-slate-200 text-red-600 font-extrabold text-[12.5px] text-center bg-red-50/30 font-mono">
                            {student.rank}
                          </td>
                          {/* Grade Mention letters A-F with colors */}
                          <td className="text-center font-bold text-[11px]">
                            <span className={
                              student.grade === 'A' ? 'text-emerald-700' :
                              student.grade === 'B' ? 'text-blue-700' :
                              student.grade === 'C' ? 'text-teal-700' :
                              student.grade === 'D' ? 'text-amber-700' :
                              student.grade === 'E' ? 'text-orange-700' : 'text-red-700'
                            }>
                              {student.grade}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Summary statistics certified line exactly like in the template */}
            <div className="flex justify-between items-center text-[11px] font-bold text-slate-700 pt-1 select-none">
              <div>
                បញ្ឈប់បញ្ជីត្រឹមចំនួន <span className="font-mono text-xs text-slate-900 font-bold">{totalCount}</span> នាក់ ស្រី <span className="font-mono text-xs text-rose-600 font-bold">{femaleCount}</span> នាក់
              </div>
              <div className="font-medium text-slate-600 font-sans italic">
                {totalCount > 0 ? 'របាយការណ៍ត្រូវបានផ្ទៀងផ្ទាត់ត្រឹមត្រូវ' : ''}
              </div>
            </div>
          </div>

          {/* Under-sheet signature blocks exactly like the second page of PDF template */}
          <div className="mt-12 space-y-6 select-none leading-relaxed">
            <div className="flex justify-between items-start">
              {/* Left Column Principal stamp block */}
              <div className="text-center w-52 space-y-0.5">
                <span className="text-[11px] font-black text-slate-800 block">បានឃើញ និងឯកភាព</span>
                <span className="text-[11px] font-extrabold text-slate-700 block mt-1">នាយកសាលា</span>
                <div className="h-16"></div>
                <span className="text-[11px] font-extrabold text-slate-900 block relative">
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border-2 border-dashed border-red-400/40 flex items-center justify-center text-[10px] text-red-400 rotate-12 uppercase print:hidden">Stamp</span>
                  {principalName}
                </span>
              </div>

              {/* Right Column teacher stamp and date block */}
              <div className="text-center w-56 space-y-0.5">
                <span className="text-[10.5px] text-slate-600 block">
                  {location} ថ្ងៃទី {new Date().getDate()} ខែ {
                    new Date().getMonth() === 0 ? 'មករា' :
                    new Date().getMonth() === 1 ? 'កុម្ភៈ' :
                    new Date().getMonth() === 2 ? 'មីនា' :
                    new Date().getMonth() === 3 ? 'មេសា' :
                    new Date().getMonth() === 4 ? 'ឧសភា' :
                    new Date().getMonth() === 5 ? 'មិថុនា' :
                    new Date().getMonth() === 6 ? 'កក្កដា' :
                    new Date().getMonth() === 7 ? 'សីហា' :
                    new Date().getMonth() === 8 ? 'កញ្ញា' :
                    new Date().getMonth() === 9 ? 'តុលា' :
                    new Date().getMonth() === 10 ? 'វិច្ឆិកា' : 'ធ្នូ'
                  } ឆ្នាំ {new Date().getFullYear()}
                </span>
                <span className="text-[11px] font-black text-slate-800 block mt-1">គ្រូបន្ទុកថ្នាក់</span>
                <div className="h-16"></div>
                <span className="text-[11px] font-extrabold text-indigo-900 block mt-1 font-bold">
                  {teacherName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
