import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  LabelList
} from 'recharts';
import { FormData } from '../types';

interface EvaluasiMutuCardProps {
  submissions?: { [nim: string]: FormData };
}

// Comprehensive baseline/historical dataset mapping for all study programs
const BASELINE_DATA: Record<string, { year: number; value: number }[]> = {
  all: [
    { year: 2015, value: 10 },
    { year: 2016, value: 14 },
    { year: 2017, value: 8 },
    { year: 2018, value: 12 },
    { year: 2019, value: 9 },
    { year: 2020, value: 5 },
    { year: 2021, value: 11 },
    { year: 2022, value: 8 },
    { year: 2023, value: 1 },
    { year: 2024, value: 3 },
    { year: 2025, value: 5 },
    { year: 2026, value: 7 }
  ],
  hki: [
    { year: 2015, value: 6 },
    { year: 2016, value: 9 },
    { year: 2017, value: 5 },
    { year: 2018, value: 7 },
    { year: 2019, value: 5 },
    { year: 2020, value: 3 },
    { year: 2021, value: 6 },
    { year: 2022, value: 5 },
    { year: 2023, value: 1 },
    { year: 2024, value: 2 },
    { year: 2025, value: 3 },
    { year: 2026, value: 4 }
  ],
  pba: [
    { year: 2015, value: 4 },
    { year: 2016, value: 5 },
    { year: 2017, value: 3 },
    { year: 2018, value: 5 },
    { year: 2019, value: 4 },
    { year: 2020, value: 2 },
    { year: 2021, value: 5 },
    { year: 2022, value: 3 },
    { year: 2023, value: 0 },
    { year: 2024, value: 1 },
    { year: 2025, value: 2 },
    { year: 2026, value: 3 }
  ]
};

