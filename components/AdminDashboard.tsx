
import React, { useState, useMemo, useRef } from 'react';
import { Alumnus, FormData, Question } from '../types';
import { AlumniProfilePage } from './AlumniProfilePage';
import { QuestionManager } from './QuestionManager';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, Radar, Sector, PolarRadiusAxis
} from 'recharts';
import { sheetApi } from '../services/sheetApi';

interface AdminDashboardProps {
  alumniList: Alumnus[];
  submissions: { [nim: string]: FormData };
  analyticsData: any | null;
  onImportAlumni: (newAlumni: Alumnus[]) => Promise<void>;
  onBulkStatusUpdate: (nimsToUpdate: string[], newStatus: boolean) => void;
  onFetchDetail: (nim: string) => Promise<FormData | null>;
}

// Modern vibrant palette
const COLORS = [
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#ef4444', // Red
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#84cc16'  // Lime
];

// Enhanced Tooltip for Bar Charts
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-md p-3 border border-slate-100 rounded-xl shadow-xl ring-1 ring-black/5">
        <p className="font-bold text-slate-800 text-xs mb-1 border-b border-slate-200 pb-1">{label}</p>
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{backgroundColor: payload[0].fill}}></div>
            <p className="text-xl font-bold text-slate-800">
                {payload[0].value} <span className="text-[10px] font-normal text-slate-500 uppercase">Alumni</span>
            </p>
        </div>
      </div>
    );
  }
  return null;
};

// Enhanced Active Shape for Pie Charts (Shows Percentage in Center)
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;

  return (
    <g>
      <text x={cx} y={cy} dy={-15} textAnchor="middle" fill="#64748b" className="text-[10px] font-bold uppercase tracking-wider">
        {payload.name.length > 12 ? `${payload.name.substring(0, 12)}...` : payload.name}
      </text>
      <text x={cx} y={cy} dy={10} textAnchor="middle" fill={fill} className="text-2xl font-black">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 4}
        outerRadius={outerRadius + 8}
        fill={fill}
      />
    </g>
  );
};

const ChartCard: React.FC<{title: string, data: {name: string, value: number}[], type: 'pie' | 'bar'}> = ({ title, data, type }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const onPieEnter = (_: any, index: number) => {
        setActiveIndex(index);
    };

    if (!data || data.length === 0) {
        return (
            <div className="glass-panel rounded-2xl p-6 min-h-[300px] flex flex-col justify-center items-center">
                <h4 className="font-bold text-slate-700 text-sm mb-4 text-center">{title}</h4>
                <div className="flex flex-col items-center justify-center text-slate-400 text-sm gap-2">
                    <i className="fas fa-chart-pie text-4xl opacity-20"></i>
                    <span>Belum ada data</span>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-panel rounded-2xl p-5 shadow-sm hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 flex flex-col h-full border border-white/60">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100/50">
                <h4 className="font-bold text-slate-700 text-sm leading-tight">{title}</h4>
                <div className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-1 rounded-full">
                    N: {data.reduce((a, b) => a + b.value, 0)}
                </div>
            </div>
            
            <div className="flex-grow min-h-[250px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    {type === 'pie' ? (
                        <PieChart>
                            <Pie 
                              data={data} 
                              dataKey="value" 
                              nameKey="name" 
                              cx="50%" 
                              cy="50%" 
                              innerRadius={60} 
                              outerRadius={80} 
                              paddingAngle={4}
                              {...{ activeIndex } as any}
                              activeShape={renderActiveShape}
                              onMouseEnter={onPieEnter}
                              animationDuration={1000}
                              animationBegin={0}
                              stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend 
                                layout="horizontal" 
                                verticalAlign="bottom" 
                                align="center"
                                iconType="circle"
                                wrapperStyle={{ fontSize: '10px', paddingTop: '10px', opacity: 0.8 }}
                            />
                        </PieChart>
                    ) : (
                        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                            <XAxis type="number" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis 
                                type="category" 
                                dataKey="name" 
                                width={90} 
                                tick={{ fontSize: 10, fill: '#64748b', fontWeight: 500 }} 
                                stroke="#cbd5e1"
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip content={<CustomBarTooltip />} cursor={{fill: 'rgba(99, 102, 241, 0.05)', radius: 4}}/>
                            <Bar 
                                dataKey="value" 
                                radius={[0, 4, 4, 0]} 
                                barSize={20}
                                animationDuration={1000}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const CollapsibleSection: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="glass-panel rounded-3xl overflow-hidden mb-8 shadow-md">
            <button
                className="w-full flex justify-between items-center p-5 bg-white/40 hover:bg-white/60 transition-all duration-300 border-b border-white/20"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg shadow-md transition-colors ${isOpen ? 'bg-indigo-600' : 'bg-slate-400'}`}>
                        <i className={`fas ${isOpen ? 'fa-chart-pie' : 'fa-folder'}`}></i>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 text-left">{title}</h3>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 bg-white/50 ${isOpen ? 'rotate-180 text-indigo-600' : 'text-slate-500'}`}>
                    <i className="fas fa-chevron-down text-sm"></i>
                </div>
            </button>
            {isOpen && (
                <div className="p-6 bg-white/20 animate-fade-in">
                    {children}
                </div>
            )}
        </div>
    )
}

