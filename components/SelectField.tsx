import React from 'react';

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  error?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({ label, name, value, onChange, options, required = false, error }) => {
  const errorClasses = "border-red-300 bg-red-50/50 text-red-900 focus:ring-red-500 focus:border-red-500";
  const defaultClasses = "border-slate-200/80 bg-white/60 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800";

  return (
    <div className="w-full group">
      <label htmlFor={name} className="block text-sm font-bold text-slate-700 mb-1.5 transition-colors group-focus-within:text-indigo-600">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
            className={`
                block w-full pl-4 pr-10 py-3.5 rounded-xl border shadow-sm transition-all duration-200 backdrop-blur-sm appearance-none
                focus:outline-none focus:ring-2 focus:ring-opacity-50 hover:bg-white
                ${error ? errorClasses : defaultClasses}
            `}
        >
            <option value="" disabled className="text-slate-400">Pilih salah satu...</option>
            {options.map(option => (
            <option key={option.value} value={option.value} className="text-slate-800 py-2">
                {option.label}
            </option>
            ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 group-hover:text-indigo-500 transition-colors">
            <i className="fas fa-chevron-down text-xs"></i>
        </div>
      </div>
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-red-600 font-medium flex items-center">
             <i className="fas fa-exclamation-triangle mr-1.5 text-xs"></i>
            {error}
        </p>
      )}
    </div>
  );
};