export const EvaluasiMutuCard: React.FC<EvaluasiMutuCardProps> = ({ submissions = {} }) => {
  const [selectedProdi, setSelectedProdi] = useState<string>('all');
  const [endYear, setEndYear] = useState<number>(2024);

  // Compute live aggregates from database submissions
  const liveCounts = useMemo(() => {
    const counts: Record<string, Record<string, number>> = {
      all: {},
      hki: {},
      pba: {}
    };

    const matchesWaitingOption = (waktu?: any): boolean => {
      if (waktu === undefined || waktu === null) return false;
      // trim spaces, convert to lowercase, and replace unicode/regular dashes to normalize
      const normalized = String(waktu).trim().toLowerCase().replace(/\s+/g, '').replace(/–/g, '-');
      return (
        normalized === '<3bulan' ||
        normalized === '3-6bulan' ||
        normalized === '6-12bulan' ||
        normalized === '>1tahun'
      );
    };

    Object.values(submissions).forEach((sub) => {
      // Must be employed
      if (sub.pekerjaan_status !== 'Ya') return;

      // Validate wait times (masa tunggu)
      const waktu = sub.pekerjaan_waktuTunggu;
      if (!matchesWaitingOption(waktu)) return;

      // Classify by graduation year (identitas_tahunLulus)
      const yearStr = sub.identitas_tahunLulus;
      if (yearStr === undefined || yearStr === null) return;
      const year = String(yearStr).trim();
      if (!year) return;

      const prodi = sub.identitas_programStudi || '';
      const prodiNorm = String(prodi).toLowerCase();

      // Accumulate total
      counts.all[year] = (counts.all[year] || 0) + 1;

      // Accumulate specific prodi
      if (prodiNorm.includes('hukum') || prodiNorm.includes('hki')) {
        counts.hki[year] = (counts.hki[year] || 0) + 1;
      } else if (prodiNorm.includes('bahasa arab') || prodiNorm.includes('pba')) {
        counts.pba[year] = (counts.pba[year] || 0) + 1;
      }
    });

    return counts;
  }, [submissions]);

  // Generate 7 years of data ending with the selected endYear
  const processedData = useMemo(() => {
    if (!selectedProdi) return [];

    const yearsToInclude = Array.from({ length: 7 }, (_, i) => endYear - 6 + i);
    
    return yearsToInclude.map((year) => {
      // Baseline historical value
      const baseList = BASELINE_DATA[selectedProdi] || [];
      const basePoint = baseList.find((d) => d.year === year);
      const baseVal = basePoint ? basePoint.value : 0;

      // Live submission value
      const liveMap = liveCounts[selectedProdi] || {};
      const liveVal = liveMap[year.toString()] || 0;

      const totalVal = baseVal + liveVal;

      return {
        year,
        "Lulusan Terserap": totalVal,
        "Pertumbuhan": null as number | null,
        "PertumbuhanDisplay": "0%"
      };
    });
  }, [selectedProdi, endYear, liveCounts]);

  const finalProcessedData = useMemo(() => {
    if (processedData.length === 0) return [];

    return processedData.map((item, index) => {
      let growthRate: number | null = null;

      if (index > 0) {
        const prevVal = processedData[index - 1]["Lulusan Terserap"];
        const currentVal = item["Lulusan Terserap"];

        if (prevVal > 0) {
          growthRate = ((currentVal - prevVal) / prevVal) * 100;
        } else {
          growthRate = 0; // Division by zero protection
        }
      }

      return {
        ...item,
        "Pertumbuhan": growthRate,
        "PertumbuhanDisplay": index === 0 ? "0%" : `${growthRate! >= 0 ? '+' : ''}${Math.round(growthRate!)}%`
      };
    });
  }, [processedData]);

  // Compute dynamic KPI parameters and score metrics
  const kpiData = useMemo(() => {
    if (!selectedProdi || finalProcessedData.length === 0) {
      return {
        realisasiText: "",
        skor: "",
        statusText: "",
        statusAlertText: "",
        statusBgColor: "bg-slate-50 border-slate-200 text-slate-500",
        badgeBgColor: "bg-slate-100 text-slate-700 border-slate-200/50",
        alertTextClass: "text-slate-600",
        scoreColorClass: "text-slate-400 bg-slate-50 border-slate-200",
        hasData: false
      };
    }

    // Average of year-over-year growth rates from 2nd active year onwards
    let totalGrowth = 0;
    let growthCount = 0;

    for (let i = 1; i < finalProcessedData.length; i++) {
      const rate = finalProcessedData[i].Pertumbuhan;
      if (rate !== null && rate !== undefined) {
        totalGrowth += rate;
        growthCount++;
      }
    }

    const averageGrowth = growthCount > 0 ? totalGrowth / growthCount : 0;
    const realisasiText = `${averageGrowth.toFixed(2)}%`;

    // Dynamic Score Mutu (Tiered logic including index 1)
    let skorNum = 0;
    if (averageGrowth >= 35) {
      skorNum = 4;
    } else if (averageGrowth >= 30) {
      skorNum = 3;
    } else if (averageGrowth >= 10) {
      skorNum = 2; // Kurang
    } else if (averageGrowth > 0) {
      skorNum = 1; // Sangat Kurang
    } else {
      skorNum = 0; // Tidak Tercapai
    }

    // Matriks Konversi Skor menjadi Status Ketercapaian
    let statusText = "";
    let statusAlertText = "";
    let statusBgColor = "";
    let badgeBgColor = "";
    let alertTextClass = "";
    let scoreColorClass = "";

    if (skorNum === 4) {
      statusText = "Melampaui Target";
      statusAlertText = "Melampaui Target: Akumulasi peningkatan penyerapan lulusan melebihi 30% pertahun.";
      statusBgColor = "bg-emerald-50 border-emerald-200/80 text-emerald-950 border-l-4 border-l-emerald-500";
      badgeBgColor = "bg-emerald-100 border border-emerald-200 text-emerald-900 font-extrabold shadow-sm";
      alertTextClass = "text-emerald-800 font-semibold";
      scoreColorClass = "text-emerald-600 bg-emerald-50 border-emerald-100";
    } else if (skorNum === 3) {
      statusText = "Tercapai";
      statusAlertText = "Tercapai: Akumulasi peningkatan penyerapan lulusan sesuai target 30% pertahun.";
      statusBgColor = "bg-teal-50 border-teal-200/80 text-teal-950 border-l-4 border-l-teal-500";
      badgeBgColor = "bg-teal-100 border border-teal-200 text-teal-900 font-extrabold shadow-sm";
      alertTextClass = "text-teal-800 font-semibold";
      scoreColorClass = "text-teal-600 bg-teal-50 border-teal-100";
    } else if (skorNum === 2) {
      statusText = "Kurang";
      statusAlertText = "Kurang: Terdapat peningkatan akumulatif, namun belum mencapai target 30% pertahun.";
      statusBgColor = "bg-amber-50 border-amber-200/80 text-amber-950 border-l-4 border-l-amber-500";
      badgeBgColor = "bg-amber-100 border border-amber-200/60 text-amber-900 font-extrabold shadow-sm";
      alertTextClass = "text-amber-800 font-semibold";
      scoreColorClass = "text-amber-600 bg-amber-50 border-amber-100";
    } else if (skorNum === 1) {
      statusText = "Sangat Kurang";
      statusAlertText = "Sangat Kurang: Peningkatan akumulatif sangat minim dan jauh dari target.";
      statusBgColor = "bg-rose-50 border-rose-200/85 text-rose-950 border-l-4 border-l-rose-400";
      badgeBgColor = "bg-rose-100 border border-rose-200/60 text-rose-900 font-extrabold shadow-sm";
      alertTextClass = "text-rose-800 font-semibold";
      scoreColorClass = "text-rose-500 bg-rose-50 border-rose-100";
    } else {
      statusText = "Tidak Tercapai";
      statusAlertText = "Tidak Tercapai: Secara akumulasi stagnan atau menurun.";
      statusBgColor = "bg-red-50 border-red-200/80 text-red-950 border-l-4 border-l-red-500";
      badgeBgColor = "bg-red-100 border border-red-200/60 text-red-900 font-extrabold shadow-sm";
      alertTextClass = "text-red-800 font-semibold";
      scoreColorClass = "text-red-600 bg-red-50 border-red-100";
    }

    return {
      realisasiText,
      skor: skorNum.toString(),
      statusText,
      statusAlertText,
      statusBgColor,
      badgeBgColor,
      alertTextClass,
      scoreColorClass,
      hasData: true
    };
  }, [selectedProdi, finalProcessedData]);

  // Enhanced custom tooltip to make it crystal clear
  const CustomComposedTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const graduates = payload.find((p: any) => p.name === 'Lulusan Terserap')?.value;
      const growth = payload.find((p: any) => p.name === 'Pertumbuhan')?.value;
      const year = payload[0]?.payload?.year;
      
      return (
        <div className="bg-white/95 backdrop-blur-md p-4 border border-violet-100 rounded-2xl shadow-xl ring-1 ring-black/5 animate-scale-in">
          <p className="font-display font-bold text-slate-800 text-sm mb-2 border-b border-slate-100 pb-1.5 flex justify-between items-center">
            <span>Tahun Kelulusan: {year}</span>
            <span className="text-violet-600 bg-violet-50 text-[10px] px-2 py-0.5 rounded-full font-sans">Mutu</span>
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-500"></span>
                <span className="text-xs text-slate-500 font-medium">Lulusan Terserap Kerja:</span>
              </div>
              <span className="text-sm font-black text-slate-800">{graduates ?? 0} orang</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
                <span className="text-xs text-slate-500 font-medium">YoY Growth Rate:</span>
              </div>
              <span className={`text-sm font-black ${growth >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {growth !== null && growth !== undefined ? `${growth >= 0 ? '+' : ''}${growth.toFixed(2)}%` : '0.00%'}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="evaluasi-komponen" className="glass-panel rounded-3xl p-6 shadow-md border border-white/60 mb-6 font-sans">
      {/* Visual Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100/60 mb-6">
        <div>
          <span className="text-[10px] bg-violet-50 text-violet-600 font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block shadow-sm">
            Standar Mutu MRD.Pend.1.1
          </span>
          <h4 className="text-lg font-display font-black text-slate-800 tracking-tight">
            Evaluasi Ketercapaian Standar Mutu
          </h4>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Grafik Penyerapan Kerja Lulusan & Akumulasi Pertumbuhan Mutu
          </p>
        </div>

        {/* Input & Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Program Studi Filter (B4) */}
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-left">
              Program Studi (B4)
            </label>
            <div className="relative">
              <select
                id="prodi-selector"
                value={selectedProdi}
                onChange={(e) => setSelectedProdi(e.target.value)}
                className="text-xs font-semibold text-slate-700 bg-white border border-slate-200/80 rounded-xl px-3 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer appearance-none shadow-sm min-w-[200px]"
              >
                <option value="all">Semua Program Studi</option>
                <option value="hki">Hukum Keluarga Islam</option>
                <option value="pba">Pendidikan Bahasa Arab</option>
                <option value="">— Kosongkan Filter —</option>
              </select>
              <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none"></i>
            </div>
          </div>

          {/* Hasta TS Year End Filter */}
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-left">
              Sampai TS
            </label>
            <div className="relative">
              <select
                id="ts-selector"
                value={endYear}
                onChange={(e) => setEndYear(parseInt(e.target.value))}
                className="text-xs font-semibold text-slate-700 bg-white border border-slate-200/80 rounded-xl px-3 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer appearance-none shadow-sm whitespace-nowrap"
              >
                {[2026, 2025, 2024, 2023, 2022, 2021, 2020].map((yr) => (
                  <option key={yr} value={yr}>
                    TS {yr}
                  </option>
                ))}
              </select>
              <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Visuals and Score Card side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Composed Chart Wrapper (7 Columns) */}
        <div id="chart-wrapper" className="lg:col-span-7 flex flex-col justify-between min-h-[300px]">
          <div className="mb-4 text-left">
            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Tren Keterserapan & Pertumbuhan YoY ({endYear - 6} - {endYear})
            </h5>
          </div>

          {selectedProdi ? (
            <div className="h-[280px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={finalProcessedData}
                  margin={{ top: 15, right: 10, left: -20, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.85} />
                      <stop offset="100%" stopColor="#6d28d9" stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="year"
                    stroke="#94a3b8"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#64748b', fontWeight: 600 }}
                  />
                  
                  {/* Left YAxis - Abs Graduates absorbed */}
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    stroke="#8b5cf6"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#8b5cf6', fontWeight: 500 }}
                    label={{ value: 'Lulusan Terserap', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 10, fill: '#8b5cf6', fontWeight: 500 } }}
                  />
                  
                  {/* Right YAxis - Growth rate YoY */}
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#db2777"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `${val}%`}
                    tick={{ fill: '#db2777', fontWeight: 500 }}
                    label={{ value: 'Yoy Growth Rate', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fontSize: 10, fill: '#db2777', fontWeight: 500 } }}
                  />
                  
                  <Tooltip content={<CustomComposedTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconSize={12}
                    iconType="circle"
                    wrapperStyle={{ fontSize: '11px', fontWeight: 500, pt: 10 }}
                  />
                  
                  {/* Bar Chart for nominal graduates absorbed */}
                  <Bar
                    yAxisId="left"
                    name="Lulusan Terserap"
                    dataKey="Lulusan Terserap"
                    fill="url(#barGradient)"
                    radius={[5, 5, 0, 0]}
                    barSize={24}
                    animationDuration={1200}
                  >
                    {finalProcessedData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="url(#barGradient)" />
                    ))}
                  </Bar>
                  
                  {/* Line Chart for growth rate values */}
                  <Line
                    yAxisId="right"
                    type="monotone"
                    name="Pertumbuhan"
                    dataKey="Pertumbuhan"
                    stroke="#db2777"
                    strokeWidth={3}
                    dot={{ r: 4, stroke: '#db2777', strokeWidth: 1, fill: '#fff' }}
                    activeDot={{ r: 6, fill: '#db2777' }}
                    animationDuration={1200}
                  >
                    <LabelList
                      dataKey="PertumbuhanDisplay"
                      position="top"
                      style={{ fill: '#db2777', fontSize: 10, fontWeight: 700 }}
                    />
                  </Line>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center p-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              <i className="fas fa-chart-line text-slate-300 text-3xl mb-2"></i>
              <p className="text-slate-400 font-medium text-xs text-center">
                Pilih Program Studi (B4) untuk menampilkan visualisasi grafik tren keterserapan
              </p>
            </div>
          )}
        </div>

        {/* Score Card Section (5 Columns) */}
        <div id="scorecard-wrapper" className="lg:col-span-5 flex flex-col justify-between">
          <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-200/50 space-y-4 flex-grow flex flex-col justify-between shadow-sm">
            
            {/* Target and Realization metrics */}
            <div className="space-y-3">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">
                KPIN / SCORE CARD DETAIL
              </h5>

              {/* Target Row */}
              <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center text-xs shadow-sm">
                    <i className="fas fa-bullseye"></i>
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Tahunan</p>
                    <p className="text-xs text-slate-500 font-medium">Evaluasi Keterserapan</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-slate-800 bg-slate-50 border border-slate-200 px-2 py-1 rounded-md">
                    30% Peningkatan
                  </span>
                </div>
              </div>

              {/* Realization Row (Kolom K) */}
              <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs shadow-sm">
                    <i className="fas fa-check-double"></i>
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Realisasi (K)</p>
                    <p className="text-xs text-slate-500 font-medium">Rata-rata Pertumbuhan</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span id="realisasi-val" className="text-sm font-black text-emerald-600 min-h-[20px] transition-all">
                    {kpiData.realisasiText}
                  </span>
                </div>
              </div>

              {/* Score Mutu Row (Kolom L) */}
              <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center text-xs shadow-sm">
                    <i className="fas fa-award"></i>
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Skor Mutu (L)</p>
                    <p className="text-xs text-slate-500 font-medium">Kategori Kelayakan</p>
                  </div>
                </div>
                <div className="text-right">
                  <span id="skor-val" className={`text-lg font-black px-3 py-1 rounded-full transition-all border min-w-[32px] inline-block text-center ${kpiData.scoreColorClass}`}>
                    {kpiData.skor}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Alert (Kolom M) */}
            {selectedProdi ? (
              <div id="status-alert" className={`border rounded-2xl p-4 flex gap-3 animate-fade-in transition-all ${kpiData.statusBgColor}`}>
                <div id="alert-icon" className="text-lg mt-0.5 shrink-0">
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                <div className="space-y-1 text-left">
                  <p className="text-xs font-black uppercase tracking-wider">
                    Status Ketercapaian (M)
                  </p>
                  <p className={`text-xs leading-relaxed ${kpiData.alertTextClass}`}>
                    <span className={`rounded px-1.5 py-0.5 text-[10px] uppercase font-extrabold mr-1.5 shadow-sm border ${kpiData.badgeBgColor}`}>
                      {kpiData.statusText}
                    </span>{" "}
                    {kpiData.statusAlertText}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex gap-3 text-slate-400 text-left">
                <i className="fas fa-info-circle text-sm mt-0.5"></i>
                <div className="space-y-0.5">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Status Ketercapaian (M)
                  </p>
                  <p className="text-xs font-medium">
                    (Masukkan atau pilih Program Studi untuk menentukan status ketercapaian)
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