const DashboardConclusion: React.FC<{ alumniList: Alumnus[], submissions: { [nim: string]: FormData }, chartData: any | null }> = ({ alumniList, submissions, chartData }) => {
    const allSubmissions = useMemo(() => Object.values(submissions), [submissions]);
    
    const totalAlumni = alumniList.length;
    const totalSubmissions = allSubmissions.length;
    const submissionRate = totalAlumni > 0 ? (totalSubmissions / totalAlumni * 100) : 0;
    
    const bekerjaCount = allSubmissions.filter(s => s.pekerjaan_status === 'Ya').length;
    const employabilityRate = totalSubmissions > 0 ? (bekerjaCount / totalSubmissions * 100) : 0;

    const sangatSesuaiCount = allSubmissions.filter(s => s.pekerjaan_kesesuaianBidangStudi === 'Sangat Sesuai').length;
    const jobSuitabilityRate = bekerjaCount > 0 ? (sangatSesuaiCount / bekerjaCount * 100) : 0;

    const satisfactionData = useMemo(() => {
        const ratings: { [key: string]: number[] } = {
            'Pembelajaran': [],
            'Kurikulum': [],
            'Pelayanan': [],
            'Soft Skill': [],
        };

        const scoreMap: Record<string, number> = {
            'Sangat Baik': 5, 'Baik': 4, 'Cukup': 3, 'Kurang': 2, 'Sangat Kurang': 1,
            'Sangat Relevan': 5, 'Relevan': 4, 'Cukup Relevan': 3, 'Tidak Relevan': 2,
            'Sangat Setuju': 5, 'Setuju': 4, 'Kurang Setuju': 3, 'Tidak Setuju': 2,
        };

        allSubmissions.forEach(s => {
            if (scoreMap[s.pendidikan_kualitasPembelajaran]) ratings['Pembelajaran'].push(scoreMap[s.pendidikan_kualitasPembelajaran]);
            if (scoreMap[s.pendidikan_relevansiKurikulum]) ratings['Kurikulum'].push(scoreMap[s.pendidikan_relevansiKurikulum]);
            if (scoreMap[s.pendidikan_pelayananDosen]) ratings['Pelayanan'].push(scoreMap[s.pendidikan_pelayananDosen]);
            if (scoreMap[s.pendidikan_pengembanganSoftSkill]) ratings['Soft Skill'].push(scoreMap[s.pendidikan_pengembanganSoftSkill]);
        });
        
        return Object.entries(ratings).map(([subject, scores]) => ({
            subject,
            A: scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0,
            fullMark: 5,
        }));
    }, [allSubmissions]);


    return (
        <div className="space-y-8 mb-10">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative overflow-hidden rounded-3xl p-6 bg-white shadow-xl border border-slate-100 group hover:-translate-y-1 transition-transform duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full z-0 transition-all group-hover:bg-indigo-100"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                <i className="fas fa-users"></i>
                            </div>
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Partisipasi</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                             <h3 className="text-4xl font-black text-slate-800">{submissionRate.toFixed(0)}<span className="text-xl text-slate-400">%</span></h3>
                        </div>
                        <p className="text-slate-500 text-sm mt-1">{totalSubmissions} dari {totalAlumni} Responden</p>
                        <div className="w-full bg-slate-100 h-1.5 mt-4 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full rounded-full" style={{width: `${submissionRate}%`}}></div>
                        </div>
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-3xl p-6 bg-white shadow-xl border border-slate-100 group hover:-translate-y-1 transition-transform duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full z-0 transition-all group-hover:bg-emerald-100"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                <i className="fas fa-briefcase"></i>
                            </div>
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Keterserapan</span>
                        </div>
                         <div className="flex items-baseline gap-2">
                             <h3 className="text-4xl font-black text-slate-800">{employabilityRate.toFixed(0)}<span className="text-xl text-slate-400">%</span></h3>
                        </div>
                        <p className="text-slate-500 text-sm mt-1">Alumni Sudah Bekerja</p>
                        <div className="w-full bg-slate-100 h-1.5 mt-4 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{width: `${employabilityRate}%`}}></div>
                        </div>
                    </div>
                </div>

                 <div className="relative overflow-hidden rounded-3xl p-6 bg-white shadow-xl border border-slate-100 group hover:-translate-y-1 transition-transform duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full z-0 transition-all group-hover:bg-blue-100"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                                <i className="fas fa-star"></i>
                            </div>
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Relevansi</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                             <h3 className="text-4xl font-black text-slate-800">{jobSuitabilityRate.toFixed(0)}<span className="text-xl text-slate-400">%</span></h3>
                        </div>
                        <p className="text-slate-500 text-sm mt-1">Sangat Sesuai Bidang</p>
                         <div className="w-full bg-slate-100 h-1.5 mt-4 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full rounded-full" style={{width: `${jobSuitabilityRate}%`}}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Satisfaction Radar Chart */}
            <div className="glass-panel p-6 md:p-8 rounded-3xl shadow-xl border border-white/60">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                     <div className="flex-1 w-full">
                         <h4 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">Kepuasan Alumni</h4>
                         <p className="text-slate-500 mb-6 text-sm leading-relaxed">
                            Pemetaan skor rata-rata (1-5) terhadap aspek akademik utama.
                         </p>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {satisfactionData.map((item, idx) => (
                                <div key={idx} className="bg-white/50 rounded-xl p-3 border border-white/50">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-xs font-bold text-slate-500 uppercase">{item.subject}</span>
                                        <span className="text-lg font-black text-indigo-600">{item.A.toFixed(1)}</span>
                                    </div>
                                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full" style={{width: `${(item.A/5)*100}%`}}></div>
                                    </div>
                                </div>
                            ))}
                         </div>
                     </div>
                     <div className="flex-1 w-full h-[300px]">
                         <ResponsiveContainer width="100%" height="100%">
                             <RadarChart cx="50%" cy="50%" outerRadius="70%" data={satisfactionData}>
                                <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                                <PolarAngleAxis dataKey="subject" tick={{fontSize: 11, fill: '#64748b', fontWeight: 600}} />
                                <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                                <Radar 
                                    name="Skor" 
                                    dataKey="A" 
                                    stroke="#8b5cf6" 
                                    strokeWidth={3}
                                    fill="#a78bfa" 
                                    fillOpacity={0.3} 
                                    isAnimationActive={true}
                                />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontSize: '12px' }}
                                />
                             </RadarChart>
                        </ResponsiveContainer>
                     </div>
                </div>
            </div>
        </div>
    );
};


