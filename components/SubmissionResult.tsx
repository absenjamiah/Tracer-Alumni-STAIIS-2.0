import React from 'react';

interface SubmissionResultProps {
  summary: string;
  onReset: () => void;
  alumniName: string;
}

export const SubmissionResult: React.FC<SubmissionResultProps> = ({ summary, onReset, alumniName }) => {
  const formattedSummary = summary.split('\n').map((line, index) => {
    if (line.startsWith('* ') || line.startsWith('- ')) {
      return (
        <li key={index} className="flex items-start">
          <span className="text-indigo-500 mr-2 mt-1">&#10003;</span>
          <span>{line.substring(2)}</span>
        </li>
      );
    }
    // Handle headings or bold text from Gemini
    if (line.match(/\*\*(.*?)\*\*/)) {
       return <h4 key={index} className="font-semibold text-slate-700 mt-4 mb-2">{line.replace(/\*\*/g, '')}</h4>
    }
    return <p key={index} className="mb-2">{line}</p>;
  });

  return (
    <div className="text-center py-10 px-4">
      <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <i className="fas fa-check-circle text-6xl text-white"></i>
      </div>
      <h2 className="text-4xl font-bold text-slate-800 mb-4">Terima Kasih, {alumniName}!</h2>
      <p className="text-slate-600 mb-8 max-w-2xl mx-auto">Data Anda telah berhasil kami terima. Kontribusi Anda sangat berharga bagi pengembangan almamater.</p>
      
      <div className="bg-white/60 backdrop-blur-lg border border-white/30 rounded-2xl p-6 text-left max-w-2xl mx-auto shadow-xl">
        <h3 className="text-xl font-semibold text-slate-800 mb-4 text-center">Ringkasan Jawaban Anda</h3>
        <div className="text-slate-700 space-y-2">{formattedSummary}</div>
      </div>

      <button
        onClick={onReset}
        className="mt-10 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:shadow-xl hover:-translate-y-0.5 transform transition-all duration-300 ease-in-out flex items-center mx-auto"
      >
        <i className="fas fa-home mr-2"></i>
        Kembali ke Halaman Awal
      </button>
    </div>
  );
};