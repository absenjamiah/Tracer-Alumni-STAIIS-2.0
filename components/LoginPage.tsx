import React, { useState, useMemo } from 'react';
import { Alumnus } from '../types';

interface LoginPageProps {
    onLogin: (role: 'admin' | 'alumni', identity?: string, password?: string) => void;
    onForgotPassword: () => void;
    message: {type: 'error' | 'success', text: string} | null;
    alumniList: Alumnus[];
}

type LoginTab = 'alumni' | 'admin';

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onForgotPassword, message, alumniList }) => {
    const [activeTab, setActiveTab] = useState<LoginTab>('alumni');
    const [adminEmail, setAdminEmail] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [alumniNim, setAlumniNim] = useState('');
    const [selectedAngkatan, setSelectedAngkatan] = useState('all');
    
    const [localMessage, setLocalMessage] = useState<{type: 'error' | 'success', text: string} | null>(null);

    const handleAdminSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalMessage(null);
        // Handle Login via parent prop
        onLogin('admin', adminEmail, adminPassword);
    };

    const handleAlumniSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin('alumni', alumniNim);
    };
    
    const angkatanList = useMemo(() => {
        const uniqueAngkatan = [...new Set(alumniList.map(a => a.angkatan).filter(Boolean))];
        return uniqueAngkatan.sort((a: string, b: string) => b.localeCompare(a));
    }, [alumniList]);
    
    const filteredAlumni = useMemo(() => {
        const availableAlumni = alumniList.filter(a => !a.hasSubmitted);
        if (selectedAngkatan === 'all') {
            return availableAlumni;
        }
        return availableAlumni.filter(a => a.angkatan === selectedAngkatan);
    }, [alumniList, selectedAngkatan]);

    const TabButton: React.FC<{tabName: LoginTab, label: string, icon: string}> = ({tabName, label, icon}) => (
        <button
            type="button"
            onClick={() => {
                setActiveTab(tabName);
                setLocalMessage(null);
            }}
            className={`w-full py-3 text-sm font-bold leading-5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2
                focus:outline-none 
                ${activeTab === tabName 
                    ? 'bg-white text-indigo-600 shadow-md transform scale-105' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}
        >
            <i className={`fas ${icon}`}></i>
            {label}
        </button>
    );

    // Combine parent message and local message
    const displayMessage = localMessage || message;

    return (
        <div className="flex items-center justify-center min-h-[80vh] relative z-10">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-10 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 right-10 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

            <div className="w-full max-w-lg">
                <div className="text-center mb-10">
                    <h2 className="text-4xl md:text-5xl font-display font-extrabold text-slate-800 tracking-tight">
                        Tracer<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Study</span>
                    </h2>
                     <p className="mt-4 text-base md:text-lg text-slate-600 font-medium">
                        Portal Alumni STAI Imam Syafi'i Cianjur
                    </p>
                </div>

                <div className="glass-panel p-2 rounded-3xl shadow-2xl">
                    <div className="bg-white/40 p-1.5 rounded-2xl flex mb-6 relative z-20 backdrop-blur-sm">
                       <TabButton tabName="alumni" label="Alumni" icon="fa-user-graduate" />
                       <TabButton tabName="admin" label="Administrator" icon="fa-user-shield" />
                    </div>
                
                    <div className="px-6 pb-8 pt-2">
                        {displayMessage && (
                          <div className={`flex items-center gap-3 p-4 mb-6 rounded-xl text-sm font-medium border ${displayMessage.type === 'error' ? 'bg-red-50/80 border-red-200 text-red-700' : 'bg-green-50/80 border-green-200 text-green-700'}`}>
                            <i className={`fas ${displayMessage.type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'} text-lg`}></i>
                            {displayMessage.text}
                          </div>
                        )}
                        
                        {/* Alumni Login Form */}
                        <div className={`transition-opacity duration-300 ${activeTab === 'alumni' ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
                            <form className="space-y-5" onSubmit={handleAlumniSubmit}>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider ml-1">Pilih Angkatan</label>
                                    <div className="relative">
                                        <select
                                            id="angkatan-select"
                                            name="angkatan"
                                            className="block w-full pl-4 pr-10 py-3.5 border border-slate-200/60 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700 font-medium appearance-none transition-all hover:bg-white/80"
                                            value={selectedAngkatan}
                                            onChange={(e) => {
                                                setSelectedAngkatan(e.target.value);
                                                setAlumniNim('');
                                            }}
                                        >
                                            <option value="all">Semua Angkatan</option>
                                            {angkatanList.map(angkatan => (
                                                <option key={angkatan} value={angkatan}>
                                                    Angkatan {angkatan}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                            <i className="fas fa-chevron-down text-xs"></i>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider ml-1">Nama Alumni</label>
                                    <div className="relative">
                                        <select
                                            id="nim-select"
                                            name="nim"
                                            required
                                            className="block w-full pl-4 pr-10 py-3.5 border border-slate-200/60 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700 font-medium appearance-none transition-all hover:bg-white/80 disabled:opacity-50"
                                            value={alumniNim}
                                            onChange={(e) => setAlumniNim(e.target.value)}
                                            disabled={alumniList.length === 0}
                                        >
                                            <option value="" disabled>-- Cari Nama Anda --</option>
                                            {filteredAlumni.map(alumnus => (
                                                <option key={alumnus.nim} value={alumnus.nim}>
                                                    {alumnus.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                            <i className="fas fa-search text-xs"></i>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 ml-1 mt-1">*Hanya menampilkan alumni yang belum mengisi survei</p>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-2 py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-slate-900 hover:bg-indigo-600 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-1 transform transition-all duration-300 mt-4"
                                >
                                    <span>Mulai Pengisian Kuisioner</span>
                                    <i className="fas fa-arrow-right"></i>
                                </button>
                            </form>
                        </div>

                        {/* Admin Login Form */}
                        <div className={`transition-opacity duration-300 ${activeTab === 'admin' ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
                            <form className="space-y-5" onSubmit={handleAdminSubmit}>
                                <div className="text-center mb-4">
                                     <h3 className="text-lg font-bold text-slate-800">
                                        Selamat Datang Kembali
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Silakan login untuk mengakses dashboard.
                                    </p>
                                </div>
                               
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <i className="fas fa-envelope text-slate-400 group-focus-within:text-indigo-500 transition-colors"></i>
                                        </div>
                                        <input
                                            id="email-address"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            className="block w-full pl-11 pr-4 py-3.5 border border-slate-200/60 rounded-xl bg-white/50 backdrop-blur-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
                                            placeholder="Alamat Email"
                                            value={adminEmail}
                                            onChange={(e) => setAdminEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="relative group">
                                         <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <i className="fas fa-lock text-slate-400 group-focus-within:text-indigo-500 transition-colors"></i>
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            className="block w-full pl-11 pr-4 py-3.5 border border-slate-200/60 rounded-xl bg-white/50 backdrop-blur-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
                                            placeholder="Password"
                                            value={adminPassword}
                                            onChange={(e) => setAdminPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button onClick={(e) => { e.preventDefault(); onForgotPassword(); }} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                                        Lupa password?
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white shadow-lg transform transition-all duration-300 hover:-translate-y-1 bg-slate-800 hover:bg-slate-900 shadow-slate-500/30"
                                >
                                    Masuk Dashboard
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
