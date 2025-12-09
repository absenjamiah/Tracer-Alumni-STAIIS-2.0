import React, { useState, useRef, useEffect } from 'react';
import { Alumnus } from '../types';

interface HeaderProps {
  userRole: 'admin' | 'alumni' | null;
  currentUser: Alumnus | null;
  onLogout: () => void;
  onNavigate: (view: 'edit_profile') => void;
}

export const Header: React.FC<HeaderProps> = ({ userRole, currentUser, onLogout, onNavigate }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
        setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-4 py-3 md:py-4 ${scrolled ? 'bg-white/70 backdrop-blur-xl shadow-lg border-b border-white/40' : 'bg-transparent'}`}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Ganti URL di bawah ini dengan URL logo kampus Anda */}
          <img 
            src="https://i.imgur.com/cWxs1lh.png" 
            alt="Logo STAI Imam Syafi'i Cianjur"
            className="w-10 h-10 md:w-12 md:h-12 object-contain filter drop-shadow-md hover:scale-105 transition-transform duration-300"
          />
          <div>
            <h1 className="text-lg md:text-xl font-display font-bold text-slate-800 leading-tight">
              Tracer<span className="text-indigo-600">Study</span>
            </h1>
            <p className="text-[10px] md:text-xs font-medium text-slate-500 tracking-wide uppercase">STAI Imam Syafi'i Cianjur</p>
          </div>
        </div>
        
        {userRole === 'admin' && (
          <button
            onClick={onLogout}
            className="group bg-white/50 hover:bg-white border border-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2 text-sm"
          >
            <span className="hidden sm:inline">Logout</span>
            <i className="fas fa-sign-out-alt group-hover:text-red-500 transition-colors"></i>
          </button>
        )}

        {userRole === 'alumni' && currentUser && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 bg-white/50 hover:bg-white border border-white/40 p-1.5 pr-4 rounded-full shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:flex flex-col items-start">
                  <span className="font-bold text-xs text-slate-800 leading-none">{currentUser.name.split(' ')[0]}</span>
                  <span className="text-[10px] text-slate-500 leading-none mt-1">Alumni</span>
              </div>
              <i className={`fas fa-chevron-down text-slate-400 text-xs ml-1 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}></i>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl py-2 z-40 border border-white/50 ring-1 ring-black/5 animate-fade-in-up origin-top-right">
                <div className="px-4 py-3 border-b border-slate-100 mb-1 sm:hidden">
                    <p className="font-bold text-slate-800">{currentUser.name}</p>
                    <p className="text-xs text-slate-500">{currentUser.nim}</p>
                </div>
                <button
                  onClick={() => {
                    onNavigate('edit_profile');
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center transition-colors font-medium"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3">
                     <i className="fas fa-user-edit"></i>
                  </div>
                  Ubah Profil
                </button>
                <div className="my-1 border-t border-slate-100"></div>
                <button
                  onClick={() => {
                    onLogout();
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors font-medium"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-red-500 flex items-center justify-center mr-3">
                     <i className="fas fa-sign-out-alt"></i>
                  </div>
                  Keluar Aplikasi
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};