const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode; title: string }> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[60] flex justify-center items-center p-4 transition-opacity duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-white/50 animate-fade-in-up">
        <div className="flex justify-between items-center p-5 border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur-md z-10">
          <h3 className="text-xl font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ alumniList, submissions, analyticsData, onImportAlumni, onBulkStatusUpdate, onFetchDetail }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'data' | 'questions'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'submitted' | 'pending'>('all');
  const [programFilter, setProgramFilter] = useState('all');
  const [selectedAlumni, setSelectedAlumni] = useState<string[]>([]);
  const [viewingAlumnus, setViewingAlumnus] = useState<Alumnus | null>(null);
  const [viewingSubmission, setViewingSubmission] = useState<FormData | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch questions on mount or tab change
  React.useEffect(() => {
     const fetchQ = async () => {
         try {
             const res = await sheetApi.getQuestions();
             if(res.success && res.data) {
                 setCustomQuestions(res.data);
             }
         } catch(e) {
             console.error("Failed to load questions", e);
         }
     }
     fetchQ();
  }, []);

  const handleSaveQuestion = async (q: Question) => {
      const res = await sheetApi.saveQuestion(q);
      if(res.success) {
          // Refresh list
          const updated = await sheetApi.getQuestions();
          if(updated.success && updated.data) setCustomQuestions(updated.data);
          alert('Soal berhasil disimpan!');
      } else {
          alert('Gagal menyimpan soal.');
      }
  }

  const handleDeleteQuestion = async (id: string) => {
      const res = await sheetApi.deleteQuestion(id);
      if(res.success) {
           const updated = await sheetApi.getQuestions();
           if(updated.success && updated.data) setCustomQuestions(updated.data);
      }
  }


  const programs = useMemo(() => ['all', ...Array.from(new Set(Object.values(submissions).map((s: FormData) => s.identitas_programStudi).filter(Boolean)))], [submissions]);
  const chartData = analyticsData;

  const filteredAlumni = useMemo(() => {
    return alumniList.filter(alumnus => {
      const submission = submissions[alumnus.nim];
      
      const matchesSearch = alumnus.name.toLowerCase().includes(searchTerm.toLowerCase()) || alumnus.nim.includes(searchTerm);
      
      const matchesStatusFilter = statusFilter === 'all' ||
        (statusFilter === 'submitted' && alumnus.hasSubmitted) ||
        (statusFilter === 'pending' && !alumnus.hasSubmitted);
        
      const matchesProgramFilter = programFilter === 'all' || (submission && submission.identitas_programStudi === programFilter);

      return matchesSearch && matchesStatusFilter && matchesProgramFilter;
    });
  }, [alumniList, submissions, searchTerm, statusFilter, programFilter]);


  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedAlumni(filteredAlumni.map(a => a.nim));
    } else {
      setSelectedAlumni([]);
    }
  };

  const handleSelectOne = (nim: string) => {
    setSelectedAlumni(prev =>
      prev.includes(nim) ? prev.filter(n => n !== nim) : [...prev, nim]
    );
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleDownloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
        + "NIM,Nama,Angkatan\n"
        + "170101,Budi Santoso,2017\n"
        + "180201,Ahmad Yani,2018";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "template_alumni.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportData = () => {
    if (alumniList.length === 0) {
      alert("Tidak ada data alumni untuk diekspor.");
      return;
    }

    // Dynamic headers based on custom questions
    const dynamicKeys = customQuestions.map(q => q.id);
    const dynamicHeaders = customQuestions.map(q => q.label);

    const headers = [
      "NIM", "Nama Lengkap", "Angkatan", "Status Survey",
      "Program Studi", "Email", "No. HP", "Jenis Kelamin",
      "Kualitas Pembelajaran", "Relevansi Kurikulum", 
      "Status Bekerja", "Instansi", "Posisi", "Pendapatan",
      "Melanjutkan Studi", "Nama Kampus Lanjut",
      ...dynamicHeaders
    ];

    const rows = alumniList.map(alumnus => {
      const sub = submissions[alumnus.nim];
      const escape = (val: string | undefined) => {
        if (!val) return '""';
        return `"${val.replace(/"/g, '""')}"`;
      };

      const baseData = [
        escape(alumnus.nim),
        escape(alumnus.name),
        escape(alumnus.angkatan),
        escape(alumnus.hasSubmitted ? "Sudah" : "Belum"),
        escape(sub?.identitas_programStudi),
        escape(sub?.identitas_email),
        escape(sub?.identitas_noHp),
        escape(sub?.identitas_jenisKelamin),
        escape(sub?.pendidikan_kualitasPembelajaran),
        escape(sub?.pendidikan_relevansiKurikulum),
        escape(sub?.pekerjaan_status),
        escape(sub?.pekerjaan_namaInstansi),
        escape(sub?.pekerjaan_jabatan),
        escape(sub?.pekerjaan_pendapatan),
        escape(sub?.studiLanjut_status),
        escape(sub?.studiLanjut_namaUniversitas)
      ];
      
      const dynamicData = dynamicKeys.map(key => escape(sub?.[key]));

      return [...baseData, ...dynamicData].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute("download", `Data_Tracer_Study_${date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const newAlumni: Alumnus[] = text.split(/\r?\n/)
          .map(line => line.trim())
          .filter(line => line)
          .slice(1) // Skip header row
          .map((line, index) => {
            const parts = line.split(',');
            if (parts.length < 3) {
              console.warn(`Skipping invalid CSV line ${index + 2}: ${line}`);
              return null;
            }
            const nim = parts.shift()?.trim();
            const angkatan = parts.pop()?.trim();
            const name = parts.join(',').trim().replace(/"/g, '');
            
            if (nim && name && angkatan) {
              return { nim, name, angkatan, hasSubmitted: false };
            }
            return null;
          })
          .filter((a): a is Alumnus => a !== null);

        if (newAlumni.length > 0) {
            await onImportAlumni(newAlumni);
        } else {
            alert('Tidak ada data alumni yang valid ditemukan.');
        }
      } catch(error: any) {
        alert(`Terjadi kesalahan: ${error.message}`);
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };
  
  const handleBulkUpdate = (newStatus: boolean) => {
    if (selectedAlumni.length === 0) {
      alert("Please select at least one alumnus.");
      return;
    }
    const statusText = newStatus ? 'Submitted' : 'Pending';
    if (window.confirm(`Mark ${selectedAlumni.length} alumni as '${statusText}'?`)) {
        onBulkStatusUpdate(selectedAlumni, newStatus);
        setSelectedAlumni([]);
    }
  };

  const handleViewProfile = async (nim: string) => {
    const alumnus = alumniList.find(a => a.nim === nim);
    if (alumnus) {
      setViewingAlumnus(alumnus);
      setViewingSubmission(null); 
      setLoadingDetail(true);
      try {
        const detail = await onFetchDetail(nim);
        setViewingSubmission(detail);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingDetail(false);
      }
    }
  };
  
  const handleCloseModal = () => {
      setViewingAlumnus(null);
      setViewingSubmission(null);
  }

  if (!chartData) {
      return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
           <div className="flex flex-col items-center">
             <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
             <p className="text-slate-600 font-semibold animate-pulse">Menyiapkan Dashboard...</p>
           </div>
        </div>
      );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="text-center pt-6 pb-2">
        <h2 className="text-3xl md:text-5xl font-display font-black text-slate-800 tracking-tight">Executive Dashboard</h2>
        <p className="mt-2 text-slate-500 font-medium">Monitoring & Analisis Alumni</p>
      </div>
      
      {/* Navigation Tabs */}
      <div className="flex justify-center mb-6">
          <div className="bg-white/60 backdrop-blur rounded-2xl p-1.5 flex shadow-sm border border-slate-200">
             <button onClick={() => setActiveTab('dashboard')} className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-indigo-600'}`}>Overview</button>
             <button onClick={() => setActiveTab('data')} className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'data' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-indigo-600'}`}>Data Alumni</button>
             <button onClick={() => setActiveTab('questions')} className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'questions' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-indigo-600'}`}>Kelola Soal</button>
          </div>
      </div>
      
      {activeTab === 'questions' && (
          <QuestionManager questions={customQuestions} onSave={handleSaveQuestion} onDelete={handleDeleteQuestion} />
      )}

      {activeTab === 'dashboard' && (
        <div className="animate-fade-in">
            <DashboardConclusion alumniList={alumniList} submissions={submissions} chartData={chartData} />
            
            {/* Visual Analytics Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6 px-2">
                    <div className="w-1.5 h-8 bg-indigo-600 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-slate-800">Visualisasi Data</h2>
                </div>
                
                <CollapsibleSection title="A. Demografi Alumni">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <ChartCard title="Program Studi" data={chartData.programStudi} type="pie" />
                        <ChartCard title="Jenis Kelamin" data={chartData.jenisKelamin} type="pie" />
                        <ChartCard title="Status Pernikahan" data={chartData.statusPernikahan} type="pie" />
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="B. Kualitas Akademik">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ChartCard title="Kualitas Pembelajaran" data={chartData.kualitasPembelajaran} type="bar" />
                        <ChartCard title="Relevansi Kurikulum" data={chartData.relevansiKurikulum} type="bar" />
                        <ChartCard title="Pelayanan Akademik" data={chartData.pelayananDosen} type="bar" />
                        <ChartCard title="Pengembangan Soft Skill" data={chartData.pengembanganSoftSkill} type="bar" />
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="C & D. Karir & Kompetensi">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <ChartCard title="Status Bekerja" data={chartData.statusPekerjaan} type="pie" />
                        <ChartCard title="Waktu Tunggu" data={chartData.waktuTunggu} type="bar" />
                        <ChartCard title="Kesesuaian Bidang" data={chartData.kesesuaianBidangStudi} type="pie" />
                        <ChartCard title="Pekerjaan Pertama" data={chartData.jenisPekerjaanPertama} type="bar" />
                        <ChartCard title="Pendapatan" data={chartData.pendapatan} type="bar" />
                        <ChartCard title="Kontribusi Ilmu" data={chartData.kontribusiIlmu} type="bar" />
                        <ChartCard title="Kompetensi Utama" data={chartData.kompetensiDibutuhkan} type="pie" />
                        <ChartCard title="Pengalaman Praktik" data={chartData.pengalamanPraktik} type="pie" />
                    </div>
                </CollapsibleSection>
                {/* Note: Dynamic questions won't have auto-analytics yet, only raw data export */}
            </div>
        </div>
      )}

      {activeTab === 'data' && (
      <div className="glass-panel p-6 md:p-8 rounded-3xl shadow-xl border border-white/60 animate-fade-in">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div className="w-full lg:w-auto">
                <h3 className="text-2xl font-bold text-slate-800">Database Alumni</h3>
                <p className="text-slate-500 text-sm mt-1">Kelola data, filter, ekspor, dan pantau status.</p>
            </div>
             <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                 <button onClick={handleExportData} className="flex-1 lg:flex-none bg-slate-900 text-white font-bold py-3 px-5 rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-900/20 hover:-translate-y-0.5 transition-all duration-300 text-sm flex justify-center items-center gap-2">
                  <i className="fas fa-file-csv"></i> Export CSV
                </button>
                <div className="hidden lg:block h-8 w-px bg-slate-300 mx-2"></div>
                <button onClick={handleDownloadTemplate} className="flex-1 lg:flex-none bg-white text-slate-700 border border-slate-200 font-bold py-3 px-4 rounded-xl hover:bg-slate-50 transition-all duration-300 text-sm flex justify-center items-center gap-2">
                  <i className="fas fa-download text-slate-400"></i> Template
                </button>
                <input type="file" ref={fileInputRef} onChange={handleImport} accept=".csv" className="hidden" />
                <button onClick={handleImportClick} className="flex-1 lg:flex-none bg-white text-slate-700 border border-slate-200 font-bold py-3 px-4 rounded-xl hover:bg-slate-50 transition-all duration-300 text-sm flex justify-center items-center gap-2">
                  <i className="fas fa-upload text-slate-400"></i> Import
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6 p-4 bg-slate-50/50 rounded-2xl border border-slate-200/60">
          <div className="md:col-span-6 relative group">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-slate-400 group-focus-within:text-indigo-500"></i>
             </div>
             <input type="text" placeholder="Cari nama atau NIM..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-all text-sm"/>
          </div>
          <div className="md:col-span-3">
              <div className="relative">
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="w-full border border-slate-200 rounded-xl py-3 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer text-sm appearance-none">
                      <option value="all">Semua Status</option>
                      <option value="submitted">Sudah Mengisi</option>
                      <option value="pending">Belum Mengisi</option>
                  </select>
                  <i className="fas fa-filter absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none"></i>
              </div>
          </div>
          <div className="md:col-span-3">
               <div className="relative">
                  <select value={programFilter} onChange={(e) => setProgramFilter(e.target.value)} className="w-full border border-slate-200 rounded-xl py-3 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer text-sm appearance-none">
                      {programs.map(p => <option key={p} value={p}>{p === 'all' ? 'Semua Prodi' : p}</option>)}
                  </select>
                  <i className="fas fa-layer-group absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none"></i>
              </div>
          </div>
        </div>
        
        {selectedAlumni.length > 0 && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 animate-scale-in shadow-sm">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md text-sm">
                    {selectedAlumni.length}
                </div>
                <p className="text-sm font-bold text-indigo-900">Alumni terpilih</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <button onClick={() => handleBulkUpdate(true)} className="flex-1 sm:flex-none bg-white text-emerald-600 text-xs font-bold py-2.5 px-4 rounded-lg hover:bg-emerald-50 transition-colors border border-emerald-200 shadow-sm">
                    <i className="fas fa-check mr-1"></i> Selesai
                </button>
                <button onClick={() => handleBulkUpdate(false)} className="flex-1 sm:flex-none bg-white text-amber-600 text-xs font-bold py-2.5 px-4 rounded-lg hover:bg-amber-50 transition-colors border border-amber-200 shadow-sm">
                    <i className="fas fa-clock mr-1"></i> Pending
                </button>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th scope="col" className="p-4 w-12 text-center"><input type="checkbox" onChange={handleSelectAll} checked={selectedAlumni.length > 0 && selectedAlumni.length === filteredAlumni.length && filteredAlumni.length > 0} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" /></th>
                <th scope="col" className="px-6 py-4 font-bold tracking-wider">NIM</th>
                <th scope="col" className="px-6 py-4 font-bold tracking-wider">Nama Lengkap</th>
                <th scope="col" className="px-6 py-4 font-bold tracking-wider whitespace-nowrap">Program Studi</th>
                <th scope="col" className="px-6 py-4 font-bold tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 text-right font-bold tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAlumni.map(alumnus => (
                <tr key={alumnus.nim} className={`transition-colors ${selectedAlumni.includes(alumnus.nim) ? 'bg-indigo-50/60' : 'hover:bg-slate-50/80'}`}>
                  <td className="p-4 text-center"><input type="checkbox" checked={selectedAlumni.includes(alumnus.nim)} onChange={() => handleSelectOne(alumnus.nim)} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" /></td>
                  <td className="px-6 py-4 font-mono text-slate-500 text-xs">{alumnus.nim}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{alumnus.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs">{submissions[alumnus.nim]?.identitas_programStudi || <span className="text-slate-300 italic">Belum diisi</span>}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${alumnus.hasSubmitted ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
                      <div className={`w-1.5 h-1.5 mr-1.5 rounded-full ${alumnus.hasSubmitted ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                      {alumnus.hasSubmitted ? 'Selesai' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                        onClick={() => handleViewProfile(alumnus.nim)} 
                        className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 py-1.5 px-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
                        disabled={!alumnus.hasSubmitted}
                    >
                      Detail <i className="fas fa-chevron-right ml-1"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredAlumni.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                      <div className="flex flex-col items-center justify-center text-slate-300">
                          <i className="fas fa-folder-open text-5xl mb-4 opacity-50"></i>
                          <p className="font-medium text-slate-400">Data tidak ditemukan</p>
                      </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-xs text-slate-400 text-right font-medium">
            Menampilkan {filteredAlumni.length} dari {alumniList.length} total data
        </div>
      </div>
      )}
      
      <Modal isOpen={!!viewingAlumnus} onClose={handleCloseModal} title="Profil Alumni">
        {loadingDetail ? (
             <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-indigo-500 mb-4"></div>
                <p className="text-slate-500 font-medium animate-pulse">Mengambil data...</p>
            </div>
        ) : (
             viewingAlumnus && (
              <AlumniProfilePage
                alumnus={viewingAlumnus}
                submissionData={viewingSubmission || undefined}
              />
            )
        )}
      </Modal>

    </div>
  );
};
