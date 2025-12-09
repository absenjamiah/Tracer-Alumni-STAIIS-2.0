
import React, { useState } from 'react';
import { Question, QuestionType } from '../types';

interface QuestionManagerProps {
  questions: Question[];
  onSave: (question: Question) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const QuestionManager: React.FC<QuestionManagerProps> = ({ questions, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Question>({
    id: '',
    label: '',
    type: 'text',
    section: 'identitas',
    options: [],
    required: false
  });
  const [optionsString, setOptionsString] = useState(''); // Helper for text input of options

  const sections = [
    { value: 'identitas', label: 'Bagian A: Identitas' },
    { value: 'pendidikan', label: 'Bagian B: Pendidikan' },
    { value: 'pekerjaan', label: 'Bagian C: Pekerjaan' },
    { value: 'studi_lanjut', label: 'Bagian E: Studi Lanjut' },
    { value: 'hubungan', label: 'Bagian F: Hubungan & Jaringan' }
  ];

  const handleAddNew = () => {
    setFormData({
      id: `custom_${Date.now()}`,
      label: '',
      type: 'text',
      section: 'identitas',
      options: [],
      required: false
    });
    setOptionsString('');
    setIsEditing(true);
  };

  const handleEdit = (q: Question) => {
    setFormData(q);
    setOptionsString(q.options ? q.options.join(', ') : '');
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = { ...formData };
    if (finalData.type === 'select' || finalData.type === 'radio') {
      finalData.options = optionsString.split(',').map(s => s.trim()).filter(Boolean);
    } else {
      finalData.options = [];
    }
    
    await onSave(finalData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h3 className="text-xl font-bold text-slate-800">Manajemen Kuesioner</h3>
           <p className="text-sm text-slate-500">Tambahkan pertanyaan kustom ke dalam formulir.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          <i className="fas fa-plus"></i> Tambah Soal
        </button>
      </div>

      {isEditing && (
        <div className="glass-panel p-6 rounded-2xl border border-indigo-100 shadow-xl bg-indigo-50/30 animate-fade-in-up">
           <h4 className="font-bold text-indigo-800 mb-4">{formData.id.startsWith('custom_') ? 'Buat Soal Baru' : 'Edit Soal'}</h4>
           <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Pertanyaan</label>
                <input 
                  type="text" 
                  value={formData.label} 
                  onChange={e => setFormData({...formData, label: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Tipe Jawaban</label>
                    <select 
                      value={formData.type} 
                      onChange={e => setFormData({...formData, type: e.target.value as QuestionType})}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="text">Isian Singkat</option>
                      <option value="textarea">Isian Panjang (Paragraf)</option>
                      <option value="radio">Pilihan Ganda (Radio)</option>
                      <option value="select">Dropdown</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Posisi Bagian</label>
                    <select 
                      value={formData.section} 
                      onChange={e => setFormData({...formData, section: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      {sections.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                 </div>
              </div>

              {(formData.type === 'radio' || formData.type === 'select') && (
                 <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Opsi Jawaban (Pisahkan dengan koma)</label>
                    <input 
                      type="text" 
                      value={optionsString} 
                      onChange={e => setOptionsString(e.target.value)}
                      placeholder="Contoh: Ya, Tidak, Mungkin"
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                      required
                    />
                 </div>
              )}
              
              <div className="flex items-center gap-2">
                 <input 
                   type="checkbox" 
                   id="req"
                   checked={formData.required}
                   onChange={e => setFormData({...formData, required: e.target.checked})}
                   className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                 />
                 <label htmlFor="req" className="text-sm font-medium text-slate-700">Wajib Diisi</label>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                 <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-bold transition-colors">Batal</button>
                 <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-md">Simpan Soal</button>
              </div>
           </form>
        </div>
      )}

      <div className="space-y-4">
         {questions.length === 0 ? (
           <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
             <p>Belum ada soal tambahan.</p>
           </div>
         ) : (
           sections.map(section => {
             const sectionQuestions = questions.filter(q => q.section === section.value);
             if (sectionQuestions.length === 0) return null;
             
             return (
               <div key={section.value} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 font-bold text-slate-700 text-sm">
                    {section.label}
                  </div>
                  <div className="divide-y divide-slate-100">
                    {sectionQuestions.map(q => (
                       <div key={q.id} className="p-4 flex justify-between items-center group hover:bg-slate-50 transition-colors">
                          <div>
                             <p className="font-bold text-slate-800 text-sm">{q.label}</p>
                             <div className="flex gap-2 mt-1">
                                <span className="text-[10px] uppercase font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">{q.type}</span>
                                {q.required && <span className="text-[10px] uppercase font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">Wajib</span>}
                             </div>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => handleEdit(q)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-600 flex items-center justify-center transition-colors">
                               <i className="fas fa-edit text-xs"></i>
                             </button>
                             <button onClick={() => { if(window.confirm('Hapus soal ini?')) onDelete(q.id); }} className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors">
                               <i className="fas fa-trash text-xs"></i>
                             </button>
                          </div>
                       </div>
                    ))}
                  </div>
               </div>
             )
           })
         )}
      </div>
    </div>
  );
};
