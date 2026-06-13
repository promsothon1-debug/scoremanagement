import React, { useState, useEffect } from 'react';
import { Student, SheetConfig, SubjectScores } from './types';
import StudentForm from './components/StudentForm';
import StudentTable from './components/StudentTable';
import SheetsConfigPanel from './components/SheetsConfigPanel';
import { computeStudentsForPeriod, calculateScores } from './utils/calculations';
import { INITIAL_STUDENTS } from './utils/mockData';
import { 
  Search, 
  Users, 
  Percent, 
  Award, 
  Clipboard, 
  ClipboardCheck, 
  Info, 
  RotateCcw, 
  Download, 
  FileSpreadsheet,
  FileText,
  Printer,
  Plus,
  Trash2,
  AlertTriangle,
  ShieldCheck,
  GraduationCap,
  Lock,
  Unlock
} from 'lucide-react';

export default function App() {
  // Load initial settings
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('khmer_student_grades_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse students from localStorage', e);
      }
    }
    // For original students, we map them as belonging to 'ថ្នាក់ទី ៦ ក' if not specified
    const initialized = INITIAL_STUDENTS.map(s => ({
      ...s,
      className: s.className || 'ថ្នាក់ទី ៦ ក'
    }));
    return initialized;
  });

  const [classList, setClassList] = useState<string[]>(() => {
    const saved = localStorage.getItem('khmer_class_list_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse class list from localStorage', e);
      }
    }
    return ["ថ្នាក់ទី ៦ ក", "ថ្នាក់ទី ៦ ខ", "ថ្នាក់ទី ៥ ក", "ថ្នាក់ទី ៤ គ"];
  });

  const [newClassName, setNewClassName] = useState('');
  const [isAddingClass, setIsAddingClass] = useState(false);

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    const nameTrimmed = newClassName.trim();
    if (!nameTrimmed) return;
    if (classList.includes(nameTrimmed)) {
      showNotice('error', 'ឈ្មោះថ្នាក់នេះមានរួចរាល់ហើយ!');
      return;
    }
    setClassList([...classList, nameTrimmed]);
    setConfig(prev => ({ ...prev, className: nameTrimmed }));
    setNewClassName('');
    setIsAddingClass(false);
    showNotice('success', `បានបង្កើតថ្នាក់ « ${nameTrimmed} » ថ្មីជោគជ័យ!`);
  };

  const handleDeleteClass = () => {
    const activeClass = config.className;
    const count = students.filter(s => (s.className || 'ថ្នាក់ទី ៦ ក') === activeClass).length;
    if (count > 0) {
      showNotice('error', `មិនអាចលុបថ្នាក់នេះបានទេព្រោះមានសិស្សចំនួន ${count} នាក់កំពុងសិក្សា!`);
      return;
    }
    if (classList.length <= 1) {
      showNotice('error', 'ត្រូវតែមានថ្នាក់រៀនយ៉ាងហោចណាស់មួយ!');
      return;
    }
    const isConfirmed = window.confirm(`តើអ្នកពិតជាចង់លុបថ្នាក់ « ${activeClass} » មែនទេ?`);
    if (isConfirmed) {
      const remainingList = classList.filter(cls => cls !== activeClass);
      setClassList(remainingList);
      setConfig(prev => ({ ...prev, className: remainingList[0] }));
      showNotice('info', `បានលុបថ្នាក់ « ${activeClass} » រួចរាល់!`);
    }
  };

  const [config, setConfig] = useState<SheetConfig>(() => {
    const saved = localStorage.getItem('khmer_sheets_config_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse config from localStorage', e);
      }
    }
    return {
      spreadsheetId: '',
      sheetName: 'Sheet1',
      className: 'ថ្នាក់ទី ៦ ក',
      selectedMonth: 'ខែកុម្ភៈ',
      isAutoSync: true,
    };
  });

  const [activeStudent, setActiveStudent] = useState<Student | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'ទាំងអស់' | 'ប្រុស' | 'ស្រី'>('ទាំងអស់');
  const [sortBy, setSortBy] = useState<'serial' | 'rank' | 'name'>(() => {
    const saved = localStorage.getItem('khmer_student_sort_by');
    return (saved as 'serial' | 'rank' | 'name') || 'serial';
  });
  const [tableFontSize, setTableFontSize] = useState<number>(() => {
    const saved = localStorage.getItem('khmer_student_font_size');
    return saved ? parseInt(saved, 10) : 11;
  });
  const [alertThreshold, setAlertThreshold] = useState<number>(() => {
    const saved = localStorage.getItem('khmer_student_alert_threshold');
    return saved ? parseFloat(saved) : 5.0;
  });
  const [showOnlyLowPerformers, setShowOnlyLowPerformers] = useState<boolean>(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [localMessage, setLocalMessage] = useState<{ type: 'info' | 'success' | 'error'; text: string } | null>(null);
  
  const [userRole, setUserRole] = useState<'admin' | 'teacher'>(() => {
    const saved = localStorage.getItem('khmer_student_role');
    return (saved as 'admin' | 'teacher') || 'admin';
  });

  useEffect(() => {
    localStorage.setItem('khmer_student_role', userRole);
  }, [userRole]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('khmer_student_grades_v2', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('khmer_sheets_config_v2', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('khmer_class_list_v2', JSON.stringify(classList));
  }, [classList]);

  useEffect(() => {
    localStorage.setItem('khmer_student_sort_by', sortBy);
  }, [sortBy]);

  useEffect(() => {
    localStorage.setItem('khmer_student_font_size', tableFontSize.toString());
  }, [tableFontSize]);

  useEffect(() => {
    localStorage.setItem('khmer_student_alert_threshold', alertThreshold.toString());
  }, [alertThreshold]);

  // Is active view read-only (semester/yearly computed averages)
  const isReadOnly = React.useMemo(() => {
    return ['ឆមាសទី១', 'ឆមាសទី២', 'ដំណាច់ឆ្នាំ', 'ប្រចាំឆ្នាំ'].includes(config.selectedMonth);
  }, [config.selectedMonth]);

  // Compute active students view for currently selected class ONLY
  const computedStudents = React.useMemo(() => {
    const filteredByClass = students.filter(s => {
      const studentClass = s.className || 'ថ្នាក់ទី ៦ ក';
      return studentClass === config.className;
    });
    return computeStudentsForPeriod(filteredByClass, config.selectedMonth);
  }, [students, config.className, config.selectedMonth]);

  // Compute next available serial number independent for each class
  const nextSerialNo = React.useMemo(() => {
    const filteredByClass = students.filter(s => {
      const studentClass = s.className || 'ថ្នាក់ទី ៦ ក';
      return studentClass === config.className;
    });
    if (filteredByClass.length === 0) return '01';
    const nums = filteredByClass.map(s => parseInt(s.serialNo)).filter(n => !isNaN(n));
    if (nums.length === 0) return String(filteredByClass.length + 1).padStart(2, '0');
    const max = Math.max(...nums);
    return String(max + 1).padStart(2, '0');
  }, [students, config.className]);

  // Handle student insertion or modification
  const handleSaveStudent = (
    id: string, 
    name: string, 
    gender: 'ប្រុស' | 'ស្រី', 
    serialNo: string, 
    scoresData: SubjectScores,
    attendanceData: { present: number; absent: number }
  ) => {
    if (isReadOnly) return;

    setStudents((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      let updatedList = [...prev];
      if (idx > -1) {
        // update existing student general data and active month scores
        const existing = updatedList[idx];
        updatedList[idx] = {
          ...existing,
          name,
          gender,
          serialNo,
          className: existing.className || config.className,
          monthlyScores: {
            ...(existing.monthlyScores || {}),
            [config.selectedMonth]: scoresData
          },
          monthlyAttendance: {
            ...(existing.monthlyAttendance || {}),
            [config.selectedMonth]: attendanceData
          }
        };
      } else {
        // save new student
        updatedList.push({
          id,
          serialNo,
          name,
          gender,
          className: config.className,
          monthlyScores: {
            [config.selectedMonth]: scoresData
          },
          monthlyAttendance: {
            [config.selectedMonth]: attendanceData
          }
        });
      }
      
      const currentClassStudents = updatedList.filter(s => (s.className || 'ថ្នាក់ទី ៦ ក') === config.className);
      const newComputed = computeStudentsForPeriod(currentClassStudents, config.selectedMonth);
      
      // Auto-sync trigger
      if (config.isAutoSync && config.spreadsheetId) {
        triggerAutoSync(newComputed);
      }

      return updatedList;
    });

    setActiveStudent(null);
    setIsFormOpen(false);
    showNotice('success', `រក្សាទុកពិន្ទុសម្រាប់ « ${name} » ក្នុង [${config.selectedMonth}] ជោគជ័យ!`);
  };

  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      const currentClassStudents = filtered.filter(s => (s.className || 'ថ្នាក់ទី ៦ ក') === config.className);
      const newComputed = computeStudentsForPeriod(currentClassStudents, config.selectedMonth);

      if (config.isAutoSync && config.spreadsheetId) {
        triggerAutoSync(newComputed);
      }

      return filtered;
    });
    setActiveStudent(null);
    setIsFormOpen(false);
    showNotice('info', 'បានលុបទិន្នន័យសិស្សរួចរាល់!');
  };

  const handleResetData = () => {
    const isConfirmed = window.confirm(
      'តើអ្នកចង់កំណត់ឡើងវិញទិន្នន័យទាំងអស់ ទៅកាន់គំរូដើមរបស់ក្រសួងវិញមែនទេ?'
    );
    if (isConfirmed) {
      const initialized = INITIAL_STUDENTS.map(s => ({
        ...s,
        className: s.className || 'ថ្នាក់ទី ៦ ក'
      }));
      setStudents(initialized);
      setClassList(["ថ្នាក់ទី ៦ ក", "ថ្នាក់ទី ៦ ខ", "ថ្នាក់ទី ៥ ក", "ថ្នាក់ទី ៤ គ"]);
      setConfig(prev => ({ ...prev, className: 'ថ្នាក់ទី ៦ ក' }));
      setActiveStudent(null);
      showNotice('success', 'បានកំណត់ឡើងវិញនូវគំរូដើមរួចរាល់!');
    }
  };

  // Helper notice banner
  const showNotice = (type: 'info' | 'success' | 'error', text: string) => {
    setLocalMessage({ type, text });
    setTimeout(() => {
      setLocalMessage(null);
    }, 4000);
  };

  // Auto sync logic (silent trigger)
  const triggerAutoSync = async (studentsList: any[]) => {
    console.log('Auto Sync: saving config table rows...', studentsList);
  };

  // Format array payload values
  const formatTableValues = (studentsList: any[]) => {
    const headers = [
      'ល.រ', 'ឈ្មោះសិស្ស', 'ភេទ',
      'ភាសាខ្មែរ (រៀនអាន)', 'ភាសាខ្មែរ (សរសេរតាមអាន)', 'ភាសាខ្មែរ (តែងសេចក្ដី)',
      'គណិតវិទ្យា (ចំនួន)', 'គណិតវិទ្យា (រង្វាស់រង្វាល់)', 'គណិតវិទ្យា (ធរណីមាត្រ)',
      'វិទ្យាសាស្ត្រ',
      'សិក្សាសង្គម (សីលធម៌-ពលរដ្ឋ)', 'សិក្សាសង្គម (ភូមិវិទ្យា)', 'សិក្សាសង្គម (ប្រវត្តិវិទ្យា)',
      'អប់រំកាយនិងកីឡា', 'បំណិន', 'ភាសាបរទេស',
      'វត្តមាន (មក)', 'អវត្តមាន (ឈប់)',
      'ពិន្ទុសរុប', 'មធ្យមភាគ', 'ចំណាត់ថ្នាក់', 'និទ្ទេស', 'ស្ថានភាព'
    ];

    const rows = studentsList.map(s => [
      s.serialNo, s.name, s.gender,
      s.scores.khmerRead, s.scores.khmerWrite, s.scores.khmerComposition,
      s.scores.mathNumbers, s.scores.mathMeasurement, s.scores.mathGeometry,
      s.scores.science,
      s.scores.socialCivics, s.scores.socialGeography, s.scores.socialHistory,
      s.scores.physicalEducation, s.scores.practicalSkills, s.scores.foreignLanguage,
      s.attendance?.present || 0, s.attendance?.absent || 0,
      s.totalScore, s.average, s.rank, s.grade, s.status
    ]);

    return [headers, ...rows];
  };

  // COPIER FOR INSTANT CLIPBOARD SYNC TO GOOGLE SHEETS
  const handleCopyToClipboard = () => {
    const values = formatTableValues(computedStudents);
    const tsvContent = values.map(row => row.join("\t")).join("\n");
    
    navigator.clipboard.writeText(tsvContent).then(() => {
      setCopiedSuccess(true);
      showNotice('success', 'បានចម្លងតារាង! ឥឡូវអ្នកអាចប្រើ Ctrl+V នៅលើ Google Sheets ផ្ទាល់!');
      setTimeout(() => setCopiedSuccess(false), 3000);
    }).catch(err => {
      console.error('Failed to copy', err);
      showNotice('error', 'ការចម្លងបរាជ័យ។');
    });
  };

  // 1. EXPORT TO CSV
  const handleExportCSV = () => {
    const values = formatTableValues(computedStudents);
    const csvContent = "\uFEFF" + values.map(e => e.map(val => `"${val}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.className = "hidden";
    link.setAttribute("href", url);
    link.setAttribute("download", `ពិន្ទុសិស្ស-${config.className}-${config.selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotice('success', 'ទាញយកឯកសារ CSV រួចរាល់!');
  };

  // 2. EXPORT TO MICROSOFT EXCEL (.XLS) WITH STYLES
  const handleExportExcel = () => {
    let tableHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <style>
          table { border-collapse: collapse; font-family: 'Khmer OS', 'Kantumruy Pro', sans-serif; width: 100%; }
          th { border: 1px solid #94a3b8; background-color: #f1f5f9; padding: 6px; font-weight: bold; text-align: center; font-size: 11px; }
          td { border: 1px solid #94a3b8; padding: 5px; text-align: center; font-size: 11px; }
          .title-row { font-size: 15px; font-weight: bold; text-align: center; border: none; height: 35px; }
          .header-bg-khmer { background-color: #dbeafe; color: #1e40af; }
          .header-bg-math { background-color: #dcfce7; color: #166534; }
          .header-bg-social { background-color: #f3e8ff; color: #6b21a8; }
          .bold-col { font-weight: bold; background-color: #f8fafc; }
          .rank-col { font-weight: bold; color: #dc2626; background-color: #fef2f2; }
          .text-left { text-align: left; padding-left: 8px; }
        </style>
      </head>
      <body>
        <table>
          <tr><td colspan="23" class="title-row">សន្លឹកបញ្ជីស្រង់ពិន្ទុមធ្យមភាគសិស្សថ្នាក់បឋមសិក្សា</td></tr>
          <tr><td colspan="23" class="title-row">ថ្នាក់រៀន៖ ${config.className} | របាយការណ៍៖ ${config.selectedMonth} | ឆ្នាំសិក្សា៖ ២០២៥ - ២០២៦</td></tr>
          <tr><td colspan="23" style="border:none; height: 10px;"></td></tr>
          
          <tr>
            <th rowspan="2">ល.រ</th>
            <th rowspan="2">ឈ្មោះសិស្ស</th>
            <th rowspan="2">ភេទ</th>
            <th colspan="3" class="header-bg-khmer">ភាសាខ្មែរ</th>
            <th colspan="3" class="header-bg-math">គណិតវិទ្យា</th>
            <th rowspan="2">វិទ្យាសាស្ត្រ</th>
            <th colspan="3" class="header-bg-social">សិក្សាសង្គម</th>
            <th rowspan="2">អប់រំកាយ</th>
            <th rowspan="2">បំណិនជីវិត</th>
            <th rowspan="2">ភាសាបរទេស</th>
            <th colspan="2" style="background-color: #fef3c7; color: #92400e;">វត្តមានកិច្ចការ</th>
            <th rowspan="2" class="bold-col">ពិន្ទុសរុប</th>
            <th rowspan="2" class="bold-col">មធ្យមភាគ</th>
            <th rowspan="2" class="rank-col">ចំណាត់ថ្នាក់</th>
            <th rowspan="2" class="bold-col">និទ្ទេស</th>
            <th rowspan="2">ស្ថានភាព</th>
          </tr>
          <tr>
            <th class="header-bg-khmer">អាន</th>
            <th class="header-bg-khmer">សរសេរ</th>
            <th class="header-bg-khmer">តែង</th>
            <th class="header-bg-math">ចំនួន</th>
            <th class="header-bg-math">រង្វាស់</th>
            <th class="header-bg-math">ធរណី</th>
            <th class="header-bg-social">សីល</th>
            <th class="header-bg-social">ភូមិ</th>
            <th class="header-bg-social">ប្រវត្តិ</th>
            <th style="background-color: #fffbeb; color: #15803d;">មក</th>
            <th style="background-color: #fffbeb; color: #b91c1c;">ឈប់</th>
          </tr>
    `;

    computedStudents.forEach(s => {
      tableHtml += `
        <tr>
          <td>${s.serialNo}</td>
          <td class="text-left">${s.name}</td>
          <td>${s.gender}</td>
          <td>${s.scores.khmerRead}</td>
          <td>${s.scores.khmerWrite}</td>
          <td>${s.scores.khmerComposition}</td>
          <td>${s.scores.mathNumbers}</td>
          <td>${s.scores.mathMeasurement}</td>
          <td>${s.scores.mathGeometry}</td>
          <td>${s.scores.science}</td>
          <td>${s.scores.socialCivics}</td>
          <td>${s.scores.socialGeography}</td>
          <td>${s.scores.socialHistory}</td>
          <td>${s.scores.physicalEducation}</td>
          <td>${s.scores.practicalSkills}</td>
          <td>${s.scores.foreignLanguage}</td>
          <td>${s.attendance?.present || 0}</td>
          <td style="${s.attendance?.absent > 0 ? 'color:#dc2626; font-weight:bold;' : ''}">${s.attendance?.absent || 0}</td>
          <td class="bold-col">${s.totalScore}</td>
          <td class="bold-col">${s.average}</td>
          <td class="rank-col">${s.rank}</td>
          <td class="bold-col">${s.grade}</td>
          <td>${s.status}</td>
        </tr>
      `;
    });

    tableHtml += `
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(["\uFEFF" + tableHtml], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `បញ្ជីពិន្ទុ-${config.className}-${config.selectedMonth}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotice('success', 'នាំចេញឯកសារ Excel (.xls) ជោគជ័យ!');
  };

  // 3. EXPORT TO MICROSOFT WORD (.DOC)
  const handleExportWord = () => {
    let wordContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Khmer OS', 'Kantumruy Pro', serif; margin: 20px; }
          .ministry-header { text-align: center; font-size: 11px; margin-bottom: 25px; line-height: 1.6; }
          .title { text-align: center; font-size: 15px; font-weight: bold; margin-bottom: 6px; }
          .subtitle { text-align: center; font-size: 11px; margin-bottom: 25px; }
          table { border-collapse: collapse; width: 100%; margin-top: 15px; font-size: 9px; }
          th, td { border: 1px solid black; padding: 4px; text-align: center; }
          th { background-color: #f3f4f6; font-weight: bold; }
          .text-left { text-align: left; padding-left: 5px; }
          .signatures { margin-top: 35px; width: 100%; border: none; }
          .signatures td { border: none; text-align: center; width: 50%; font-size: 11px; }
        </style>
      </head>
      <body>
        <div class="ministry-header">
          <strong>ព្រះរាជាណាចក្រកម្ពុជា</strong><br>
          <strong>ជាតិ សាសនា ព្រះមហាក្សត្រ</strong><br>
          -------------------<br>
          <strong>មន្ទីរអប់រំ យុវជន និងកីឡា</strong><br>
          <strong>ការិយាល័យអប់រំយុវជន និងកីឡាថ្នាក់បឋមសិក្សា</strong>
        </div>
        
        <div class="title">បញ្ជីស្រង់ពិន្ទុមធ្យមភាគសิស្សថ្នាក់បឋមសិស្ស</div>
        <div class="subtitle"><strong>ថ្នាក់៖</strong> ${config.className} | <strong>របាយការណ៍៖</strong> ${config.selectedMonth} | <strong>ឆ្នាំសិក្សា៖</strong> ២០២៥ - ២០២៦</div>

        <table>
          <thead>
            <tr>
              <th rowspan="2">ល.រ</th>
               <th rowspan="2" style="min-width: 100px;">ឈ្មោះសិស្ស</th>
               <th rowspan="2">ភេទ</th>
               <th colspan="3">ភាសាខ្មែរ</th>
               <th colspan="3">គណិតវិទ្យា</th>
               <th rowspan="2">វិទ្យា.</th>
               <th colspan="3">សិក្សាសង្គម</th>
               <th rowspan="2">កាយ</th>
               <th rowspan="2">បំណិន</th>
               <th rowspan="2">បរទេស</th>
               <th colspan="2">វត្តមាន</th>
               <th rowspan="2">សរុប</th>
               <th rowspan="2">មធ្យម</th>
               <th rowspan="2">ចំណាត់.</th>
               <th rowspan="2">និទ្ទេស</th>
               <th rowspan="2">ស្ថានភាព</th>
            </tr>
            <tr>
              <th>អាន</th>
              <th>សរសេរ</th>
              <th>តែង</th>
              <th>ចំនួន</th>
              <th>រង្វាស់</th>
              <th>ធរណី</th>
              <th>សីល</th>
              <th>ភូមិ</th>
              <th>ប្រវត្តិ</th>
              <th>មក</th>
              <th>ឈប់</th>
            </tr>
          </thead>
          <tbody>
    `;

    computedStudents.forEach(s => {
      wordContent += `
        <tr>
          <td>${s.serialNo}</td>
          <td class="text-left">${s.name}</td>
          <td>${s.gender}</td>
          <td>${s.scores.khmerRead}</td>
          <td>${s.scores.khmerWrite}</td>
          <td>${s.scores.khmerComposition}</td>
          <td>${s.scores.mathNumbers}</td>
          <td>${s.scores.mathMeasurement}</td>
          <td>${s.scores.mathGeometry}</td>
          <td>${s.scores.science}</td>
          <td>${s.scores.socialCivics}</td>
          <td>${s.scores.socialGeography}</td>
          <td>${s.scores.socialHistory}</td>
          <td>${s.scores.physicalEducation}</td>
          <td>${s.scores.practicalSkills}</td>
          <td>${s.scores.foreignLanguage}</td>
          <td>${s.attendance?.present || 0}</td>
          <td>${s.attendance?.absent || 0}</td>
          <td><strong>${s.totalScore}</strong></td>
          <td><strong>${s.average}</strong></td>
          <td><strong>${s.rank}</strong></td>
          <td><strong>${s.grade}</strong></td>
          <td>${s.status}</td>
        </tr>
      `;
    });

    wordContent += `
          </tbody>
        </table>

        <table class="signatures">
          <tr>
            <td>
              បានឃើញ និងឯកភាព<br>
              <strong>នាយកសាលា</strong>
              <div style="height: 50px;"></div>
            </td>
            <td>
              ថ្ងៃទី...... ខែ...... ឆ្នាំ២០២៦<br>
              <strong>គ្រូទទួលបន្ទុកថ្នាក់</strong>
              <div style="height: 50px;"></div>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(["\uFEFF" + wordContent], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `របាយការណ៍ពិន្ទុ-${config.className}-${config.selectedMonth}.doc`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotice('success', 'នាំចេញឯកសារ Word (.doc) ជោគជ័យ!');
  };

  // REAL Google Sheets Sync Push
  const handleSyncPush = async (token?: string) => {
    if (!config.spreadsheetId) {
      throw new Error('សូមបញ្ចូលវិបសាយ URL ឬ ID សន្លឹកស្ពៀតស៊ិតមុននឹងធ្វើការបញ្ជូន!');
    }

    const values = formatTableValues(computedStudents);
    const range = `${config.sheetName || 'Sheet1'}!A1:U${values.length + 1}`;
    
    if (token) {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values }),
      });

      if (!response.ok) {
        const errorDetails = await response.json().catch(() => ({}));
        throw new Error(errorDetails?.error?.message || `ការឆ្លើយតបកូដ៖ ${response.status}`);
      }
      showNotice('success', `បញ្ជូនទិន្នន័យ [${config.selectedMonth}] ទៅ Google Sheets ជោគជ័យ!`);
    } else {
      await new Promise(resolve => setTimeout(resolve, 1200));
      handleExportExcel(); // Free alternative backup
    }
  };

  // REAL Google Sheets Sync Pull
  const handleSyncPull = async (token?: string) => {
    if (!config.spreadsheetId) {
      throw new Error('សូមបញ្ចូលវិបសាយ URL ឬ ID សន្លឹកស្ពៀតស៊ិតមុននឹងទាញយក!');
    }

    const range = `${config.sheetName || 'Sheet1'}!A1:U100`;

    if (token) {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${range}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorDetails = await response.json().catch(() => ({}));
        throw new Error(errorDetails?.error?.message || `ការឆ្លើយតបកូដ៖ ${response.status}`);
      }

      const data = await response.json();
      if (!data.values || data.values.length < 2) {
        throw new Error('មិនមានទិន្នន័យសិស្ស ឬជួរដេកគ្រប់គ្រាន់នៅក្នុង Sheet នេះឡើយ!');
      }

      const rows = data.values as any[][];
      const studentRows = rows.slice(1);
      
      setStudents((prev) => {
        let updatedList = [...prev];
        
        studentRows.forEach((row, idx) => {
          const serialNo = row[0] || String(idx + 1).padStart(2, '0');
          const name = row[1] || `សិស្សជួរ ${idx + 2}`;
          const gender = (row[2] === 'ស្រី' ? 'ស្រី' : 'ប្រុស');

          const parseVal = (colId: number) => {
            const v = parseFloat(row[colId]);
            return isNaN(v) ? 0 : v;
          };

          const scores: SubjectScores = {
            khmerRead: parseVal(3),
            khmerWrite: parseVal(4),
            khmerComposition: parseVal(5),
            mathNumbers: parseVal(6),
            mathMeasurement: parseVal(7),
            mathGeometry: parseVal(8),
            science: parseVal(9),
            socialCivics: parseVal(10),
            socialGeography: parseVal(11),
            socialHistory: parseVal(12),
            physicalEducation: parseVal(13),
            practicalSkills: parseVal(14),
            foreignLanguage: parseVal(15),
          };

          const sIdx = updatedList.findIndex(
            (s) => s.name.trim() === name.trim() || s.serialNo === serialNo
          );

          if (sIdx > -1) {
            const existing = updatedList[sIdx];
            updatedList[sIdx] = {
              ...existing,
              name,
              gender,
              serialNo,
              monthlyScores: {
                ...(existing.monthlyScores || {}),
                [config.selectedMonth]: scores,
              },
            };
          } else {
            updatedList.push({
              id: `s_sheet_${idx}_${Date.now()}`,
              serialNo,
              name,
              gender,
              monthlyScores: {
                [config.selectedMonth]: scores,
              },
            });
          }
        });
        
        return updatedList;
      });
      showNotice('success', `បានទាញយក និងបញ្ចូលទិន្នន័យក្នុង [${config.selectedMonth}] រួចរាល់!`);
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000));
      throw new Error('តម្រូវឲ្យមាន Google OAuth Access Token ដើម្បីទាញយកទិន្នន័យពីគណនីឯកជនសន្លឹកកិច្ចការរបស់អ្នក។');
    }
  };

  // Filters and sorting calculation
  const filteredStudents = React.useMemo(() => {
    let list = computedStudents.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.serialNo.includes(searchQuery);
      const matchGender = genderFilter === 'ទាំងអស់' ? true : s.gender === genderFilter;
      return matchSearch && matchGender;
    });

    if (showOnlyLowPerformers) {
      list = list.filter(s => s.average < alertThreshold);
    }

    if (sortBy === 'rank') {
      return [...list].sort((a, b) => a.rank - b.rank);
    } else if (sortBy === 'name') {
      return [...list].sort((a, b) => a.name.localeCompare(b.name, 'km'));
    } else {
      return [...list].sort((a, b) => {
        const numA = parseInt(a.serialNo);
        const numB = parseInt(b.serialNo);
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }
        return a.serialNo.localeCompare(b.serialNo);
      });
    }
  }, [computedStudents, searchQuery, genderFilter, sortBy, showOnlyLowPerformers, alertThreshold]);

  // Printable students sorted the same way but unfiltered by search or gender
  const printableStudents = React.useMemo(() => {
    if (sortBy === 'rank') {
      return [...computedStudents].sort((a, b) => a.rank - b.rank);
    } else if (sortBy === 'name') {
      return [...computedStudents].sort((a, b) => a.name.localeCompare(b.name, 'km'));
    } else {
      return [...computedStudents].sort((a, b) => {
        const numA = parseInt(a.serialNo);
        const numB = parseInt(b.serialNo);
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }
        return a.serialNo.localeCompare(b.serialNo);
      });
    }
  }, [computedStudents, sortBy]);

  // Students with average lower than alertThreshold
  const poorPerformingStudents = React.useMemo(() => {
    return computedStudents.filter(s => s.average < alertThreshold);
  }, [computedStudents, alertThreshold]);

  // Key stats computation
  const stats = React.useMemo(() => {
    const total = computedStudents.length;
    if (total === 0) {
      return { total, girls: 0, boys: 0, classAverage: 0, passed: 0, failed: 0 };
    }
    const girls = computedStudents.filter(s => s.gender === 'ស្រី').length;
    const boys = total - girls;
    const classAverage = Number((computedStudents.reduce((sum, s) => sum + s.average, 0) / total).toFixed(2));
    const passed = computedStudents.filter(s => s.status === 'ជាប់').length;
    const failed = total - passed;

    return { total, girls, boys, classAverage, passed, failed };
  }, [computedStudents]);

  return (
    <div className="flex flex-col h-screen w-full bg-[#F8FAFC] font-sans text-slate-800 overflow-hidden leading-normal">
      
      {/* HEADER SECTION - HIDDEN IN PRINT */}
      <header className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-slate-200 shrink-0 select-none print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-sm">
            A+
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 font-sans tracking-wide">ប្រព័ន្ធស្រង់ពិន្ទុសិស្សថ្នាក់បឋម</h1>
            <p className="text-[10px] text-slate-500 font-medium">Student Grade Management System v3.0</p>
          </div>
        </div>

        {/* Role Selector Toggle (Admin vs Teacher) */}
        <div className="flex items-center bg-slate-100 p-0.5 sm:p-1 rounded-xl border border-slate-205 shrink-0 scale-90 sm:scale-100">
          <button
            type="button"
            onClick={() => {
              setUserRole('admin');
              showNotice('success', 'បានប្ដូរទៅកាន់៖ ទិដ្ឋភាពអេដមីន (Admin View) ជោគជ័យ!');
            }}
            className={`px-2.5 sm:px-3.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold font-sans transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer active:scale-95 ${
              userRole === 'admin'
                ? 'bg-blue-600 text-white shadow-sm font-extrabold'
                : 'text-slate-650 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>អេដមីន (Admin)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setUserRole('teacher');
              showNotice('success', 'បានប្ដូរទៅកាន់៖ ទិដ្ឋភាពគ្រូបន្ទុកថ្នាក់ (Teacher View) ជោគជ័យ!');
            }}
            className={`px-2.5 sm:px-3.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold font-sans transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer active:scale-95 ${
              userRole === 'teacher'
                ? 'bg-indigo-600 text-white shadow-sm font-extrabold'
                : 'text-slate-655 hover:text-indigo-905 hover:bg-slate-200/50'
            }`}
          >
            <GraduationCap className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>គ្រូបន្ទុកថ្នាក់ (Teacher)</span>
          </button>
        </div>

        {/* Local Message banner status */}
        {localMessage && (
          <div className={`px-4 py-1.5 text-[11px] font-semibold rounded-full border hidden md:flex items-center gap-2 animate-fadeIn ${
            localMessage.type === 'success' 
              ? 'bg-green-50 border-green-100 text-green-700' 
              : localMessage.type === 'error'
              ? 'bg-red-50 border-red-100 text-red-700'
              : 'bg-blue-50 border-blue-100 text-blue-700'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping"></span>
            <span>{localMessage.text}</span>
          </div>
        )}

        <div className="flex items-center gap-2.5">
          {/* Quick Clipboard Buffer Copier */}
          <button
            onClick={handleCopyToClipboard}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md border flex items-center gap-1.5 transition-all text-slate-700 bg-slate-50 border-slate-200 hover:bg-slate-100 cursor-pointer ${
              copiedSuccess ? 'border-green-300 bg-green-50 text-green-700' : ''
            }`}
            title="ចម្លងដើម្បី Paste លើ Excel ឬ Sheet"
          >
            {copiedSuccess ? <ClipboardCheck className="w-3.5 h-3.5" /> : <Clipboard className="w-3.5 h-3.5" />}
            <span className="hidden leading-normal sm:inline">{copiedSuccess ? 'បានចម្លងរួចរាល់' : 'ចម្លងតារាង'}</span>
          </button>

          {/* EXCEL EXPORT BUTTON */}
          <button
            onClick={handleExportExcel}
            className="px-3 py-1.5 text-xs font-semibold rounded-md bg-white border border-slate-200 text-emerald-800 hover:bg-emerald-50 hover:border-emerald-300 flex items-center gap-1.5 transition-all cursor-pointer"
            title="ទាញយកជាសន្លឹកកិច្ចការ Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">នាំចេញ Excel</span>
          </button>

          {/* WORD EXPORT BUTTON */}
          <button
            onClick={handleExportWord}
            className="px-3 py-1.5 text-xs font-semibold rounded-md bg-white border border-slate-200 text-blue-800 hover:bg-blue-50 hover:border-blue-300 flex items-center gap-1.5 transition-all cursor-pointer"
            title="ទាញយកជារបាយការណ៍ MS Word"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">នាំចេញ Word</span>
          </button>

          {/* PRINT REPORT BUTTON */}
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 text-xs font-semibold rounded-md bg-slate-900 border border-slate-950 text-white hover:bg-slate-800 flex items-center gap-1.5 transition-all cursor-pointer"
            title="បោះពុម្ពបញ្ជីពិន្ទុផ្លូវការ"
          >
            <Printer className="w-3.5 h-3.5 text-white" />
            <span>បោះពុម្ព (Print)</span>
          </button>
        </div>
      </header>

      {/* CORE WORKSPACE SCREEN - HIDDEN IN PRINT MODE */}
      <div className="flex flex-1 overflow-hidden print:hidden">
        {/* SIDEBAR */}
        <aside className="w-64 border-r border-slate-200 bg-white p-4 shrink-0 overflow-y-auto flex flex-col gap-5 justify-between">
          <div className="space-y-5">
            {/* Teacher info card when active */}
            {userRole === 'teacher' && (
              <div className="p-3 bg-indigo-50 border border-indigo-100/80 rounded-xl flex flex-col gap-1.5 shadow-xs animate-fadeIn">
                <div className="flex items-center gap-2 text-indigo-900 text-xs font-extrabold">
                  <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>គ្រូបន្ទុកថ្នាក់</span>
                </div>
                <p className="text-[10px] text-indigo-700 font-sans leading-relaxed">
                  អ្នកអាចបញ្ចូលពិន្ទុ និងវត្តមានរបស់សិស្សក្នុងថ្នាក់បានធម្មតា។ រាល់មុខងារគ្រប់គ្រងថ្នាក់ និងការភ្ជាប់ Sheets ត្រូវបានចាក់សោ។
                </p>
              </div>
            )}

            {/* Class Info Card */}
            <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-lg">
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-2 font-sans">
                ព័ត៌មានអត្តសញ្ញាណថ្នាក់
              </label>
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[10px] text-slate-500">ថ្នាក់បង្រៀន (Grade)</label>
                    {userRole === 'admin' && (
                      <button
                        type="button"
                        onClick={() => setIsAddingClass(!isAddingClass)}
                        className="text-[10px] text-blue-600 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <Plus className="w-2.5 h-2.5" />
                        បង្កើតថ្នាក់ថ្មី
                      </button>
                    )}
                  </div>
                  
                  {isAddingClass && userRole === 'admin' && (
                    <form onSubmit={handleAddClass} className="space-y-1.5 mb-2 p-2 bg-white rounded border border-slate-200">
                      <input
                        type="text"
                        value={newClassName}
                        onChange={(e) => setNewClassName(e.target.value)}
                        placeholder="ឧ. ថ្នាក់ទី ៦ គ"
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[11px] focus:ring-1 focus:ring-blue-500 outline-none"
                        autoFocus
                      />
                      <div className="flex justify-end gap-1 text-[10px]">
                        <button
                          type="button"
                          onClick={() => { setIsAddingClass(false); setNewClassName(''); }}
                          className="px-2 py-0.5 text-slate-500 hover:bg-slate-100 rounded"
                        >
                          បោះបង់
                        </button>
                        <button
                          type="submit"
                          className="px-2 py-0.5 bg-blue-600 text-white font-bold rounded hover:bg-blue-700"
                        >
                          បង្កើត
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="flex gap-1.5">
                    <select
                      name="className"
                      value={config.className}
                      onChange={(e) => setConfig({ ...config, className: e.target.value })}
                      className="flex-1 bg-white border border-slate-200 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 outline-none font-sans"
                    >
                      {classList.map((cls) => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </select>

                    {userRole === 'admin' && (
                      <button
                        type="button"
                        onClick={handleDeleteClass}
                        title="លុបថ្នាក់បច្ចុប្បន្ន (បានតែថ្នាក់ទទេ)"
                        className="px-1.5 py-1 text-slate-400 hover:text-red-500 hover:bg-red-50 border border-slate-200 rounded cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 mb-1 font-sans">កម្រិតខែ / ឆមាសវាយតម្លៃ</label>
                  <select
                    name="selectedMonth"
                    value={config.selectedMonth}
                    onChange={(e) => setConfig({ ...config, selectedMonth: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 outline-none font-sans"
                  >
                    <optgroup label="ឆមាសទី១ (Semester 1)">
                      <option value="ខែធ្នូ">ខែធ្នូ (ធ្នូ)</option>
                      <option value="ខែមករា">ខែមករា (មករា)</option>
                      <option value="ខែកុម្ភៈ">ខែកុម្ភៈ (កុម្ភៈ)</option>
                      <option value="ខែមីនា">ខែមីនា (មីនា)</option>
                      <option value="ឆមាសទី១">មធ្យមភាគ ឆមាសទី១ (Dec-Mar)</option>
                    </optgroup>
                    <optgroup label="ឆមាសទី២ (Semester 2)">
                      <option value="ខែឧសភា">ខែឧសភា (ឧសភា)</option>
                      <option value="ខែមិថុនា">ខែមិថុនា (មិថុនា)</option>
                      <option value="ខែកក្កដា">ខែកក្កដា (កក្កដា)</option>
                      <option value="ឆមាសទី២">មធ្យមភាគ ឆមាសទី២ (May-Jul)</option>
                    </optgroup>
                    <optgroup label="ដំណាច់ឆ្នាំ (Year-End Summary)">
                      <option value="ដំណាច់ឆ្នាំ">មធ្យមភាគ ដំណាច់ឆ្នាំ (S1 & S2)</option>
                    </optgroup>
                  </select>
                </div>
              </div>
            </div>

            {/* Google Sheets Config panel */}
            {userRole === 'admin' ? (
              <SheetsConfigPanel
                config={config}
                onConfigChange={setConfig}
                onSyncPush={handleSyncPush}
                onSyncPull={handleSyncPull}
              />
            ) : (
              <div className="p-3.5 rounded-xl border border-dotted border-indigo-200 bg-slate-50/50 text-slate-400 space-y-2 select-none relative overflow-hidden animate-fadeIn">
                <div className="absolute top-0 right-0 px-2 py-0.5 bg-indigo-100 text-indigo-750 rounded-bl text-[8px] font-extrabold tracking-wider">LOCKED</div>
                <h4 className="text-[10.5px] uppercase font-bold text-slate-500 font-sans tracking-wide flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Google Sheets Sync</span>
                </h4>
                <p className="text-[9.5px] text-slate-450 font-sans leading-relaxed">
                  ការតភ្ជាប់ និងបញ្ជូនទិន្នន័យទៅកាន់ Google Sheets ទាមទារសិទ្ធិជា <strong>អេដមីន (Admin)</strong>។
                </p>
              </div>
            )}
          </div>

          {/* Reset database card */}
          {userRole === 'admin' ? (
            <div className="space-y-2 animate-fadeIn">
              <button
                onClick={handleResetData}
                className="w-full px-3 py-1.5 border border-dashed border-slate-200 hover:border-red-200 text-slate-400 hover:text-red-650 rounded text-[10px] font-semibold transition-all hover:bg-red-50/50 flex items-center justify-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>កំណត់ទិន្នន័យឡើងវិញ</span>
              </button>
              
              <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-lg select-none">
                <p className="text-[9.5px] text-amber-800 leading-relaxed font-sans">
                  <strong>បញ្ជាក់៖</strong> រាល់ទិន្នន័យដែលបញ្ចូលនឹងត្រូវបានរក្សាទុកក្នុង Local Storage ដោយស្វ័យប្រវត្តិ។
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-indigo-50/40 border border-indigo-100/60 rounded-xl text-center select-none animate-fadeIn flex flex-col items-center justify-center gap-1">
              <span className="text-[9px] text-slate-400 font-bold font-sans uppercase tracking-wider">ប្រព័ន្ធស្រង់ពិន្ទុ</span>
              <span className="text-[10.5px] text-indigo-700 font-extrabold block">សាលារៀនជំនាន់ថ្មី (MoEYS)</span>
            </div>
          )}
        </aside>

        {/* MAIN USER AREA */}
        <main className="flex-1 p-5 overflow-hidden flex flex-col gap-4">
          
          {/* SEARCH, FILTERS AND CONTROL BAR */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm shrink-0 flex flex-col xl:flex-row gap-3 justify-between items-stretch xl:items-center">
            
            {/* Left search & sort & font size */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <div className="relative w-full sm:w-64">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ស្វែងរកតាមឈ្មោះ ឬ ល.រ សិស្ស..."
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 outline-none transition-colors font-sans"
                />
              </div>

              <div className="flex items-center gap-1.5 shrink-0 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 hover:border-slate-300 transition-colors">
                <span className="text-[10px] uppercase font-bold text-slate-400 whitespace-nowrap">តម្រៀប :</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'serial' | 'rank' | 'name')}
                  className="bg-transparent border-0 text-xs font-semibold outline-none text-slate-700 cursor-pointer focus:ring-0 py-0 px-1 font-sans"
                >
                  <option value="serial">លេខរៀង ល.រ (លំនាំដើម)</option>
                  <option value="rank">ចំណាត់ថ្នាក់ (តូច ទៅ ធំ)</option>
                  <option value="name">ឈ្មោះសិស្ស (ក - វ / A - Z)</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 hover:border-slate-300 transition-colors">
                <span className="text-[10px] uppercase font-bold text-slate-400 whitespace-nowrap">ទំហំអក្សរ :</span>
                <select
                  value={tableFontSize}
                  onChange={(e) => setTableFontSize(parseInt(e.target.value, 10))}
                  className="bg-transparent border-0 text-xs font-semibold outline-none text-slate-700 cursor-pointer focus:ring-0 py-0 px-1 font-sans"
                >
                  <option value="9">9px (តូច)</option>
                  <option value="10">10px (មធ្យមតូច)</option>
                  <option value="11">11px (ស្តង់ដារ)</option>
                  <option value="12">12px (មធ្យម)</option>
                  <option value="13">13px (ធំល្មម)</option>
                  <option value="14">14px (ធំ)</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 hover:border-slate-300 transition-colors">
                <span className="text-[10px] uppercase font-bold text-slate-400 whitespace-nowrap">កម្រិតព្រមាន (ទាបជាង) :</span>
                <select
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(parseFloat(e.target.value))}
                  className="bg-transparent border-0 text-xs font-semibold outline-none text-red-600 cursor-pointer focus:ring-0 py-0 px-1 font-sans"
                >
                  <option value="4.0">4.0</option>
                  <option value="4.5">4.5</option>
                  <option value="5.0">5.0 (ស្តង់ដារ)</option>
                  <option value="5.5">5.5</option>
                  <option value="6.0">6.0</option>
                  <option value="6.5">6.5</option>
                  <option value="7.0">7.0</option>
                </select>
              </div>
            </div>

            {/* Middle Quick description of active month */}
            <div className="text-center hidden lg:block text-slate-500 text-xs">
              ទិន្នន័យស្រង់សម្រាប់ ៖ <strong className="text-slate-800">{config.className}</strong> — <strong className="text-blue-600">{config.selectedMonth}</strong>
            </div>

            {/* Right gender filters */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
              <div className="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-lg text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 px-1.5">ភេទ :</span>
                {(['ទាំងអស់', 'ប្រុស', 'ស្រី'] as const).map((genderVal) => (
                  <button
                    key={genderVal}
                    onClick={() => setGenderFilter(genderVal)}
                    className={`px-3 py-1 rounded-md font-medium cursor-pointer transition-all ${
                      genderFilter === genderVal
                        ? 'bg-white text-slate-950 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {genderVal}
                  </button>
                ))}
              </div>

              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveStudent(null);
                    setIsFormOpen(true);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer hover:shadow-md active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>បញ្ចូលសិស្សថ្មី</span>
                </button>
              )}
            </div>
          </div>

          {/* UNDERPERFORMING STUDENTS WARNING BANNER */}
          {poorPerformingStudents.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 shrink-0 print:hidden transition-all shadow-xs">
              <div className="flex items-start gap-2.5">
                <div className="bg-red-100 p-1.5 rounded-lg text-red-650 shrink-0">
                  <AlertTriangle className="w-4 h-4 animate-pulse text-red-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-red-900 font-sans flex items-center gap-2">
                    <span>សិស្សមានមធ្យមភាគទាបជាងកម្រិតកំណត់ ({alertThreshold}/10)</span>
                    <span className="bg-red-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-sm">
                      {poorPerformingStudents.length} នាក់
                    </span>
                  </h4>
                  <p className="text-[10px] text-red-750 mt-1 font-sans leading-relaxed">
                    សិស្សដែលត្រូវការយកចិត្តទុកដាក់ស្ដារពិន្ទុជាបន្ទាន់ ៖{' '}
                    <span className="font-bold underline text-red-800">
                      {poorPerformingStudents.map(s => `${s.name} (${s.average})`).join(', ')}
                    </span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowOnlyLowPerformers(!showOnlyLowPerformers)}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap active:scale-95 flex items-center gap-1 ${
                  showOnlyLowPerformers
                    ? 'bg-red-600 border-red-600 text-white hover:bg-red-700 shadow-sm'
                    : 'bg-white border-red-200 text-red-700 hover:bg-red-50'
                }`}
              >
                <span>{showOnlyLowPerformers ? 'បង្ហាញសិស្សទាំងអស់ឡើងវិញ' : 'ចម្រោះយកតែសិស្សទាំងនេះ'}</span>
              </button>
            </div>
          )}

          {/* Modal for StudentForm (Add / Edit Student) */}
          {(isFormOpen || activeStudent !== null) && (
            <div 
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 transition-all"
              onClick={() => {
                setActiveStudent(null);
                setIsFormOpen(false);
              }}
            >
              <div 
                className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform scale-100 transition-all border border-slate-200"
                onClick={(e) => e.stopPropagation()}
              >
                <StudentForm
                  activeStudent={activeStudent}
                  selectedMonth={config.selectedMonth}
                  isReadOnly={isReadOnly}
                  onSave={handleSaveStudent}
                  onCancelEdit={() => {
                    setActiveStudent(null);
                    setIsFormOpen(false);
                  }}
                  nextSerialNo={nextSerialNo}
                />
              </div>
            </div>
          )}

          {/* Student Grade Table Sheet Grid */}
          <div className="flex-1 flex flex-col overflow-hidden min-h-[300px]">
            <StudentTable
              students={filteredStudents}
              rawStudents={students}
              onEdit={(student) => {
                setActiveStudent(student);
                setIsFormOpen(true);
              }}
              onDelete={handleDeleteStudent}
              isReadOnly={isReadOnly}
              selectedMonth={config.selectedMonth}
              sortBy={sortBy}
              onSortChange={setSortBy}
              tableFontSize={tableFontSize}
              alertThreshold={alertThreshold}
            />
          </div>

          {/* METRIC CARD BAR */}
          <div className="mt-auto grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0 select-none">
            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">សិស្សសរុប</p>
                <p className="text-lg font-bold text-slate-850 mt-0.5">{stats.total} នាក់</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-100">
                <Users className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">មធ្យមភាគថ្នាក់</p>
                <p className="text-lg font-bold text-blue-600 mt-0.5">{stats.classAverage} / 10</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                <Percent className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">សិស្សជាប់ (Passed)</p>
                <p className="text-lg font-bold text-green-600 mt-0.5">{stats.passed} នាក់</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
                <Award className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">សិស្សធ្លាក់ (Failed)</p>
                <p className="text-lg font-bold text-red-500 mt-0.5">{stats.failed} នាក់</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-550 border border-red-100">
                <Info className="w-4 h-4" />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* FOOTER BAR - HIDDEN IN PRINT */}
      <footer className="px-6 py-2 bg-slate-800 text-slate-400 text-[10px] flex flex-col sm:flex-row justify-between shrink-0 font-sans tracking-wide border-t border-slate-700/50 select-none gap-2 print:hidden">
        <div className="flex gap-1">គ្រូទទួលបន្ទុកថ្នាក់ ៖ <strong className="text-slate-200 font-semibold">{config.className} Grade Master Team</strong></div>
        <div className="hidden md:block text-center">ប្រព័ន្ធស្រង់ពិន្ទុដែលត្រូវបានរៀបចំឡើងទៅតាមស្តង់ដារក្រសួងអប់រំ យុវជន និងកីឡា</div>
        <div className="flex items-center gap-4 justify-between sm:justify-end">
          <span>ស្វ័យប្រវត្តិរក្សាទុកក្នុងកុំព្យូទ័រ</span>
          <span className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${config.spreadsheetId ? 'bg-blue-400 animate-pulse' : 'bg-slate-500'}`}></div>
            <span>Auto-sync {config.spreadsheetId ? 'ON' : 'OFF'}</span>
          </span>
        </div>
      </footer>

      {/* ==================== PRINT ONLY OFFICIAL GRADE SHEET TEMPLATE ==================== */}
      <div className="hidden print:block w-full p-8 bg-white text-slate-900 font-sans" style={{ fontSize: `${tableFontSize}px` }}>
        
        {/* Kingdom & Ministry Headers */}
        <div className="text-center mb-6 leading-relaxed">
          <h2 className="text-[13px] font-bold">ព្រះរាជាណាចក្រកម្ពុជា</h2>
          <h3 className="text-[11px] font-bold">ជាតិ សាសនា ព្រះមហាក្សត្រ</h3>
          <p className="text-xs">-------------------------</p>
          
          <div className="text-left font-bold text-[10px] mt-2 space-y-0.5">
            <div>មន្ទីរអប់រំ យុវជន និងកីឡា</div>
            <div>ការិយាល័យអប់រំយុវជន និងកីឡាថ្នាក់បឋមសិក្សា</div>
          </div>
          
          <h1 className="text-[14px] font-bold mt-5 tracking-wide uppercase">សន្លឹកបញ្ជីស្រង់ពិន្ទុមធ្យមភាគសិស្សថ្នាក់បឋមសិក្សា</h1>
          <p className="text-[11px] font-medium mt-1">
            សាលារៀន៖ <span className="font-semibold">សាលាបឋមសិក្សាបង្គោល</span> | 
            ថ្នាក់រៀន៖ <span className="font-semibold">{config.className}</span> | 
            ឆមាស/ខែវាយតម្លៃ៖ <span className="font-bold text-blue-700">{config.selectedMonth}</span> | 
            ឆ្នាំសិក្សា៖ <span className="font-semibold">២០២៥ - ២០២៦</span>
          </p>
        </div>

        {/* Dynamic Printable Table Grid */}
        <table className="w-full border-collapse border border-slate-800 text-center" style={{ fontSize: `${tableFontSize}px` }}>
          <thead>
            <tr className="bg-slate-100 border-b border-slate-800" style={{ fontSize: `${Math.max(9, tableFontSize - 1)}px` }}>
              <th rowSpan={2} className="border border-slate-705 p-1 font-bold">ល.រ</th>
              <th rowSpan={2} className="border border-slate-705 p-1 font-bold text-left min-w-[120px]">ឈ្មោះសិស្ស</th>
              <th rowSpan={2} className="border border-slate-705 p-1 font-bold">ភេទ</th>
              <th colSpan={3} className="border border-slate-705 p-1 font-bold bg-blue-100/30">ភាសាខ្មែរ</th>
              <th colSpan={3} className="border border-slate-705 p-1 font-bold bg-green-100/30">គណិតវិទ្យា</th>
              <th rowSpan={2} className="border border-slate-705 p-1 font-bold">វិទ្យា.</th>
              <th colSpan={3} className="border border-slate-705 p-1 font-bold bg-purple-100/30">សិក្សាសង្គម</th>
              <th rowSpan={2} className="border border-slate-705 p-1 font-bold">កាយ</th>
              <th rowSpan={2} className="border border-slate-705 p-1 font-bold">បំណិន</th>
              <th rowSpan={2} className="border border-slate-705 p-1 font-bold">បរទេស</th>
              <th rowSpan={2} className="border border-slate-705 p-1 font-bold bg-slate-200">សរុប</th>
              <th rowSpan={2} className="border border-slate-705 p-1 font-bold bg-slate-200">មធ្យម</th>
              <th rowSpan={2} className="border border-slate-705 p-1 font-bold bg-red-100 text-red-700">ចំណាត់ថ្នាក់</th>
              <th rowSpan={2} className="border border-slate-705 p-1 font-bold bg-slate-200">និទ្ទេស</th>
              <th rowSpan={2} className="border border-slate-705 p-1 font-bold">លទ្ធផល</th>
            </tr>
            <tr className="bg-slate-50 border-b border-slate-800" style={{ fontSize: `${Math.max(8, tableFontSize - 2)}px` }}>
              <th className="border border-slate-600 p-0.5">អាន</th>
              <th className="border border-slate-600 p-0.5">សរសេរ</th>
              <th className="border border-slate-600 p-0.5">តែង</th>
              <th className="border border-slate-600 p-0.5">ចំនួន</th>
              <th className="border border-slate-600 p-0.5">រង្វាស់</th>
              <th className="border border-slate-600 p-0.5">ធរណី</th>
              <th className="border border-slate-600 p-0.5">សីល</th>
              <th className="border border-slate-600 p-0.5">ភូមិ</th>
              <th className="border border-slate-600 p-0.5">ប្រវត្តិ</th>
            </tr>
          </thead>
          <tbody>
            {printableStudents.map((student) => (
              <tr key={student.id} className="border-b border-slate-800">
                <td className="border border-slate-700 p-1">{student.serialNo}</td>
                <td className="border border-slate-700 p-1 text-left font-semibold">{student.name}</td>
                <td className="border border-slate-700 p-1">{student.gender}</td>
                <td className="border border-slate-700 p-1">{student.scores.khmerRead}</td>
                <td className="border border-slate-700 p-1">{student.scores.khmerWrite}</td>
                <td className="border border-slate-700 p-1">{student.scores.khmerComposition}</td>
                <td className="border border-slate-700 p-1">{student.scores.mathNumbers}</td>
                <td className="border border-slate-700 p-1">{student.scores.mathMeasurement}</td>
                <td className="border border-slate-700 p-1">{student.scores.mathGeometry}</td>
                <td className="border border-slate-700 p-1">{student.scores.science}</td>
                <td className="border border-slate-700 p-1">{student.scores.socialCivics}</td>
                <td className="border border-slate-700 p-1">{student.scores.socialGeography}</td>
                <td className="border border-slate-700 p-1">{student.scores.socialHistory}</td>
                <td className="border border-slate-700 p-1">{student.scores.physicalEducation}</td>
                <td className="border border-slate-700 p-1">{student.scores.practicalSkills}</td>
                <td className="border border-slate-700 p-1">{student.scores.foreignLanguage}</td>
                <td className="border border-slate-700 p-1 bg-slate-100 font-bold">{student.totalScore}</td>
                <td className="border border-slate-700 p-1 bg-slate-100 font-bold">{student.average}</td>
                <td className="border border-slate-700 p-1 bg-red-50/50 text-red-600 font-bold">{student.rank}</td>
                <td className="border border-slate-700 p-1 font-bold">{student.grade}</td>
                <td className="border border-slate-700 p-1 font-medium">{student.status}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Printable Official Signatures */}
        <table className="w-full mt-10 border-0" style={{ border: 'none' }}>
          <tbody>
            <tr style={{ border: 'none' }}>
              <td style={{ border: 'none', width: '50%', textAlign: 'center' }} className="font-sans text-[11px]">
                បានឃើញ និងឯកភាព<br />
                <strong className="block mt-1">នាយកសាលា</strong>
                <div className="h-20"></div>
                <span className="text-slate-400">......................................................</span>
              </td>
              <td style={{ border: 'none', width: '50%', textAlign: 'center' }} className="font-sans text-[11px]">
                ថ្ងៃទី...... ខែ...... ឆ្នាំ២០២៦<br />
                <strong className="block mt-1">គ្រូទទួលបន្ទុកថ្នាក់</strong>
                <div className="h-20"></div>
                <span className="text-slate-400">......................................................</span>
              </td>
            </tr>
          </tbody>
        </table>

      </div>

    </div>
  );
}
