import React from 'react';

interface TextAreaProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, name, value, onChange, rows = 4, placeholder, required = false, error, className = '' }) => {
  const errorClasses = "border-red-300 bg-red-50/50 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500";
  const defaultClasses = "border-slate-200/80 bg-white/60 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 placeholder-slate-400";
  
  return (
    <div className={`w-full group ${className}`}>
      <label htmlFor={name} className="block text-sm font-bold text-slate-700 mb-1.5 transition-colors group-focus-within:text-indigo-600">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder || `Tuliskan ${label.toLowerCase()} di sini...`}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`
            block w-full px-4 py-3 rounded-xl border shadow-sm transition-all duration-200 backdrop-blur-sm
            focus:outline-none focus:ring-2 focus:ring-opacity-50 hover:bg-white resize-y
            ${error ? errorClasses : defaultClasses}
        `}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-red-600 font-medium flex items-center">
             <i className="fas fa-exclamation-triangle mr-1.5 text-xs"></i>
            {error}
        </p>
      )}
    </div>
  );
};